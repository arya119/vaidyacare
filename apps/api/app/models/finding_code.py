"""ORM model: finding_code — DATA_MODEL.md §Core Tables.
"The differentiator table" — dual-codes every clinical finding to NAMASTE + WHO TM2.
"""
import uuid
from sqlalchemy import String, ForeignKey, Float, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class FindingCode(Base):
    __tablename__ = "finding_code"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    visit_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    # JSON path to the source field, e.g. "clinical_exam.pulse.type"
    field_path: Mapped[str] = mapped_column(String(255), nullable=False)
    # NAMASTE national code
    national_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    national_term: Mapped[str] = mapped_column(String(255), nullable=False)
    # WHO ICD-11 TM2 code
    who_tm_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    # Optional paired biomedical ICD-11 code
    who_bio_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # auto = AI suggestion accepted; manual = practitioner override
    coded_by: Mapped[str] = mapped_column(String(10), nullable=False)
    # 0–1 confidence (null for manual codes)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")

    __table_args__ = (
        CheckConstraint("coded_by IN ('auto','manual')", name="ck_fc_coded_by"),
    )

    visit: Mapped["Visit"] = relationship("Visit", back_populates="finding_codes")  # type: ignore[name-defined]  # noqa: F821
