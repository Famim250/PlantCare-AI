from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Diagnosis, User
from app.dependencies import get_current_user
from pydantic import BaseModel
import datetime

router = APIRouter()

class DiagnosisResponse(BaseModel):
    id: int
    crop_type: str
    disease_id: str
    confidence: float
    health_score: int
    image_url: str | None
    created_at: datetime.datetime
    
    class Config:
        orm_mode = True

@router.get("/history", response_model=List[DiagnosisResponse])
def get_history(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get all past diagnoses for the authenticated user.
    """
    diagnoses = db.query(Diagnosis).filter(Diagnosis.user_id == current_user.id).order_by(Diagnosis.created_at.desc()).all()
    return diagnoses
