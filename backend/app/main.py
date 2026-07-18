from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from app.api import auth

app = FastAPI(
    title="TechSpend AI API",
    description="Enterprise Technology Spend Intelligence Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/v1/openapi.json"
)

app.include_router(auth.router, prefix="/api/v1")

# Standard CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    timestamp: float
    service: str

@app.get("/api/v1/health", response_model=HealthResponse)
def health_check():
    """
    Standard platform healthcheck endpoint
    """
    return HealthResponse(
        status="healthy",
        timestamp=time.time(),
        service="techspend-ai-backend"
    )

# Basic Hello root
@app.get("/")
def read_root():
    return {"message": "Welcome to TechSpend AI API Gateway. Go to /api/docs for API details."}
