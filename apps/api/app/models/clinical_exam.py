"""ORM model: clinical_exam — DATA_MODEL.md §Core Tables + §2 (8-point / Ashtasthana Pariksha).
Source: Yogaratnakara (NOT Charaka) — DATA_MODEL.md §5.
All 8 sub-structures stored as JSONB columns for flexibility.
Derived values (Agni, Koshtha, Ama) computed by the rule engine and cached here.
"""
import uuid
from sqlalchemy import String, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ClinicalExam(Base):
    __tablename__ = "clinical_exam"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    visit_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )

    # ── 8 Sub-structures (JSONB) — DATA_MODEL.md §2 ───────────────────────────
    # 1. Nadi (Pulse): rate_bpm, quality, type (snake/frog/swan), notes
    pulse: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 2. Mutra (Urine): colour, volume_ml_per_day, frequency, odour, sediment, notes
    urine: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 3. Mala (Stool): bristol_score, frequency, colour, odour, residue, notes
    stool: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 4. Jihva (Tongue): photo_ref, coating, colour, moisture, cracks, papillae_state, notes
    tongue: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 5. Shabda (Voice): clarity, pitch, hoarseness, bowel_sounds, notes
    voice: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 6. Sparsha (Touch): temperature, moisture, texture, tenderness_map[], notes
    touch: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 7. Drik (Eyes): conjunctival_colour, sclera, lustre, vision_complaints, notes
    eyes: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # 8. Akriti (General appearance): build, gait, posture, expression, notes
    appearance: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # ── Derived values (rule engine output) ────────────────────────────────────
    # agni: sharp|moderate|dull|irregular
    agni: Mapped[str | None] = mapped_column(String(15), nullable=True)
    # koshtha: soft|medium|hard
    koshtha: Mapped[str | None] = mapped_column(String(10), nullable=True)
    # ama: True if metabolic residue pattern detected
    ama_flag: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    recorded_at: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")

    visit: Mapped["Visit"] = relationship("Visit", back_populates="clinical_exam")  # type: ignore[name-defined]  # noqa: F821
