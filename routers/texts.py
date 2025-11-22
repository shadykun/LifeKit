from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.media import Text as TextModel
from schemas import Text, TextCreate

router = APIRouter(prefix="/texts", tags=["Texts"])


@router.get("/", response_model=list[Text])
def get_texts(db: Session = Depends(get_db)):
    return db.query(TextModel).all()


@router.get("/{text_id}", response_model=Text)
def get_text(text_id: int, db: Session = Depends(get_db)):
    text = db.query(TextModel).filter_by(id=text_id).first()
    if not text:
        raise HTTPException(404, "Text not found")
    return text


@router.post("/", response_model=Text)
def create_text(data: TextCreate, db: Session = Depends(get_db)):
    text = TextModel(**data.dict())
    db.add(text)
    db.commit()
    db.refresh(text)
    return text


@router.put("/{text_id}", response_model=Text)
def update_text(text_id: int, data: TextCreate, db: Session = Depends(get_db)):
    text = db.query(TextModel).filter_by(id=text_id).first()
    if not text:
        raise HTTPException(404, "Text not found")
    for k, v in data.dict().items():
        setattr(text, k, v)
    db.commit()
    return text


@router.delete("/{text_id}")
def delete_text(text_id: int, db: Session = Depends(get_db)):
    text = db.query(TextModel).filter_by(id=text_id).first()
    if not text:
        raise HTTPException(404, "Text not found")
    db.delete(text)
    db.commit()
    return {"message": "Text deleted"}
