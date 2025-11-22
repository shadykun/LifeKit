"""Utility script for seeding the PostgreSQL database with first-aid content."""

from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Presupunem că importurile modelelor sunt corecte în proiectul tău.
# Dacă rulezi asta într-un singur fișier, asigură-te că modelele sunt definite mai sus.
from database import Base, SessionLocal, engine
from models.user import Account
from models.course import Chapter, Course
from models.media import Image, Text as TextBlock, Video
from models.assessment import Flashcard, Question, Quiz


@contextmanager
def get_session():
    """Provide a transactional scope around a series of operations."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def clear_tables(session):
    """Remove existing rows to avoid duplicates when reseeding."""
    # Ordinea este importantă din cauza cheilor străine (Foreign Keys)
    for model in (Question, Quiz, Flashcard, Image, Video, TextBlock, Chapter, Course, Account):
        session.query(model).delete(synchronize_session=False)
    session.commit()


def seed_accounts(session):
    accounts = [
        Account(
            email="dr.emma.taylor@safeaid.org",
            hashed_password="pbkdf2:sha256:260000$firstaid1",
            age=34,
            username="trauma_doc",
        ),
        Account(
            email="coach.luis.ramirez@safeaid.org",
            hashed_password="pbkdf2:sha256:260000$firstaid2",
            age=41,
            username="coach_luis",
        ),
        Account(
            email="nurse.sofia.popescu@safeaid.org",
            hashed_password="pbkdf2:sha256:260000$firstaid3",
            age=29,
            username="sofia_rn",
        ),
    ]
    session.add_all(accounts)
    session.flush()
    return accounts


def seed_courses(session):
    courses = [
        Course(
            title="Primul ajutor pentru hemoragii majore",
            description="Proceduri esențiale pentru controlul sângerărilor severe până la sosirea ambulanței.",
        ),
        Course(
            title="Managementul stopului cardiac la adult",
            description="Recunoașterea stopului cardiac și aplicarea CPR + utilizarea AED.",
        ),
        Course(
            title="Stabilizarea victimelor traumatizate",
            description="Evaluarea rapidă a victimelor cu traumatisme și prevenirea agravării leziunilor.",
        ),
    ]
    session.add_all(courses)
    session.flush()
    return courses


def seed_chapters(session, courses):
    chapter_templates = [
        "Evaluarea scenei și siguranța salvatorului",
        "Evaluarea primară: ABCDE",
        "Intervenții prioritare și monitorizare",
    ]
    chapters = []
    # Generăm capitole pentru fiecare curs (simplificat pentru exemplu)
    # Aici presupunem o structură liniară: primele 3 cap la cursul 1, următoarele 3 la cursul 2 etc.
    # Logică ajustată pentru a potrivi indexarea din seed_quizzes
    
    for course in courses:
        for title in chapter_templates:
            chapter = Chapter(title=f"{title} - {course.title}", course=course)
            chapters.append(chapter)
            
    session.add_all(chapters)
    session.flush()
    return chapters


def seed_videos(session, courses):
    videos = [
        Video(
            url="https://cdn.safeaid.org/videos/control-bleeding-tourniquet.mp4",
            duration=480,
            course=courses[0],
        ),
        Video(
            url="https://cdn.safeaid.org/videos/adult-cpr-aed.mp4",
            duration=540,
            course=courses[1],
        ),
        Video(
            url="https://cdn.safeaid.org/videos/spinal-motion-restriction.mp4",
            duration=420,
            course=courses[2],
        ),
    ]
    session.add_all(videos)
    session.flush()
    return videos


def seed_texts(session):
    texts = [
        TextBlock(
            body_content=(
                "Folosește metoda Stop the Bleed: compresie directă, pansament hemostatic și garou"
                " aplicat la 5 cm deasupra rănii. Verifică pulsul distal la fiecare 10 minute."
            )
        ),
        TextBlock(
            body_content=(
                "CPR de înaltă calitate presupune frecvență 100-120 compresii/minut, adâncime"
                " 5-6 cm și schimbul salvatorilor la fiecare 2 minute pentru a menține eficiența."
            )
        ),
        TextBlock(
            body_content=(
                "Stabilizează coloana cervicală manual înainte de aplicarea gulerului. Menține"
                " victima în linie neutră și evaluează respirația la fiecare 30 de secunde."
            )
        ),
    ]
    session.add_all(texts)
    session.flush()
    return texts


def seed_images(session, courses, texts):
    images = [
        Image(
            url="https://cdn.safeaid.org/images/tourniquet-placement.png",
            alt_text="Pași pentru aplicarea unui garou pe membrul superior",
            course=courses[0],
            text=texts[0],
        ),
        Image(
            url="https://cdn.safeaid.org/images/aed-pad-placement.png",
            alt_text="Poziționarea corectă a electrozilor AED la adult",
            course=courses[1],
            text=texts[1],
        ),
        Image(
            url="https://cdn.safeaid.org/images/log-roll-team.png",
            alt_text="Echipă demonstrând manevra log-roll cu stabilizarea capului",
            course=courses[2],
            text=texts[2],
        ),
    ]
    session.add_all(images)
    session.flush()
    return images


def seed_flashcards(session, courses):
    flashcards = [
        Flashcard(
            front_text="Care sunt cele trei componente ale controlului hemoragiei?",
            back_text="Presiune directă, pansament hemostatic, garou.",
            course=courses[0],
        ),
        Flashcard(
            front_text="Când se atașează AED-ul în timpul CPR-ului?",
            back_text="Imediat ce este disponibil, fără a întrerupe compresiile mai mult de 10 secunde.",
            course=courses[1],
        ),
        Flashcard(
            front_text="Ce semn sugerează posibil traumatism vertebro-medular?",
            back_text="Durere cervicală severă asociată cu parestezii sau deficit motor la membre.",
            course=courses[2],
        ),
    ]
    session.add_all(flashcards)
    session.flush()
    return flashcards


def seed_quizzes(session, chapters):
    # Asignăm quiz-urile unor capitole specifice (index 0, 3, 6 corespund capitolelor diferite din cursuri diferite)
    # Lista chapters are 9 elemente (3 cursuri * 3 capitole)
    quizzes = [
        Quiz(title="Controlul hemoragiei - verificare rapidă", chapter=chapters[0]),
        Quiz(title="CPR avansat - recapitulare", chapter=chapters[3]), # Cap 1 din Cursul 2
        Quiz(title="Imobilizarea victimelor", chapter=chapters[6]),     # Cap 1 din Cursul 3
    ]
    session.add_all(quizzes)
    session.flush()
    return quizzes


def seed_questions(session, quizzes):
    """
    Populează baza de date cu întrebări tip grilă (3 variante).
    Structura Question:
    - question_text
    - answer1_text
    - answer2_text
    - answer3_text
    - correct_answer (int: 1, 2, sau 3)
    """
    
    # Structura datelor: Listă de liste, unde fiecare sub-listă corespunde unui Quiz
    all_questions_data = [
        # Set pentru Quiz 1: Hemoragii
        [
            {
                "q": "Care este prima acțiune când observi o hemoragie masivă?",
                "a1": "Asigură-ți siguranța, apoi aplică presiune directă imediată.",
                "a2": "Aplică imediat un garou fără a verifica scena.",
                "a3": "Toarnă apă oxigenată pe rană pentru dezinfectare.",
                "correct": 1
            },
            {
                "q": "Când trebuie strâns din nou garoul dacă sângerarea reapare?",
                "a1": "Nu se mai atinge garoul odată pus.",
                "a2": "Verifică la 2-3 minute și strânge până când sângerarea se oprește complet.",
                "a3": "Se slăbește garoul timp de 10 minute pentru a lăsa sângele să circule.",
                "correct": 2
            },
            {
                "q": "Ce semn confirmă că garoul este eficient?",
                "a1": "Pacientul spune că nu îl mai doare.",
                "a2": "Membrul devine cald și roșu.",
                "a3": "Dispariția pulsului periferic distal și oprirea completă a sângerării.",
                "correct": 3
            },
        ],
        # Set pentru Quiz 2: CPR (Resuscitare)
        [
            {
                "q": "Care este raportul compresii-ventilații pentru un adult cu un singur salvator?",
                "a1": "30 compresii la 2 ventilații.",
                "a2": "15 compresii la 2 ventilații.",
                "a3": "5 compresii la 1 ventilație.",
                "correct": 1
            },
            {
                "q": "Cum reduci întreruperile compresiilor când folosești AED-ul?",
                "a1": "Oprești totul imediat ce sosește aparatul.",
                "a2": "Aplici electrozii în timp ce alt salvator continuă compresiile.",
                "a3": "Nu folosești AED-ul dacă pacientul este adult.",
                "correct": 2
            },
            {
                "q": "Ce caracteristici are un masaj cardiac de calitate?",
                "a1": "Frecvență sub 60/min și adâncime superficială.",
                "a2": "Frecvență 100-120/min și revenirea completă a toracelui după fiecare compresie.",
                "a3": "Compresii doar pe partea stângă a toracelui.",
                "correct": 2
            },
        ],
        # Set pentru Quiz 3: Traumatisme (Imobilizare)
        [
            {
                "q": "Când se aplică gulerul cervical rigid?",
                "a1": "Imediat ce ajungi la victimă, înainte de orice altceva.",
                "a2": "După ce pacientul a fost așezat pe targă.",
                "a3": "După stabilizarea manuală a capului și evaluarea căilor aeriene.",
                "correct": 3
            },
            {
                "q": "Câte persoane sunt necesare minim pentru manevra log-roll sigură?",
                "a1": "Doar două persoane.",
                "a2": "Patru persoane (cap, torace, pelvis, membre).",
                "a3": "O singură persoană puternică.",
                "correct": 2
            },
            {
                "q": "Ce parametru monitorizezi continuu după imobilizarea pe targă?",
                "a1": "Doar temperatura corpului.",
                "a2": "Saturația de oxigen, pulsul și starea de conștiență.",
                "a3": "Dacă pacientului îi este foame.",
                "correct": 2
            },
        ],
    ]

    # Iterăm prin quiz-uri și datele aferente
    for quiz, questions_list in zip(quizzes, all_questions_data):
        for item in questions_list:
            new_q = Question(
                question_text=item["q"],  # Conform numelui din clasa ta
                answer1_text=item["a1"],
                answer2_text=item["a2"],
                answer3_text=item["a3"],
                correct_answer=item["correct"], # Integer 1, 2 sau 3
                quiz=quiz
            )
            session.add(new_q)
            
    session.flush()


def main():
    Base.metadata.create_all(bind=engine)
    with get_session() as session:
        clear_tables(session)
        print("🧹 Tabele curățate.")
        
        seed_accounts(session)
        print("👤 Conturi create.")
        
        courses = seed_courses(session)
        print("📚 Cursuri create.")
        
        chapters = seed_chapters(session, courses)
        print("📖 Capitole create.")
        
        seed_videos(session, courses)
        print("🎥 Video-uri adăugate.")
        
        texts = seed_texts(session)
        seed_images(session, courses, texts)
        print("🖼️ Imagini și text adăugate.")
        
        seed_flashcards(session, courses)
        print("🃏 Flashcard-uri create.")
        
        quizzes = seed_quizzes(session, chapters)
        seed_questions(session, quizzes)
        print("❓ Quiz-uri și întrebări (cu variante multiple) create.")

    print("✅ Baza de date a fost populată cu succes!")


if __name__ == "__main__":
    main()