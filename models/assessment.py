from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Flashcard(Base):
    __tablename__ = 'flashcards'

    id = Column(Integer, primary_key=True, index=True)
    front_text = Column(String, nullable=False)
    back_text = Column(String, nullable=False)
    
    course_id = Column(Integer, ForeignKey('courses.id'))
    course = relationship("Course", back_populates="flashcards")

class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    
    # Quiz-ul aparține unui Chapter (nu direct cursului, conform diagramei)
    chapter_id = Column(Integer, ForeignKey('chapters.id'))
    chapter = relationship("Chapter", back_populates="quizzes")

    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)

    answer_text = Column(String, nullable=False)
    quiz_id = Column(Integer, ForeignKey('quizzes.id'))
    quiz = relationship("Quiz", back_populates='questions')