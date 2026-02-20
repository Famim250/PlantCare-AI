from pydantic import BaseModel
from fastapi import UploadFile

class AnalyzeRequest(BaseModel):
    cropType: str
    mode: str
