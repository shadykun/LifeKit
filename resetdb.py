"""
reset_db.py
Acest script ȘTERGE tabelele vechi și le creează pe cele noi conform modelelor.
Folosește-l doar în faza de dezvoltare!
"""
from database import engine, Base
# Importăm toate modelele pentru a ne asigura că sunt înregistrate în Base.metadata
from models.course import Course, Chapter
from models.media import Video, Image, Text
from models.assessment import Quiz, Question, Flashcard

def hard_reset_database():
    print("⚠️  ATENȚIE: Această acțiune va șterge toate datele din baza de date!")
    confirm = input("Ești sigur că vrei să continui? (scrie 'DA'): ")
    
    if confirm != "DA":
        print("Operațiune anulată.")
        return

    print("Se șterg tabelele vechi...")
    # Drop all șterge tot, indiferent de modificări
    Base.metadata.drop_all(bind=engine)
    
    print("Se creează tabelele noi conform modelelor...")
    # Create all face structura nouă
    Base.metadata.create_all(bind=engine)
    
    print("✅ Structura bazei de date a fost actualizată (datele au fost resetate).")

if __name__ == "__main__":
    hard_reset_database()