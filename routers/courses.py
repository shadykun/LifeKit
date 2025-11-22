from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.course import Course as CourseModel
from schemas import Course, CourseCreate

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/", response_model=list[Course])
def get_courses(db: Session = Depends(get_db)):
    return db.query(CourseModel).all()


@router.get("/{course_id}", response_model=Course)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(CourseModel).filter_by(id=course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    return course


@router.post("/", response_model=Course)
def create_course(data: CourseCreate, db: Session = Depends(get_db)):
    course = CourseModel(**data.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=Course)
def update_course(course_id: int, data: CourseCreate, db: Session = Depends(get_db)):
    course = db.query(CourseModel).filter_by(id=course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    for k, v in data.dict().items():
        setattr(course, k, v)
    db.commit()
    return course


@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(CourseModel).filter_by(id=course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}
