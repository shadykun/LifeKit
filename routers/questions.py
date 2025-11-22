from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.assessment import Question as QuestionModel
from schemas import Question, QuestionCreate

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/", response_model=list[Question])
def get_questions(db: Session = Depends(get_db)):
    return db.query(QuestionModel).all()


@router.get("/{question_id}", response_model=Question)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(QuestionModel).filter_by(id=question_id).first()
    if not question:
        raise HTTPException(404, "Question not found")
    return question


@router.post("/", response_model=Question)
def create_question(data: QuestionCreate, db: Session = Depends(get_db)):
    question = QuestionModel(**data.dict())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.put("/{question_id}", response_model=Question)
def update_question(question_id: int, data: QuestionCreate, db: Session = Depends(get_db)):
    question = db.query(QuestionModel).filter_by(id=question_id).first()
    if not question:
        raise HTTPException(404, "Question not found")
    for k, v in data.dict().items():
        setattr(question, k, v)
    db.commit()
    return question


@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(QuestionModel).filter_by(id=question_id).first()
    if not question:
        raise HTTPException(404, "Question not found")
    db.delete(question)
    db.commit()
    return {"message": "Question deleted"}
