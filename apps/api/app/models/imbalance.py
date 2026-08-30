"""ORM model: imbalance_assessment — DATA_MODEL.md §Core Tables.
Gap between baseline (Prakriti) and current state (Vikriti) = clinical signal.
"""
import uuid
from sqlalchemy import String, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

_DOSHA_STATES = "vata_state IN ('normal','increased','decreased')"
_KAPHA_STATES = "kapha_state IN ('normal','increased','decreased')"
_PITTA_STATES = "pitta_state IN ('normal','increased','decreased')"
_DOMINANT_TYPES = "dominant IN ('vata','pitta','kapha','vata_pitta','pitta_kapha','vata_kapha','tridosha')"


class ImbalanceAssessment(Base):
    __tablename__ = "imbalance_assessment"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    visit_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    vata_state: Mapped[str] = mapped_column(String(15), nullable=False)  # normal|increased|decreased
    pitta_state: Mapped[str] = mapped_column(String(15), nullable=False)
    kapha_state: Mapped[str] = mapped_column(String(15), nullable=False)
    dominant: Mapped[str] = mapped_column(String(20), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    recorded_at: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")

    __table_args__ = (
        CheckConstraint(_DOSHA_STATES, name="ck_imbalance_vata_state"),
        CheckConstraint(_PITTA_STATES, name="ck_imbalance_pitta_state"),
        CheckConstraint(_KAPHA_STATES, name="ck_imbalance_kapha_state"),
        CheckConstraint(_DOMINANT_TYPES, name="ck_imbalance_dominant"),
    )

    visit: Mapped["Visit"] = relationship("Visit", back_populates="imbalance_assessment")  # type: ignore[name-defined]  # noqa: F821
