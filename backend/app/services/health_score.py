from typing import Dict, Any

def calculate_health_score(disease: Dict[str, Any], confidence: float) -> Dict[str, Any]:
    base = 100 - disease.get("healthScoreImpact", 0)
    severity = disease.get("severity", "low")
    
    severity_multiplier = 0.85 if severity == 'high' else 0.92 if severity == 'medium' else 1
    conf_adjust = 1 if confidence > 0.9 else 1.05
    
    score = max(5, min(100, round(base * severity_multiplier * conf_adjust)))
    
    # Calculate breakdown
    is_healthy = disease.get("id") == "healthy"
    
    leaf_condition = 95 if is_healthy else max(10, score - 10) # Simplified random logic vs frontend
    infection_severity = 0 if is_healthy else min(100, 100 - score + 5)
    color_analysis = 90 if is_healthy else max(15, score - 5)
    
    return {
        "score": score,
        "breakdown": {
            "leafCondition": leaf_condition,
            "infectionSeverity": infection_severity,
            "colorAnalysis": color_analysis
        }
    }
