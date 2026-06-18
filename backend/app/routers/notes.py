from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Note, User
from app.schemas import NoteCreate, NoteOut, NoteUpdate

router = APIRouter(prefix="/api/notes", tags=["notes"])


def _get_owned_note(note_id: int, user: User, db: Session) -> Note:
    note = (
        db.query(Note)
        .filter(Note.id == note_id, Note.user_id == user.id)
        .first()
    )
    if note is None:
        # 404 tambien cuando la nota existe pero es de otro usuario,
        # para no filtrar su existencia.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    return note


@router.get("", response_model=list[NoteOut])
def list_notes(
    q: Optional[str] = Query(None, description="Busqueda en titulo/contenido"),
    tag: Optional[str] = Query(None, description="Filtra por tag exacto"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Note).filter(Note.user_id == current_user.id)

    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(Note.title.ilike(like), Note.content.ilike(like))
        )

    notes = query.order_by(Note.pinned.desc(), Note.updated_at.desc()).all()

    if tag:
        notes = [n for n in notes if tag in n.tags]

    return notes


@router.post("", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = Note(
        title=payload.title,
        content=payload.content,
        color=payload.color,
        pinned=payload.pinned,
        user_id=current_user.id,
    )
    note.tags = payload.tags
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/{note_id}", response_model=NoteOut)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_owned_note(note_id, current_user, db)


@router.put("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int,
    payload: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = _get_owned_note(note_id, current_user, db)
    data = payload.model_dump(exclude_unset=True)

    if "tags" in data:
        note.tags = data.pop("tags")
    for field, value in data.items():
        setattr(note, field, value)

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = _get_owned_note(note_id, current_user, db)
    db.delete(note)
    db.commit()
    return None
