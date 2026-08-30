"""ORM model: citation — DATA_MODEL.md §5 Sources.
Written first because other tables reference it as FK.
4 seed rows — must NOT be conflated (Charaka, Yogaratnakara, Madhava, Sushruta).
"""
import uuid
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Citation(Base):
    __tablename__ = "citation"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    rule_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    source_text: Mapped[str] = mapped_column(String(255), nullable=False)
    chapter: Mapped[str | None] = mapped_column(String(255), nullable=True)
    verse: Mapped[str | None] = mapped_column(String(100), nullable=True)
    quote_en: Mapped[str] = mapped_column(Text, nullable=False)
