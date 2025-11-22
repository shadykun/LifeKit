from database import engine, Base

# IMPORTĂM MODELELE
# Chiar daca nu le folosim direct aici, importul le înregistrează în SQLAlchemy Base
from models.user import Account
from models.course import Course, Chapter
from models.media import Video, Image, Text
from models.assessment import Flashcard, Quiz

def init_db():
    print("Se generează tabelele în baza de date...")
    Base.metadata.create_all(bind=engine)
    print("Tabele generate cu succes!")

if __name__ == "__main__":
    init_db()