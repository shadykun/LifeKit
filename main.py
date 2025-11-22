from fastapi import FastAPI

from database import engine, Base

from models.user import Account
from models.course import Course, Chapter
from models.media import Video, Image, Text
from models.assessment import Flashcard, Quiz, Question
from routers import nearbyLocation
from routers import courses, chapters, flashcards, quizzes,questions, videos, texts, images, accounts

app = FastAPI(title="Learning Platform API")


app.include_router(nearbyLocation.router)
app.include_router(courses.router)
app.include_router(chapters.router)
app.include_router(flashcards.router)
app.include_router(quizzes.router)
app.include_router(questions.router)
app.include_router(videos.router)
app.include_router(texts.router)
app.include_router(images.router)
app.include_router(accounts.router)

@app.get("/")
def root():
    return {"status": "API running!"}

def init_db():
    print("Se generează tabelele în baza de date...")
    Base.metadata.create_all(bind=engine)
    print("Tabele generate cu succes!")

if __name__ == "__main__":
    init_db()
