"""Utility script for seeding the PostgreSQL database with first-aid content."""

from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, SessionLocal, engine
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
    for model in (Question, Quiz, Flashcard, Image, Video, TextBlock, Chapter, Course):
        session.query(model).delete(synchronize_session=False)
    session.commit()


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
        Course(
            title="Primul ajutor pentru nou-născuți și sugari",
            description="Identificarea urgențelor la bebeluși: obstrucție de căi aeriene, febră, convulsii și tehnici de resuscitare adaptate vârstei.",
            parenting=True
        ),
        Course(
            title="Siguranța copilului în primul an de viață",
            description="Prevenirea accidentelor casnice, gestionarea riscurilor și principiile esențiale de supraveghere a nou-născutului.",
            parenting=True
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
            url="https://www.youtube.com/watch?v=jYtJS1PtNq0",
            duration=85,
            course=courses[0],
        ),
        Video(
            url="https://www.youtube.com/shorts/tRwwo5n4uU0",
            duration=540,
            course=courses[1],
        ),
        Video(
            url="https://www.youtube.com/watch?v=xYBUY1kZpf8",
            duration=420,
            course=courses[2],
        ),
        Video(
            url="https://www.youtube.com/shorts/mP9ZNuxqmLM",
            duration=100,
            course=courses[3],  
),
        Video(
            url="https://www.youtube.com/watch?v=Moq94c9DtGE",
            duration=50,
            course=courses[4],  
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
        TextBlock(
            body_content=(
        "Pentru bebeluși sub 1 an, obstrucția severă de căi aeriene se tratează "
        "prin 5 lovituri între omoplați și 5 compresii toracice. Nu se aplică Heimlich."
        )
    ),
    TextBlock(
        body_content=(
        "Cele mai frecvente accidente ale nou-născutului includ căderile, "
        "arsurile și sufocarea. Părinții trebuie să asigure un mediu sigur "
        "prin supraveghere constantă și eliminarea riscurilor."
    )
),
    ]
    session.add_all(texts)
    session.flush()
    return texts


def seed_images(session, courses, texts):
    images = [
        Image(
            url="https://wikimami.ro/wp-content/uploads/2022/10/sangerari.jpg",
            alt_text="Pași pentru aplicarea unui garou pe membrul superior",
            course=courses[0],
            text=texts[0],
        ),
        Image(
            url="https://image.stirileprotv.ro/media/images/680xX/Dec2011/60532296.jpg",
            alt_text="Poziționarea corectă a electrozilor AED la adult",
            course=courses[1],
            text=texts[1],
        ),
        Image(
            url="https://clinica-aliat-suceava.ro/wp-content/uploads/elementor/thumbs/trauma-si-mecanismele-de-coping-qs60ap4gs9tczhg7anmxpinp7i0exdotlvz5twi360.jpg",
            alt_text="Echipă demonstrând manevra log-roll cu stabilizarea capului",
            course=courses[2],
            text=texts[2],
        ),
        Image(
             url="https://wikimami.ro/wp-content/uploads/2022/11/compresii-toracice-bebelusi.png",
            alt_text="Demonstrație tehnică back blows + compresii toracice la sugar",
            course=courses[3],
            text=texts[3],
        ),
        Image(
        url="https://cdn.contentspeed.ro/slir/w600/chicco.websales.ro/cs-content/cs-photos/blog/original//374_1707736126.jpg.webp",
        alt_text="Exemplu de casă pregătită pentru siguranța unui nou-născut",
        course=courses[4],
        text=texts[4],
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
        Flashcard(
        front_text="Ce tehnică se folosește pentru obstrucția de căi aeriene la sugar?",
        back_text="5 lovituri între omoplați + 5 compresii toracice, repetate.",
        course=courses[3],
        ),
        Flashcard(
        front_text="Care este cea mai importantă regulă de siguranță în primul an de viață?",
        back_text="Supravegherea constantă și eliminarea riscurilor din mediul casei.",
        course=courses[4],
),
    ]
    session.add_all(flashcards)
    session.flush()
    return flashcards


def seed_quizzes(session, chapters):
    quizzes = [
        Quiz(title="Controlul hemoragiei - verificare rapidă", chapter=chapters[0]),
        Quiz(title="CPR avansat - recapitulare", chapter=chapters[3]), 
        Quiz(title="Imobilizarea victimelor", chapter=chapters[6]),     
        Quiz(title="Primul ajutor la nou-născuți - test rapid", chapter=chapters[9]),
        Quiz(title="Siguranța bebelușului - verificare generală", chapter=chapters[12]),

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

    all_questions_data = [
   
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

        [
            {
                "q": "Care este primul pas în obstrucția severă a căilor aeriene la sugar?",
                "a1": "Aplici manevra Heimlich.",
                "a2": "Administrezi 5 lovituri ferme între omoplați.",
                "a3": "Îi dai apă pentru a înghiți mai ușor.",
                "correct": 2
            },
            {
                "q": "Câte compresii toracice se aplică la sugar în obstrucție?",
                "a1": "3 compresii.",
                "a2": "5 compresii.",
                "a3": "10 compresii.",
                "correct": 2
            },
            {
                "q": "Cum verifici starea sugarului după ciclurile 5+5?",
                "a1": "Dacă plânge sau tușește, înseamnă că respirația a revenit.",
                "a2": "Ții sugarul în poziție verticală 5 minute.",
                "a3": "Aplici masaj cardiac imediat.",
                "correct": 1
            },
        ],

        [
            {
                "q": "Care este cea mai frecventă cauză de accident la bebeluși?",
                "a1": "Căderile de la mică înălțime.",
                "a2": "Înțepăturile cu insecte.",
                "a3": "Răcelile sezoniere.",
                "correct": 1
            },
            {
                "q": "Ce NU trebuie lăsat niciodată lângă un nou-născut?",
                "a1": "Perne și pături voluminoase.",
                "a2": "O lumină de veghe.",
                "a3": "Un prosop rulat sub cap.",
                "correct": 1
            },
            {
                "q": "Care este regula de aur pentru prevenirea sufocării?",
                "a1": "Obiectele trebuie să fie mai mari decât diametrul gurii bebelușului.",
                "a2": "Bebelușul trebuie să doarmă pe burtă.",
                "a3": "Bebelușul poate mânca orice dacă este supravegheat.",
                "correct": 1
            },
        ],
    ]

    for quiz, questions_list in zip(quizzes, all_questions_data):
        for item in questions_list:
            new_q = Question(
                question_text=item["q"],
                answer1_text=item["a1"],
                answer2_text=item["a2"],
                answer3_text=item["a3"],
                correct_answer=item["correct"],
                quiz=quiz
            )
            session.add(new_q)

    session.flush()


def main():
    Base.metadata.create_all(bind=engine)
    with get_session() as session:
        clear_tables(session)
        print("🧹 Tabele curățate.")
        
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