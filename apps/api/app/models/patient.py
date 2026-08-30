"""ORM model: patient — DATA_MODEL.md §Core Tables."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Date, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Patient(Base):
    __tablename__ = "patient"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    health_id: Mapped[str | None] = mapped_column(String(50), unique=True, nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    dob: Mapped[str] = mapped_column(String(50), nullable=False)
    sex: Mapped[str] = mapped_column(String(20), nullable=False)
    contact: Mapped[str | None] = mapped_column(String(100), nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    home_region: Mapped[str | None] = mapped_column(String(150), nullable=True)
    created_at: Mapped[str] = mapped_column(
        String(100), nullable=False, default=lambda: datetime.now(timezone.utc).isoformat()
    )

    # Relationships
    visits: Mapped[list["Visit"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Visit", back_populates="patient", cascade="all, delete-orphan"
    )
    constitution_assessments: Mapped[list["ConstitutionAssessment"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ConstitutionAssessment", back_populates="patient", cascade="all, delete-orphan"
    )
