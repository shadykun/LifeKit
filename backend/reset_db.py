"""Drop every table and recreate it from the current models.

Development only: all data is lost.
"""

import models  # noqa: F401  (registers the tables on Base.metadata)
from database import Base, engine


def hard_reset_database():
    print("⚠️  ATENȚIE: Această acțiune va șterge toate datele din baza de date!")
    confirm = input("Ești sigur că vrei să continui? (scrie 'DA'): ")

    if confirm != "DA":
        print("Operațiune anulată.")
        return

    print("Se șterg tabelele vechi...")
    Base.metadata.drop_all(bind=engine)

    print("Se creează tabelele noi conform modelelor...")
    Base.metadata.create_all(bind=engine)

    print("✅ Structura bazei de date a fost actualizată (datele au fost resetate).")


if __name__ == "__main__":
    hard_reset_database()
