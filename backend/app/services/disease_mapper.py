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
            
        # Fallback if unmapped
        return {
            "id": "unknown",
            "name": f"Unknown Detection ({class_name})",
            "cropFamily": "auto",
            "recommendations": [],
            "severity": "low",
            "treatment": {
              "immediate": [],
              "organic": [],
              "chemical": [],
              "prevention": [],
              "recoveryTimeline": "Unknown"
            },
            "beginnerDescription": "We detected an anomaly but aren't sure exactly what it is.",
            "advancedDescription": f"Class '{class_name}' predicted but not found in disease registry.",
            "commonRegions": [],
            "seasonalRisk": [],
            "healthScoreImpact": 10
        }
        
disease_mapper = DiseaseMapper()
