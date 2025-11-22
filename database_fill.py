"""Utility script for seeding the PostgreSQL database with first-aid content."""

from contextlib import contextmanager

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
	quizzes = [
		Quiz(title="Controlul hemoragiei - verificare rapidă", chapter=chapters[0]),
		Quiz(title="CPR avansat - recapitulare", chapter=chapters[3]),
		Quiz(title="Imobilizarea victimelor", chapter=chapters[6]),
	]
	session.add_all(quizzes)
	session.flush()
	return quizzes


def seed_questions(session, quizzes):
	question_sets = [
		[
			(
				"Care este prima acțiune când observi o hemoragie masivă?",
				"Asigură-ți siguranța, apoi aplică presiune directă imediată.",
			),
			(
				"După cât timp trebuie strâns din nou garoul dacă sângerarea reapare?",
				"Verifică la 2-3 minute și strânge până când sângerarea se oprește complet.",
			),
			(
				"Ce semn confirmă că garoul este eficient?",
				"Dispariția pulsului periferic distal și oprirea completă a sângerării.",
			),
		],
		[
			(
				"Care este raportul compresii-ventilații pentru un adult cu un singur salvator?",
				"30 compresii la 2 ventilații, menținând frecvența 100-120/minut.",
			),
			(
				"Cum reduci întreruperile compresiilor când folosești AED-ul?",
				"Aplici electrozii în timp ce alt salvator continuă compresiile, apoi analizezi rapid.",
			),
			(
				"Ce semn indică o calitate scăzută a compresiilor?",
				"Revenirea incompletă a toracelui și adâncimea sub 5 cm.",
			),
		],
		[
			(
				"Când se aplică gulerul cervical rigid?",
				"După stabilizarea manuală a capului și evaluarea căilor aeriene.",
			),
			(
				"Ce echipă minimă este recomandată pentru manevra log-roll sigură?",
				"Patru persoane: una la cap și câte una la torace, pelvis și membre inferioare.",
			),
			(
				"Ce parametru monitorizezi continuu după imobilizarea pe targă?",
				"Saturația de oxigen și semnele vitale la fiecare 5 minute.",
			),
		],
	]

	for quiz, question_data in zip(quizzes, question_sets):
		for question_text, answer_text in question_data:
			session.add(Question(question_text=question_text, answer_text=answer_text, quiz=quiz))
	session.flush()


def main():
	Base.metadata.create_all(bind=engine)
	with get_session() as session:
		clear_tables(session)
		seed_accounts(session)
		courses = seed_courses(session)
		chapters = seed_chapters(session, courses)
		seed_videos(session, courses)
		texts = seed_texts(session)
		seed_images(session, courses, texts)
		seed_flashcards(session, courses)
		quizzes = seed_quizzes(session, chapters)
		seed_questions(session, quizzes)
	print("✅ Baza de date a fost populată cu date de prim ajutor.")


if __name__ == "__main__":
	main()
