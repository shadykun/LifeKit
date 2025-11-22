from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.assessment import Quiz as QuizModel
from schemas import Quiz, QuizCreate

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.get("/", response_model=list[Quiz])
def get_quizzes(db: Session = Depends(get_db)):
    return db.query(QuizModel).all()


@router.get("/{quiz_id}", response_model=Quiz)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(QuizModel).filter_by(id=quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    return quiz


@router.post("/", response_model=Quiz)
def create_quiz(data: QuizCreate, db: Session = Depends(get_db)):
    quiz = QuizModel(**data.dict())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.put("/{quiz_id}", response_model=Quiz)
def update_quiz(quiz_id: int, data: QuizCreate, db: Session = Depends(get_db)):
    quiz = db.query(QuizModel).filter_by(id=quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    for k, v in data.dict().items():
        setattr(quiz, k, v)
    db.commit()
    return quiz


@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(QuizModel).filter_by(id=quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    db.delete(quiz)
    db.commit()
    return {"message": "Quiz deleted"}
