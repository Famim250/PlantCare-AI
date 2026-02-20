import logging
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from app.routes import analyze, health, history, auth
from app.config import settings
from app.database import Base, engine

logger = logging.getLogger("plantcare")

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

# Global exception handler — runs INSIDE CORS so headers are always attached
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    err_msg = traceback.format_exc()
    logger.error(f"Unhandled exception: {err_msg}")
    with open("backend_crash.txt", "w") as f:
        f.write(err_msg)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# Include Routers
app.include_router(health.router, tags=["Health"])
app.include_router(analyze.router, tags=["Analyze"])
app.include_router(history.router, tags=["History"], prefix="/api")
app.include_router(auth.router, tags=["Auth"], prefix="/api/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
