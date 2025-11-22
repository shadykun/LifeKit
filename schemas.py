from pydantic import BaseModel
from typing import Optional, List

# ----- Course -----
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    class Config:
        orm_mode = True


# ----- Chapter -----
class ChapterBase(BaseModel):
    title: str
    course_id: int

class ChapterCreate(ChapterBase):
    pass

class Chapter(ChapterBase):
    id: int
    class Config:
        orm_mode = True


# ----- Flashcard -----
class FlashcardBase(BaseModel):
    front_text: str
    back_text: str
    course_id: int

class FlashcardCreate(FlashcardBase):
    pass

class Flashcard(FlashcardBase):
    id: int
    class Config:
        orm_mode = True


# ----- Quiz -----
class QuizBase(BaseModel):
    title: str
    chapter_id: int

class QuizCreate(QuizBase):
    pass

class Quiz(QuizBase):
    id: int
    class Config:
        orm_mode = True


# ----- Question -----
class QuestionBase(BaseModel):
    question_text: str
    answer_text: str
    quiz_id: int

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    class Config:
        orm_mode = True


# ----- Video -----
class VideoBase(BaseModel):
    url: str
    duration: Optional[int] = None
    course_id: int

class VideoCreate(VideoBase):
    pass

class Video(VideoBase):
    id: int
    class Config:
        orm_mode = True


# ----- Text -----
class TextBase(BaseModel):
    body_content: str

class TextCreate(TextBase):
    pass

class Text(TextBase):
    id: int
    class Config:
        orm_mode = True


# ----- Image -----
class ImageBase(BaseModel):
    url: str
    alt_text: Optional[str] = None
    course_id: Optional[int] = None
    text_id: Optional[int] = None

class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    id: int
    class Config:
        orm_mode = True


# ----- Account -----
class AccountBase(BaseModel):
    email: str
    username: str
    hashed_password: str
    age: Optional[int] = None

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    class Config:
        orm_mode = True
