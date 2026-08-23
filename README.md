# reporadar

Full-stack skeleton: React + TypeScript + Vite frontend, Python + FastAPI backend. No database.

## Structure

```
frontend/   React + TypeScript + Vite app
backend/    FastAPI app
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173.

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at http://localhost:8000 (docs at /docs).
