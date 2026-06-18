import json
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship

from app.database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=_utcnow)

    notes = relationship(
        "Note", back_populates="owner", cascade="all, delete-orphan"
    )


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="", nullable=False)
    content = Column(Text, default="", nullable=False)
    # tags se almacena como JSON serializado (texto) para portabilidad en SQLite.
    tags_json = Column(Text, default="[]", nullable=False)
    color = Column(String, default="#ffffff", nullable=False)
    pinned = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )
    owner = relationship("User", back_populates="notes")

    @property
    def tags(self) -> list[str]:
        try:
            value = json.loads(self.tags_json or "[]")
            if isinstance(value, list):
                return [str(t) for t in value]
            return []
        except (ValueError, TypeError):
            return []

    @tags.setter
    def tags(self, value):
        if value is None:
            value = []
        self.tags_json = json.dumps([str(t) for t in value])
