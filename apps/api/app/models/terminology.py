"""ORM model: terminology — DATA_MODEL.md §Core Tables.
Seeded reference data: 200 terms (Role 6, SCHEDULE_AND_ROLES.md).
Uses pgvector for embedding column — TECHNICAL_DESIGN.md §5.
"""
import uuid
from sqlalchemy import String, Text, JSON, CheckConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from app.database import Base

# Embedding dimension for sentence-transformers/multilingual-e5-base
EMBED_DIM = 768


class Terminology(Base):
    __tablename__ = "terminology"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    # e.g. "NAM-001" (NAMASTE), "WHO-TM2-001" (WHO TM2), "INT-001" (internal)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    # namaste | who_tm2 | internal
    system: Mapped[str] = mapped_column(String(15), nullable=False)
    term_en: Mapped[str] = mapped_column(String(255), nullable=False)
    term_sa: Mapped[str | None] = mapped_column(String(255), nullable=True)
    devanagari: Mapped[str | None] = mapped_column(String(255), nullable=True)
    # Synonyms array stored as JSON
    synonyms: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # pgvector embedding (768-dim) — used by similar-case retrieval (TECHNICAL_DESIGN §5)
    # Null until Role 5 runs the embedding generation script
    embedding: Mapped[list | None] = mapped_column(Vector(EMBED_DIM), nullable=True)

    __table_args__ = (
        CheckConstraint("system IN ('namaste','who_tm2','internal')", name="ck_term_system"),
        # IVFFlat index for ANN search — created after data load, not during migration
        # Index("ix_terminology_embedding_ivfflat", "embedding", postgresql_using="ivfflat",
        #       postgresql_with={"lists": 100}, postgresql_ops={"embedding": "vector_cosine_ops"}),
    )
