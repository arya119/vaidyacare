"""Pydantic schemas for Patient entity — mirrors DATA_MODEL.md & @vaidyacare/schema."""
from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class PatientBase(BaseModel):
    health_id: Optional[str] = Field(None, description="National health ID (ABHA) - optional")
    name: str = Field(..., min_length=1, max_length=255, description="Full Name of the patient")
    dob: str = Field(..., description="Date of birth in YYYY-MM-DD format")
    sex: str = Field(..., max_length=20, description="Sex (male, female, other)")
    contact: Optional[str] = Field(None, max_length=100, description="Phone number or contact info")
    occupation: Optional[str] = Field(None, max_length=100, description="Occupation")
    home_region: Optional[str] = Field(None, max_length=150, description="Home region / geography (Desha context)")


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    health_id: Optional[str] = None
    name: Optional[str] = None
    dob: Optional[str] = None
    sex: Optional[str] = None
    contact: Optional[str] = None
    occupation: Optional[str] = None
    home_region: Optional[str] = None


class PatientListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    health_id: Optional[str] = None
    name: str
    dob: str
    sex: str
    home_region: Optional[str] = None
    created_at: str


class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: str
