"""ORM model: patient_assessment — DATA_MODEL.md §3 (10-point / Dashavidha Pariksha).
Source: Charaka Samhita, Vimanasthana ch.8 — DATA_MODEL.md §5.
strength_score (0–10) gates therapy intensity.
"""
import uuid
from sqlalchemy import String, ForeignKey, Float, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

_LEVELS = "IN ('strong','moderate','weak')"


class PatientAssessment(Base):
    __tablename__ = "patient_assessment"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    visit_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    citation_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("citation.id"), nullable=False,
        # Default to the Charaka citation — DATA_MODEL.md §5
        default="cite_charaka_vimanasthana_8"
    )

    # ── 10 attributes (each: strong/moderate/weak) — DATA_MODEL.md §3 ──────────
    prakriti: Mapped[str] = mapped_column(String(10), nullable=False)        # 1. Body constitution
    vikriti: Mapped[str] = mapped_column(String(10), nullable=False)         # 2. Current imbalance
    sara: Mapped[str] = mapped_column(String(10), nullable=False)            # 3. Tissue quality
    samhanana: Mapped[str] = mapped_column(String(10), nullable=False)       # 4. Body build
    satmya: Mapped[str] = mapped_column(String(10), nullable=False)          # 5. Adaptability
    satva: Mapped[str] = mapped_column(String(10), nullable=False)           # 6. Mental strength
    ahara_shakti: Mapped[str] = mapped_column(String(10), nullable=False)    # 7. Digestive capacity
    vyayama_shakti: Mapped[str] = mapped_column(String(10), nullable=False)  # 8. Exercise capacity
    vaya: Mapped[str] = mapped_column(String(10), nullable=False)            # 9. Age band
    pramana: Mapped[str] = mapped_column(String(10), nullable=False)         # 10. Body measurements

    # Aggregate: sum of 10 attributes mapped to 0/1/2 → 0–20 → normalised 0–10
    strength_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    recorded_at: Mapped[str] = mapped_column(String(30), nullable=False, server_default="now()")

    __table_args__ = (
        CheckConstraint(f"prakriti {_LEVELS}", name="ck_pa_prakriti"),
        CheckConstraint(f"vikriti {_LEVELS}", name="ck_pa_vikriti"),
        CheckConstraint(f"sara {_LEVELS}", name="ck_pa_sara"),
        CheckConstraint(f"samhanana {_LEVELS}", name="ck_pa_samhanana"),
        CheckConstraint(f"satmya {_LEVELS}", name="ck_pa_satmya"),
        CheckConstraint(f"satva {_LEVELS}", name="ck_pa_satva"),
        CheckConstraint(f"ahara_shakti {_LEVELS}", name="ck_pa_ahara_shakti"),
        CheckConstraint(f"vyayama_shakti {_LEVELS}", name="ck_pa_vyayama_shakti"),
        CheckConstraint(f"vaya {_LEVELS}", name="ck_pa_vaya"),
        CheckConstraint(f"pramana {_LEVELS}", name="ck_pa_pramana"),
    )

    visit: Mapped["Visit"] = relationship("Visit", back_populates="patient_assessment")  # type: ignore[name-defined]  # noqa: F821
