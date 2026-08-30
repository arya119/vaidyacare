"""VaidyaCare API — FastAPI app entry point."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
import app.models  # Ensure all ORM models are registered in registry
from app.routers import (
    patients,
    visits,
    constitution,
    imbalance,
    clinical_exam,
    patient_assessment,
    disease_analysis,
    coding,
    dictation,
    trend,
    similar_cases,
    fhir,
    sync,
    terminology,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connection pool is handled by SQLAlchemy async engine
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="VaidyaCare API",
    description="AI-Assisted Digital Case-Taking Platform for Ayush Practitioners — SIH26047",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

# ── Health check (Phase 0 verification target with live DB check) ──────────────
@app.get("/healthz", tags=["health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok"}


# ── Mount all routers — API_SPEC.md §Base: /api/v1 ────────────────────────────
PREFIX = "/api/v1"

app.include_router(patients.router,           prefix=PREFIX)
app.include_router(visits.router,             prefix=PREFIX)
app.include_router(constitution.router,       prefix=PREFIX)
app.include_router(imbalance.router,          prefix=PREFIX)
app.include_router(clinical_exam.router,      prefix=PREFIX)
app.include_router(patient_assessment.router, prefix=PREFIX)
app.include_router(disease_analysis.router,   prefix=PREFIX)
app.include_router(coding.router,             prefix=PREFIX)
app.include_router(dictation.router,          prefix=PREFIX)
app.include_router(trend.router,              prefix=PREFIX)
app.include_router(similar_cases.router,      prefix=PREFIX)
app.include_router(fhir.router,               prefix=PREFIX)
app.include_router(sync.router,               prefix=PREFIX)
app.include_router(terminology.router,        prefix=PREFIX)
