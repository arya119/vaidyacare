"""ORM model: disease_analysis — DATA_MODEL.md §4 (5-part / Nidana Panchaka).
Source: Madhava Nidana — DATA_MODEL.md §5.
CRITICAL: progression_stage (Shatkriyakala, Sushruta Samhita Sutrasthana ch.21)
is stored SEPARATELY from process_notes (Samprapti, Charaka) — do NOT conflate.
DATA_MODEL.md §Core Tables explicit note.
"""
import uuid
from sqlalchemy import String, ForeignKey, Text, JSON, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

_SHATKRIYAKALA = (
    "progression_stage IS NULL OR "
    "progression_stage IN ('sanchaya','prakopa','prasara','sthana_samshraya','vyakti','bheda')"
)


class DiseaseAnalysis(Base):
    __tablename__ = "disease_analysis"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    visit_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    citation_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("citation.id"), nullable=False,
        default="cite_madhava_nidana_panchaka"
    )

    # ── 5-part Nidana Panchaka — DATA_MODEL.md §4 ─────────────────────────────
    # 1. Nidana — causative factors (array stored as JSON)
    causes: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # 2. Purvarupa — early / prodromal signs
    early_signs: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # 3. Rupa — manifest symptoms
    symptoms: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # 4. Upashaya / Anupashaya — relief or aggravation test
    relief_test_result: Mapped[str | None] = mapped_column(Text, nullable=True)
    # 5. Samprapti — disease process NOTES (free text, Charaka framework)
    #    NOT to be confused with Shatkriyakala below.
    process_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Shatkriyakala — 6-stage progression (Sushruta Samhita, Sutrasthana ch.21)
    # SEPARATE from process_notes by explicit DATA_MODEL.md design decision.
    progression_stage: Mapped[str | None] = mapped_column(String(25), nullable=True)

    recorded_at: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")

    __table_args__ = (
        CheckConstraint(_SHATKRIYAKALA, name="ck_da_progression_stage"),
    )

    visit: Mapped["Visit"] = relationship("Visit", back_populates="disease_analysis")  # type: ignore[name-defined]  # noqa: F821
