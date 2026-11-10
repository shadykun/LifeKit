from fastapi import FastAPI

import models  # noqa: F401  (registers the tables on Base.metadata)
from database import Base, engine
from routers import all_routers

app = FastAPI(title="Learning Platform API")

for router in all_routers:
    app.include_router(router)


@app.get("/")
def root():
    return {"status": "API running!"}


def init_db():
    print("Se generează tabelele în baza de date...")
    Base.metadata.create_all(bind=engine)
    print("Tabele generate cu succes!")


if __name__ == "__main__":
    init_db()
