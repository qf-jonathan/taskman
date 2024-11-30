# Taskman

This project implements a basic task management system using FastAPI, PostgreSQL, and Next.js.

## Requirements

- [Docker](https://www.docker.com/).
- [uv](https://docs.astral.sh/uv/) for Python package and environment management.
- [Python](https://www.python.org/) for the backend.
- [Node.js](https://nodejs.org/en/) for the frontend.

## Running with Docker Compose

Execute the following commands to start the stack:

```bash
docker compose build
docker compose up -d
```

## Running Locally

### Database

We can create a local PostgreSQL database with Docker, run this on the root directory of the project:

```bash
docker run --name local-development-postgres --env-file .env -p 5432:5432 -d postgres
```

### Backend

Inside the `backend` directory, run:

```bash
uv sync
uv run alembic upgrade head
uv run fastapi run --reload app/main.py
```

### Frontend

Inside the `frontend` directory, run:

```bash
npm install
npm run build
npm start
```

## Explore the project:

The app backend is running at `http://localhost:8000`, and the frontend is running at `http://localhost:3000`.
