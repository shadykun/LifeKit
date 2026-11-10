# LifeKit

A mobile app that teaches first aid: short step-by-step lessons, videos, flashcards and quizzes, plus a map of the places in Cluj-Napoca where you can take a hands-on course.

Built by team **UnLockedBV** at Hermes Hackathon. The pitch deck is in [`LifeKit.pptx`](LifeKit.pptx).

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [API](#api)
- [Data model](#data-model)
- [Known limitations](#known-limitations)
- [Team](#team)

## Features

| Area | What it does |
| --- | --- |
| Authentication | Email and password accounts through Firebase Authentication; the session is kept on the device. |
| Modules | The list of first-aid courses, loaded from the API. |
| Lesson | A step-by-step guide (text + image) or a demo video opened in YouTube. |
| Flashcards | Question/answer cards with a flip animation, filtered by course. |
| Quiz | Three-option questions with instant feedback and a final score. |
| Parenting mode | A profile switch that also shows the courses aimed at parents (infants, newborns). |
| Map | First-aid centers in Cluj-Napoca, found through Google Places. On web they are shown as a list. |
| Admin panel (demo) | A form for adding courses, quizzes, questions, flashcards, texts, images and videos. |

The app's interface is in Romanian.

## Architecture

```
┌──────────────────────┐        HTTP/JSON        ┌──────────────────────┐        ┌────────────┐
│  frontend/           │ ──────────────────────▶ │  backend/            │ ─────▶ │ PostgreSQL │
│  Expo / React Native │                         │  FastAPI + SQLAlchemy│        └────────────┘
└──────────┬───────────┘                         └──────────┬───────────┘
           │                                                │
           ▼                                                ▼
   Firebase Authentication                          Google Places API
```

- **Frontend:** Expo SDK 58, React Native 0.88, React Navigation 7 (Android, iOS and web).
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL 15, run with Docker Compose.
- The app authenticates directly against Firebase; the backend has no accounts and does not verify the user.

## Project structure

```
LifeKit/
├── backend/
│   ├── main.py              # the FastAPI application
│   ├── database.py          # PostgreSQL connection and session
│   ├── models/              # tables (SQLAlchemy)
│   ├── schemas.py           # request/response schemas (Pydantic)
│   ├── routers/
│   │   ├── crud.py          # CRUD router factory shared by every resource
│   │   ├── __init__.py      # the list of resources and routers
│   │   └── nearby.py        # first-aid center lookup
│   ├── seed_db.py           # fills the database with demo content
│   ├── reset_db.py          # drops and recreates the tables
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/
│   ├── App.js               # session restore: Login or the app itself
│   └── src/
│       ├── config.js        # API URL and the map's reference location
│       ├── navigation/      # tabs and the screen stack
│       ├── screens/         # one file per screen
│       ├── components/      # shared components
│       ├── hooks/           # useNearbyPlaces
│       ├── services/        # API client and Firebase setup
│       ├── constants/       # AsyncStorage keys, admin panel forms
│       └── utils/
└── LifeKit.pptx
```

## Quick start

You need Docker (for the backend) and Node.js 22.13+ (for the frontend).

### 1. Backend

```bash
cd backend
cp .env.example .env          # fill in GOOGLE_API_KEY if you want the map
docker compose up --build -d
docker compose exec app python seed_db.py
```

The API runs at <http://localhost:8000> and the interactive docs at <http://localhost:8000/docs>.

`seed_db.py` creates the tables and **replaces** all existing content with the demo set (5 courses, 15 chapters, 5 quizzes with 3 questions each, flashcards, texts, images and videos).

### 2. Frontend

```bash
cd frontend
npm install
npx expo start
```

Then scan the QR code with Expo Go, or press `a` (Android), `i` (iOS) or `w` (web). Expo Go must support SDK 58, so update it if it says the project is incompatible.

By default the app talks to the API hosted by the team. To point it at your local backend, see [Configuration](#configuration).

## Configuration

### Backend (`backend/.env`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `GOOGLE_API_KEY` | – | Google Places (Text Search) key. Without it, `/nearby/first-aid-centers` responds with 500. |
| `POSTGRES_USER` | `postgres` | Database user. |
| `POSTGRES_PASSWORD` | `password` | Database password. |
| `POSTGRES_DB` | `learning_platform` | Database name. |
| `POSTGRES_HOST` | `localhost` | Database host. |
| `POSTGRES_PORT` | `5432` | Database port. |

With Docker Compose the `POSTGRES_*` variables are already set in `docker-compose.yml`; you only need to fill in `GOOGLE_API_KEY`.

### Frontend (`frontend/.env`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | The API hosted by the team (see `src/config.js`) | Backend address. |

```bash
cd frontend
cp .env.example .env
# on a phone or emulator use your machine's LAN IP, not localhost
```

The Firebase configuration lives in `frontend/src/services/firebase.js`.

## API

Every content resource has the same five routes:

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/{resource}/` | Full list |
| `GET` | `/{resource}/{id}` | One item (404 if missing) |
| `POST` | `/{resource}/` | Create |
| `PUT` | `/{resource}/{id}` | Replace |
| `DELETE` | `/{resource}/{id}` | Delete |

Resources: `courses`, `chapters`, `flashcards`, `quizzes`, `questions`, `videos`, `texts`, `images`.

Other routes:

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `GET` | `/nearby/first-aid-centers?lat=&lon=&radius=` | First-aid centers in Cluj-Napoca (`radius` in meters, default 5000) |

The exact fields of each resource are in `backend/schemas.py` and in `/docs`.

## Data model

```
Course ─┬─< Chapter ──< Quiz ──< Question
        ├─< Flashcard
        ├─< Video
        └─< Image >── Text
```

- A **course** has chapters, flashcards, videos and images; `parenting = true` marks it as a course for parents.
- A **quiz** belongs to a chapter, and a **question** has three options and the index of the correct one (1–3).
- A **text** is not linked directly to a course; an image can be attached to a text.

## Known limitations

- **Quiz–course link:** quizzes are linked to chapters, but the app looks them up by course and, failing that, matches the quiz `id` against the course `id`. Lesson texts are likewise matched by their own `id`. This works on a fresh database seeded once with `seed_db.py` (the ids line up), but not in general.
- **Admin panel:** the quiz form sends `course_id` while the API requires `chapter_id`, so creating quizzes from the app is rejected. The course delete button is not wired up.
- **No authorization in the backend:** anyone can call the write and delete routes.
- **Placeholder data in the UI:** course progress, the "Continuă învățarea" card and the age on the profile are fixed values; the age asked for at registration is not saved.
- **The map** uses a fixed location (the center of Cluj), not the device's position.

## Team

**UnLockedBV:** Oneț Rareș-Nicolae, Anca Nicolae-Aurelian, Oatu Mihai, Andrei Denis Eric Mihai, Șoltuz Rareș-Florin.
