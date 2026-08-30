"""Router: patients — API_SPEC.md §Patients.
Handles patient registration, list, detail, and updates.
"""
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient import (
    PatientCreate,
    PatientListItem,
    PatientResponse,
    PatientUpdate,
)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post(
    "",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create patient",
)
async def create_patient(
    payload: PatientCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new patient record in Postgres."""
    # Check if health_id already exists if provided
    if payload.health_id:
        existing = await db.execute(
            select(Patient).where(Patient.health_id == payload.health_id)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Patient with health_id '{payload.health_id}' already exists.",
            )

    # Parse dob string to date object
    try:
        parsed_dob = date.fromisoformat(payload.dob)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid date format for dob. Expected YYYY-MM-DD.",
        )

    patient = Patient(
        health_id=payload.health_id,
        name=payload.name.strip(),
        dob=payload.dob.strip(),
        sex=payload.sex.strip().lower(),
        contact=payload.contact.strip() if payload.contact else None,
        occupation=payload.occupation.strip() if payload.occupation else None,
        home_region=payload.home_region.strip() if payload.home_region else None,
    )

    db.add(patient)
    await db.commit()
    await db.refresh(patient)

    return PatientResponse(
        id=patient.id,
        health_id=patient.health_id,
        name=patient.name,
        dob=str(patient.dob),
        sex=patient.sex,
        contact=patient.contact,
        occupation=patient.occupation,
        home_region=patient.home_region,
        created_at=str(patient.created_at),
    )


@router.get(
    "",
    response_model=list[PatientListItem],
    summary="List and search patients",
)
async def list_patients(
    q: Optional[str] = Query(None, description="Search term for name or health_id"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List patients with optional search filter."""
    stmt = select(Patient)

    if q:
        search_pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Patient.name.ilike(search_pattern),
                Patient.health_id.ilike(search_pattern),
                Patient.home_region.ilike(search_pattern),
            )
        )

    stmt = stmt.order_by(Patient.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    patients = result.scalars().all()

    return [
        PatientListItem(
            id=p.id,
            health_id=p.health_id,
            name=p.name,
            dob=str(p.dob),
            sex=p.sex,
            home_region=p.home_region,
            created_at=str(p.created_at),
        )
        for p in patients
    ]


@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
    summary="Get patient detail",
)
async def get_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Fetch patient details by ID."""
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient '{patient_id}' not found",
        )

    return PatientResponse(
        id=patient.id,
        health_id=patient.health_id,
        name=patient.name,
        dob=str(patient.dob),
        sex=patient.sex,
        contact=patient.contact,
        occupation=patient.occupation,
        home_region=patient.home_region,
        created_at=str(patient.created_at),
    )


@router.patch(
    "/{patient_id}",
    response_model=PatientResponse,
    summary="Update patient details",
)
async def update_patient(
    patient_id: str,
    payload: PatientUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update patient fields."""
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient '{patient_id}' not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if "dob" in update_data and update_data["dob"]:
        try:
            update_data["dob"] = date.fromisoformat(update_data["dob"])
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid date format for dob. Expected YYYY-MM-DD.",
            )

    for field, value in update_data.items():
        setattr(patient, field, value)

    await db.commit()
    await db.refresh(patient)

    return PatientResponse(
        id=patient.id,
        health_id=patient.health_id,
        name=patient.name,
        dob=str(patient.dob),
        sex=patient.sex,
        contact=patient.contact,
        occupation=patient.occupation,
        home_region=patient.home_region,
        created_at=str(patient.created_at),
    )
