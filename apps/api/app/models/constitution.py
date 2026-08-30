"""ORM model: constitution_assessment + constitution_response — DATA_MODEL.md §Core Tables.
Once per patient. Re-assessment = new row + discrepancy_flag = True.
Adaptive scoring algorithm: TECHNICAL_DESIGN.md §3.
"""
import uuid
from sqlalchemy import String, Float, Boolean, ForeignKey, Text, JSON, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ConstitutionAssessment(Base):
    __tablename__ = "constitution_assessment"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patient.id", ondelete="CASCADE"), nullable=False, index=True
    )
    assessed_on: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")
    vata_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    pitta_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    kapha_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    # derived_type: vata|pitta|kapha|vata_pitta|pitta_kapha|vata_kapha|tridosha
    derived_type: Mapped[str] = mapped_column(String(20), nullable=False)
    # 0–1 confidence from info-gain adaptive algorithm
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    # True if this assessment differs significantly from prior
    discrepancy_flag: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    __table_args__ = (
        CheckConstraint(
            "derived_type IN ('vata','pitta','kapha','vata_pitta','pitta_kapha','vata_kapha','tridosha')",
            name="ck_constitution_type",
        ),
    )

    patient: Mapped["Patient"] = relationship("Patient", back_populates="constitution_assessments")  # type: ignore[name-defined]  # noqa: F821
    responses: Mapped[list["ConstitutionResponse"]] = relationship(
        "ConstitutionResponse", back_populates="assessment", cascade="all, delete-orphan"
    )


class ConstitutionResponse(Base):
    """One answered attribute — keeps scoring auditable. ~25 attributes per assessment."""
    __tablename__ = "constitution_response"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    assessment_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("constitution_assessment.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    attribute: Mapped[str] = mapped_column(String(100), nullable=False)
    option_chosen: Mapped[str] = mapped_column(String(255), nullable=False)
    # weight JSON: {"vata": 0.8, "pitta": 0.1, "kapha": 0.1}
    weight: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    assessment: Mapped["ConstitutionAssessment"] = relationship(
        "ConstitutionAssessment", back_populates="responses"
    )
