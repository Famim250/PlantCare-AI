from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, health, history, auth
from app.config import settings
from app.database import Base, engine

# Create tables (For dev only. In prod use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PlantCare AI Backend",
    description="FastAPI backend for PlantCare AI Inference",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, tags=["Health"])
app.include_router(analyze.router, tags=["Analyze"])
app.include_router(history.router, tags=["History"], prefix="/api")
app.include_router(auth.router, tags=["Auth"], prefix="/api/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
