from pydantic import BaseModel
from typing import List, Dict, Union, Any, Optional

class TreatmentPlan(BaseModel):
    immediate: List[str]
    organic: List[str]
    chemical: List[str]
    prevention: List[str]
    recoveryTimeline: str

class Disease(BaseModel):
    id: str
    name: str
    scientificName: Optional[str] = None
    pathogenType: Optional[str] = None
    spreadMechanism: Optional[str] = None
    cropFamily: str
    recommendations: List[str]
    severity: str
    treatment: TreatmentPlan
    beginnerDescription: str
    advancedDescription: str
    commonRegions: List[str]
    seasonalRisk: List[str]
    healthScoreImpact: int

class AlternativePrediction(BaseModel):
    disease: Disease
    confidence: float

class HealthScoreBreakdown(BaseModel):
    leafCondition: int
    infectionSeverity: int
    colorAnalysis: int

class HealthScore(BaseModel):
    score: int
    breakdown: HealthScoreBreakdown

class HeatmapRegion(BaseModel):
    x: float
    y: float
    radius: float
    intensity: Optional[float] = None

class AnalysisResponse(BaseModel):
    disease: Disease
    confidence: float
    processingTime: int
    alternatives: List[AlternativePrediction]
    healthScore: HealthScore
    heatmapRegions: List[HeatmapRegion]
    confidenceLevel: str
    multiDiseaseWarning: bool
