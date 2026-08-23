# Backend

FastAPI backend for RepoRadar.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000, with docs at http://localhost:8000/docs.
