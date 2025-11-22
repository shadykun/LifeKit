from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.assessment import Flashcard as FlashcardModel
from schemas import Flashcard, FlashcardCreate

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


@router.get("/", response_model=list[Flashcard])
def get_flashcards(db: Session = Depends(get_db)):
    return db.query(FlashcardModel).all()


@router.get("/{flashcard_id}", response_model=Flashcard)
def get_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    flashcard = db.query(FlashcardModel).filter_by(id=flashcard_id).first()
    if not flashcard:
        raise HTTPException(404, "Flashcard not found")
    return flashcard


@router.post("/", response_model=Flashcard)
def create_flashcard(data: FlashcardCreate, db: Session = Depends(get_db)):
    flashcard = FlashcardModel(**data.dict())
    db.add(flashcard)
    db.commit()
    db.refresh(flashcard)
    return flashcard


@router.put("/{flashcard_id}", response_model=Flashcard)
def update_flashcard(flashcard_id: int, data: FlashcardCreate, db: Session = Depends(get_db)):
    flashcard = db.query(FlashcardModel).filter_by(id=flashcard_id).first()
    if not flashcard:
        raise HTTPException(404, "Flashcard not found")
    for k, v in data.dict().items():
        setattr(flashcard, k, v)
    db.commit()
    return flashcard


@router.delete("/{flashcard_id}")
def delete_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    flashcard = db.query(FlashcardModel).filter_by(id=flashcard_id).first()
    if not flashcard:
        raise HTTPException(404, "Flashcard not found")
    db.delete(flashcard)
    db.commit()
    return {"message": "Flashcard deleted"}
