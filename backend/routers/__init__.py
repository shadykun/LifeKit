"""API routers: one generated CRUD router per resource, plus the map lookup."""

import models
import schemas
from routers import nearby
from routers.crud import build_crud_router

# (prefix, singular name, ORM model, response schema, request schema)
_RESOURCES = [
    ("/courses", "Course", models.Course, schemas.Course, schemas.CourseCreate),
    ("/chapters", "Chapter", models.Chapter, schemas.Chapter, schemas.ChapterCreate),
    ("/flashcards", "Flashcard", models.Flashcard, schemas.Flashcard, schemas.FlashcardCreate),
    ("/quizzes", "Quiz", models.Quiz, schemas.Quiz, schemas.QuizCreate),
    ("/questions", "Question", models.Question, schemas.Question, schemas.QuestionCreate),
    ("/videos", "Video", models.Video, schemas.Video, schemas.VideoCreate),
    ("/texts", "Text", models.Text, schemas.Text, schemas.TextCreate),
    ("/images", "Image", models.Image, schemas.Image, schemas.ImageCreate),
]

all_routers = [
    nearby.router,
    *(
        build_crud_router(
            prefix=prefix,
            name=name,
            model=model,
            schema=schema,
            create_schema=create_schema,
        )
        for prefix, name, model, schema, create_schema in _RESOURCES
    ),
]
