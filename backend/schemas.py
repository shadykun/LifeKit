"""Pydantic schemas: ``XCreate`` is the request body, ``X`` the response."""

from pydantic import BaseModel, ConfigDict

_FROM_ORM = ConfigDict(from_attributes=True)


# ----- Course -----
class CourseCreate(BaseModel):
    title: str
    description: str | None = None
    parenting: bool = False


class Course(CourseCreate):
    model_config = _FROM_ORM
    id: int


# ----- Chapter -----
class ChapterCreate(BaseModel):
    title: str
    course_id: int


class Chapter(ChapterCreate):
    model_config = _FROM_ORM
    id: int


# ----- Flashcard -----
class FlashcardCreate(BaseModel):
    front_text: str
    back_text: str
    course_id: int


class Flashcard(FlashcardCreate):
    model_config = _FROM_ORM
    id: int


# ----- Quiz -----
class QuizCreate(BaseModel):
    title: str
    chapter_id: int


class Quiz(QuizCreate):
    model_config = _FROM_ORM
    id: int


# ----- Question -----
class QuestionCreate(BaseModel):
    question_text: str
    answer1_text: str
    answer2_text: str
    answer3_text: str
    correct_answer: int
    quiz_id: int


class Question(QuestionCreate):
    model_config = _FROM_ORM
    id: int


# ----- Video -----
class VideoCreate(BaseModel):
    url: str
    duration: int | None = None
    course_id: int


class Video(VideoCreate):
    model_config = _FROM_ORM
    id: int


# ----- Text -----
class TextCreate(BaseModel):
    body_content: str


class Text(TextCreate):
    model_config = _FROM_ORM
    id: int


# ----- Image -----
class ImageCreate(BaseModel):
    url: str
    alt_text: str | None = None
    course_id: int | None = None
    text_id: int | None = None


class Image(ImageCreate):
    model_config = _FROM_ORM
    id: int
