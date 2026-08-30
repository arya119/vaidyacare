"""ORM model: visit — DATA_MODEL.md §Core Tables. Everything hangs off visit."""
import uuid
from sqlalchemy import String, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Visit(Base):
    __tablename__ = "visit"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patient.id", ondelete="CASCADE"), nullable=False, index=True
    )
    visit_date: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")
    practitioner_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    visit_type: Mapped[str] = mapped_column(String(20), nullable=False)  # new | follow_up
    chief_complaint: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[str] = mapped_column(
        String(30), nullable=False, server_default="now()"
    )

    __table_args__ = (
        CheckConstraint("visit_type IN ('new', 'follow_up')", name="ck_visit_type"),
    )

    # Relationships
    patient: Mapped["Patient"] = relationship("Patient", back_populates="visits")  # type: ignore[name-defined]  # noqa: F821
    imbalance_assessment: Mapped["ImbalanceAssessment | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ImbalanceAssessment", back_populates="visit", uselist=False
    )
    clinical_exam: Mapped["ClinicalExam | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ClinicalExam", back_populates="visit", uselist=False
    )
    patient_assessment: Mapped["PatientAssessment | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "PatientAssessment", back_populates="visit", uselist=False
    )
    disease_analysis: Mapped["DiseaseAnalysis | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "DiseaseAnalysis", back_populates="visit", uselist=False
    )
    finding_codes: Mapped[list["FindingCode"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "FindingCode", back_populates="visit", cascade="all, delete-orphan"
    )
    dictations: Mapped[list["Dictation"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Dictation", back_populates="visit", cascade="all, delete-orphan"
    )
