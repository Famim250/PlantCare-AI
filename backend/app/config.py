from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    port: int = 8000

    environment: str = "development"
    model_path: str = "weights/model.keras"
    max_image_size_mb: int = 5
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Phase 2: Database Settings
    database_url: str = "sqlite:///./plantcare.db"
    
    # Phase 3: JWT Settings
    secret_key: str = "YOUR_SUPER_SECRET_KEY_HERE_CHANGE_IN_PROD"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7 # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()
