"""ORM model: dictation — DATA_MODEL.md §Core Tables.
Pipeline: TECHNICAL_DESIGN.md §4.
Override log (overridden[]) is an eval asset — never discard.
"""
import uuid
from sqlalchemy import String, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Dictation(Base):
    __tablename__ = "dictation"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    visit_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    # Cloud storage reference to original audio file
    audio_ref: Mapped[str | None] = mapped_column(String(512), nullable=True)
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    transcript: Mapped[str] = mapped_column(Text, nullable=False)

    # JSONB: list of Extraction objects
    # Each: {id, source_phrase, term_code, term_en, target_field, suggested_value, confidence}
    extractions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

    # IDs of extractions accepted without change
    accepted: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

    # Override log: list of {extraction_id, action, original_value, final_value, reviewed_at}
    # action: accept|edit|reject
    # THIS IS AN EVAL ASSET — never delete/truncate per DATA_MODEL.md
    overridden: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

    created_at: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")

    visit: Mapped["Visit"] = relationship("Visit", back_populates="dictations")  # type: ignore[name-defined]  # noqa: F821
