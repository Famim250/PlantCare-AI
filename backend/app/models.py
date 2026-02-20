from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    region = Column(String, default="auto")
    
    diagnoses = relationship("Diagnosis", back_populates="user")

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # made nullable for anonymous scans
    crop_type = Column(String, index=True)
    disease_id = Column(String, index=True)
    confidence = Column(Float)
    health_score = Column(Integer)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="diagnoses")
