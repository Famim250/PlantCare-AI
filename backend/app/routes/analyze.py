from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from typing import Optional
from sqlalchemy.orm import Session
from app.schemas.response import AnalysisResponse, HeatmapRegion, AlternativePrediction
from app.services.disease_mapper import disease_mapper
from app.services.health_score import calculate_health_score
from app.services.storage import upload_mock_s3
from app.model.inference import run_inference
from app.database import get_db
from app.models import Diagnosis, User
from app.dependencies import get_current_user
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.config import settings
import time

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

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(
    image: UploadFile = File(...),
    cropType: str = Form(...),
    mode: str = Form("beginner"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    try:
        # 1. Read Image
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File provided is not an image.")
            
        # 1a. Upload image to 'S3' mock
        image_url = upload_mock_s3(image)
        image_bytes = await image.read()
        
        # 2. Run Inference (Preprocess, Predict, Heatmap)
        inference_result = run_inference(image_bytes)
        
        # 3. Map to Disease JSON
        class_id = inference_result["class_id"]
        confidence = inference_result["confidence"]
        disease_info = disease_mapper.map_prediction_to_disease(class_id)
        
        # 5. Generate Health Score
        health_score_data = calculate_health_score(disease_info, confidence)
        
        # 6. Generate Alternatives
        alternatives = [
            AlternativePrediction(
                disease=disease_mapper.map_prediction_to_disease("healthy"),
                confidence=round((1 - confidence) * 0.7, 2)
            )
        ]
        
        # 7. Save to Database
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
        
        # 8. Build Response
        response = AnalysisResponse(
            disease=disease_info,
            confidence=confidence,
            processingTime=inference_result.get("processing_time", 1500),
            alternatives=alternatives,
            healthScore=health_score_data,
            heatmapRegions=[HeatmapRegion(**h) for h in inference_result["heatmap"]],
            confidenceLevel="High" if confidence > 0.85 else "Medium" if confidence > 0.6 else "Low",
            multiDiseaseWarning=False
        )
        
        return response

    except Exception as e:
        print(f"Error processing image: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error during analysis.")

