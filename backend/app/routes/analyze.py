import logging
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.schemas.response import AnalysisResponse, HeatmapRegion, AlternativePrediction
from app.services.disease_mapper import disease_mapper
from app.services.health_score import calculate_health_score
from app.services.storage import upload_mock_s3
from app.services.gemini_vision import analyze_plant_image
from app.model.inference import run_inference
from app.database import get_db
from app.models import Diagnosis, User
from app.dependencies import get_current_user
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.config import settings

logger = logging.getLogger("plantcare")

router = APIRouter()
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None
        
    user = db.query(User).filter(User.email == email).first()
    return user

def safe_int(value: Any, default: int = 0) -> int:
    """Safely convert strings like '75%' or 'high' to an integer without crashing"""
    try:
        if isinstance(value, str):
            # Extract just digits
            digits = ''.join(filter(str.isdigit, str(value)))
            if digits:
                return int(digits)
            return default
        return int(float(value)) if value is not None else default
    except (ValueError, TypeError):
        return default

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_image(
    image: UploadFile = File(...),
    cropType: Optional[str] = Form(None),
    mode: Optional[str] = Form("beginner"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    try:
        # 1. Validate content type
        if not image.content_type or not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File provided is not an image.")
            
        # 1a. Read exact image bytes once into RAM
        image_bytes = image.file.read()
        logger.info(f"Received image: {len(image_bytes)} bytes, filename={image.filename}")
        
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image payload received")
            
        # 1b. Upload image to 'S3' mock
        safe_filename = image.filename or "upload.jpg"
        image_url = upload_mock_s3(image_bytes, safe_filename)
        
        # ================================================
        # PRIMARY PATH: Gemini Vision (smart identification)
        # ================================================
        gemini_result = analyze_plant_image(image_bytes)
        
        if gemini_result:
            logger.info(f"Using Gemini Vision result: {gemini_result['plant_name']} - {gemini_result['disease_name']}")
            
            class_id = gemini_result["disease_id"]
            confidence = float(gemini_result.get("confidence", 0.85))
            
            # Build disease info from Gemini's rich response
            disease_info = _build_disease_from_gemini(gemini_result)
            
            # Use Gemini's AI-calculated health scores directly
            health_score_data = {
                "score": safe_int(gemini_result.get("health_score"), 75),
                "breakdown": {
                    "leafCondition": safe_int(gemini_result.get("leaf_condition"), 70),
                    "infectionSeverity": safe_int(gemini_result.get("infection_severity"), 30),
                    "colorAnalysis": safe_int(gemini_result.get("color_analysis"), 70)
                }
            }
            
            # Heatmap placeholder
            heatmap = [{"x": 0.5, "y": 0.5, "radius": 0.15, "intensity": 0.8}] if "healthy" not in class_id else []
            processing_time = 2000
            
        else:
            # ================================================
            # FALLBACK: MobileNetV2 (if Gemini fails)
            # ================================================
            logger.info("Gemini Vision unavailable, falling back to MobileNetV2")
            
            try:
                inference_result = run_inference(image_bytes)
            except ValueError as ve:
                raise HTTPException(status_code=400, detail=str(ve))
            
            class_id = inference_result["class_id"]
            confidence = inference_result["confidence"]
            disease_info = disease_mapper.map_prediction_to_disease(class_id, confidence=confidence)
            
            # Allow user-selected cropType to override "Unrecognized Image" name
            if class_id == "unknown" and cropType and cropType != "auto":
                formatted_crop = cropType.capitalize()
                disease_info["name"] = f"{formatted_crop} (Unrecognized Condition)"
                disease_info["beginnerDescription"] = f"We couldn't confidently identify a specific condition, but we've recorded this as a {formatted_crop} based on your selection."
                
            health_score_data = calculate_health_score(disease_info, confidence)
            heatmap = inference_result["heatmap"]
            processing_time = inference_result.get("processing_time", 1500)
        
        logger.info(f"Final result: class_id={class_id}, confidence={confidence}")
        
        # Generate Alternatives
        alternatives = [
            AlternativePrediction(
                disease=disease_mapper.map_prediction_to_disease("healthy", confidence=0.0),
                confidence=round(float((1 - confidence) * 0.7), 2)
            )
        ]
        
        # Save to Database
        db_diagnosis = Diagnosis(
            user_id=current_user.id if current_user else None,
            crop_type=cropType,
            disease_id=class_id,
            confidence=confidence,
            health_score=health_score_data["score"],
            image_url=image_url
        )
        db.add(db_diagnosis)
        db.commit()
        db.refresh(db_diagnosis)
        
        # Build Response
        response = AnalysisResponse(
            disease=disease_info,
            confidence=confidence,
            processingTime=processing_time,
            alternatives=alternatives,
            healthScore=health_score_data,
            heatmapRegions=[HeatmapRegion(**h) for h in heatmap],
            confidenceLevel="high" if confidence > 0.85 else "medium" if confidence > 0.6 else "low",
            multiDiseaseWarning=False
        )
        
        return response

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Unhandled error in analyze_image: {e}")
        raise


def _build_disease_from_gemini(gemini: dict) -> dict:
    """Convert Gemini Vision's response into the Disease schema expected by the frontend."""
    disease_id = gemini.get("disease_id", "unknown")
    name = gemini.get("disease_name", "Unknown Condition")
    plant = gemini.get("plant_name", "Unknown Plant")
    severity = gemini.get("severity", "medium")
    
    # Calculate health score impact from Gemini's scores
    health_score = safe_int(gemini.get("health_score"), 75)
    health_impact = max(0, 100 - health_score)
    
    is_healthy = "healthy" in disease_id.lower() or "healthy" in name.lower()
    
    # Use treatment from Gemini if available, else generic
    treatment = gemini.get("treatment", {})
    treatment_plan = {
        "immediate": treatment.get("immediate", ["Monitor your plant closely."]),
        "organic": treatment.get("organic", ["Maintain good airflow."]),
        "chemical": treatment.get("chemical", ["Consult a professional."]),
        "prevention": treatment.get("prevention", ["Practice crop rotation."]),
        "recoveryTimeline": treatment.get("recoveryTimeline", "Varies by condition.")
    }
    
    display_name = f"{plant} — {name}" if not is_healthy else f"{plant} (Healthy)"
    
    if "unrecognized" in plant.lower() or name.lower() in ["unknown", "n/a", "none"]:
        display_name = plant
    
    return {
        "id": disease_id,
        "name": display_name,
        "cropFamily": "auto",
        "recommendations": gemini.get("recommendations", [
            "Monitor your plant for changes.",
            "Ensure proper watering and sunlight.",
            "Consult a local expert if needed."
        ]),
        "severity": severity,
        "treatment": treatment_plan,
        "beginnerDescription": gemini.get("beginner_description",
            f"Our AI identified this as a {plant}. " + 
            ("Your plant looks healthy!" if is_healthy else f"A condition called {name} was detected.")),
        "advancedDescription": gemini.get("advanced_description",
            f"Gemini Vision identified {plant} with condition: {name}."),
        "commonRegions": [],
        "seasonalRisk": [],
        "healthScoreImpact": health_impact
    }
