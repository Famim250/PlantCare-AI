from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "model_loaded": True # This can be dynamic later based on loader state
    }
