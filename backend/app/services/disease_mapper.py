import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.config import settings

# Configure Gemini once
if hasattr(settings, 'gemini_api_key') and settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
else:
    # Fallback to direct environment variable if pydantic config misses it
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)

class DiseaseMapper:
    def __init__(self):
        self.diseases: List[Dict[str, Any]] = []
        self._load_diseases()

    def _load_diseases(self):
        """Loads disease definitions from diseases.json"""
        json_path = Path(__file__).parent / "diseases.json"
        
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                self.diseases = json.load(f)
        except Exception as e:
            print(f"Failed to load user disease json from {json_path}: {e}")
            self.diseases = []
            
    def get_disease_by_id(self, disease_id: str) -> Optional[Dict[str, Any]]:
        for d in self.diseases:
            if d.get("id") == disease_id:
                return d
        return None

    def map_prediction_to_disease(self, class_name: str, confidence: float = 0.99) -> Dict[str, Any]:
        """
        Maps a prediction class string to a disease object.
        If not found in the hardcoded JSON, dynamically generates treatment via Gemini.
        """
        disease = self.get_disease_by_id(class_name)
        
        if disease:
            return disease
            
        if class_name == "unknown":
            return {
                "id": "healthy",
                "name": "Healthy Plant",
                "cropFamily": "auto",
                "recommendations": [
                    "Continue your regular care routine.",
                    "Ensure adequate sunlight and water.",
                    "Monitor for any signs of stress."
                ],
                "severity": "low",
                "treatment": {
                    "immediate": ["No immediate action required."],
                    "organic": [],
                    "chemical": [],
                    "prevention": ["Ensure adequate sunlight and water."],
                    "recoveryTimeline": "N/A"
                },
                "beginnerDescription": "Great news! Your plant looks vibrant and completely healthy with no visible signs of infection.",
                "advancedDescription": f"Model confidence for specific diseases was low ({confidence*100:.1f}%), defaulting to Healthy baseline.",
                "commonRegions": [],
                "seasonalRisk": [],
                "healthScoreImpact": 0
            }
            
        # Fallback if unmapped, dynamically generate a UI object from the string ID!
        formatted_name = class_name.replace('-', ' ').title()
        
        # Guess severity based on keywords
        name_lower = class_name.lower()
        if "healthy" in name_lower:
            severity = "low"
            health_impact = 0
            desc = f"Great news! Your plant appears to be a {formatted_name}."
        else:
            if any(word in name_lower for word in ["blight", "rot", "wilt", "virus", "esca", "scab"]):
                severity = "high"
                health_impact = 60
            elif any(word in name_lower for word in ["spot", "rust", "mildew", "scorch", "mold"]):
                severity = "medium"
                health_impact = 35
            else:
                severity = "medium"
                health_impact = 30
            
            desc = f"Our AI detected {formatted_name}."
            
        # --- DYNAMIC GEMINI GENERATION ---
        treatment_plan = None
        if "healthy" not in name_lower:
            try:
                gemini = genai.GenerativeModel("gemini-2.5-flash")
                prompt = f"""
You are an agriculture expert.

Disease detected: {formatted_name}
Confidence: {confidence * 100:.1f}%

Return ONLY valid JSON with exactly these keys:
immediate_action, organic_treatment, chemical_treatment, prevention

Each key must contain an array of 3-5 short actionable steps (strings).
No extra explanation. Only JSON.
"""
                response = gemini.generate_content(prompt)
                
                # Clean response text (remove markdown json blocks if present)
                json_text = response.text.strip()
                if json_text.startswith("```json"):
                    json_text = json_text[7:-3].strip()
                elif json_text.startswith("```"):
                    json_text = json_text[3:-3].strip()
                    
                raw_plan = json.loads(json_text)
                
                # Map Gemini keys to our Frontend expected keys
                treatment_plan = {
                    "immediate": raw_plan.get("immediate_action", []),
                    "organic": raw_plan.get("organic_treatment", []),
                    "chemical": raw_plan.get("chemical_treatment", []),
                    "prevention": raw_plan.get("prevention", []),
                    "recoveryTimeline": "Response varies by environmental factors. Monitor new growth closely."
                }
                print(f"✅ Successfully generated dynamic treatment for {class_name} via Gemini API.")
            except Exception as e:
                print(f"⚠️ Failed to generate Gemini treatment for {class_name}: {e}")
                
        # --- END DYNAMIC GENERATION ---

        # If Gemini failed or plant is healthy, use the generic fallback mapping
        if not treatment_plan:
            treatment_plan = {
              "immediate": [f"Observe the {formatted_name} progression carefully."] if "healthy" not in name_lower else ["No immediate action required."],
              "organic": ["Maintain good airflow and reduce leaf wetness."] if "healthy" not in name_lower else [],
              "chemical": ["Consult a professional before applying targeted chemicals."] if "healthy" not in name_lower else [],
              "prevention": ["Practice crop rotation and good garden hygiene."] if "healthy" not in name_lower else ["Ensure adequate sunlight and water."],
              "recoveryTimeline": "Unknown" if "healthy" not in name_lower else "N/A"
            }

        return {
            "id": class_name,
            "name": formatted_name,
            "cropFamily": "auto",
            "recommendations": [
                "Isolate your plant to prevent potential spread.",
                "Consult with a local nursery or agricultural extension.",
                "Monitor watering and humidity carefully."
            ] if "healthy" not in name_lower else [
                "Continue your regular care routine.",
                "Monitor for any signs of stress."
            ],
            "severity": severity,
            "treatment": treatment_plan,
            "beginnerDescription": desc + " We've dynamically generated an expert treatment plan specifically for your diagnosis below.",
            "advancedDescription": f"Model identified {class_name}. Treatment protocol dynamically provisioned via Google Generative AI.",
            "commonRegions": [],
            "seasonalRisk": [],
            "healthScoreImpact": health_impact
        }
        
disease_mapper = DiseaseMapper()
