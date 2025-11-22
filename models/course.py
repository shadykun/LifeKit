from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)

    chapters = relationship("Chapter", back_populates="course", cascade="all, delete-orphan")
    videos = relationship("Video", back_populates="course")
    images = relationship("Image", back_populates="course")
    flashcards = relationship("Flashcard", back_populates="course")

class Chapter(Base):
    __tablename__ = 'chapters'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    
    # Cheie străină către Course
    course_id = Column(Integer, ForeignKey('courses.id'))
    
    # Relații
    course = relationship("Course", back_populates="chapters")
    quizzes = relationship("Quiz", back_populates="chapter")