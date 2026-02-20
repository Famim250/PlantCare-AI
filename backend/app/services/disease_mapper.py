import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional

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

    def map_prediction_to_disease(self, class_name: str) -> Dict[str, Any]:
        """
        Maps a prediction class string to a disease object.
        You should update the mapping logic based on exactly how your
        keras model outputs classes.
        """
        # Normalize class name to somewhat match our IDs, or create a strict mapping
        # Let's assume class_name matches the ID directly right now.
        disease = self.get_disease_by_id(class_name)
        
        if disease:
            return disease
            
        # Fallback if unmapped, dynamically generate a UI object from the string ID!
        formatted_name = class_name.replace('-', ' ').title()
        
        # Guess severity based on keywords
        name_lower = class_name.lower()
        if "healthy" in name_lower:
            severity = "low"
            health_impact = 0
            desc = f"Great news! Your plant appears to be a {formatted_name}."
        else:
            if any(word in name_lower for word in ["blight", "rot", "wilt", "virus", "esca"]):
                severity = "high"
                health_impact = 60
            elif any(word in name_lower for word in ["spot", "rust", "mildew", "scorch", "mold"]):
                severity = "medium"
                health_impact = 35
            else:
                severity = "medium"
                health_impact = 30
            
            desc = f"Our AI detected {formatted_name}. While we don't have a highly detailed treatment guide for this specific condition yet, we recommend monitoring it closely."

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
            "treatment": {
              "immediate": [f"Observe the {formatted_name} progression carefully."],
              "organic": ["Maintain good airflow and reduce leaf wetness."],
              "chemical": ["Consult a professional before applying targeted chemicals."],
              "prevention": ["Practice crop rotation and good garden hygiene."],
              "recoveryTimeline": "Unknown"
            } if "healthy" not in name_lower else {
              "immediate": ["No immediate action required."],
              "organic": [],
              "chemical": [],
              "prevention": ["Ensure adequate sunlight and water."],
              "recoveryTimeline": "N/A"
            },
            "beginnerDescription": desc,
            "advancedDescription": f"Model identified {class_name}. Specific treatment protocols for this class are pending in the UI database.",
            "commonRegions": [],
            "seasonalRisk": [],
            "healthScoreImpact": health_impact
        }
        
disease_mapper = DiseaseMapper()
