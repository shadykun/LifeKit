from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.course import Chapter as ChapterModel
from schemas import Chapter, ChapterCreate

router = APIRouter(prefix="/chapters", tags=["Chapters"])


@router.get("/", response_model=list[Chapter])
def get_chapters(db: Session = Depends(get_db)):
    return db.query(ChapterModel).all()


@router.get("/{chapter_id}", response_model=Chapter)
def get_chapter(chapter_id: int, db: Session = Depends(get_db)):
    chapter = db.query(ChapterModel).filter_by(id=chapter_id).first()
    if not chapter:
        raise HTTPException(404, "Chapter not found")
    return chapter


@router.post("/", response_model=Chapter)
def create_chapter(data: ChapterCreate, db: Session = Depends(get_db)):
    chapter = ChapterModel(**data.dict())
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


@router.put("/{chapter_id}", response_model=Chapter)
def update_chapter(chapter_id: int, data: ChapterCreate, db: Session = Depends(get_db)):
    chapter = db.query(ChapterModel).filter_by(id=chapter_id).first()
    if not chapter:
        raise HTTPException(404, "Chapter not found")
    for k, v in data.dict().items():
        setattr(chapter, k, v)
    db.commit()
    return chapter


@router.delete("/{chapter_id}")
def delete_chapter(chapter_id: int, db: Session = Depends(get_db)):
    chapter = db.query(ChapterModel).filter_by(id=chapter_id).first()
    if not chapter:
        raise HTTPException(404, "Chapter not found")
    db.delete(chapter)
    db.commit()
    return {"message": "Chapter deleted"}
