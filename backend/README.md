# Backend

FastAPI backend for RepoRadar.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

### GitHub token (optional but recommended)

Unauthenticated requests to the GitHub API are capped at 60/hr per IP. A
token raises that to 5,000/hr — no scopes/permissions are needed since this
app only reads public data.

1. Create a fine-grained token at
   https://github.com/settings/personal-access-tokens/new (leave repository
   access as "Public Repositories" / no permissions needed).
2. Copy `.env.example` to `.env` and paste the token in:
   ```bash
   cp .env.example .env
   ```
3. `.env` is gitignored — it will never be committed. When deploying, set
   `GITHUB_TOKEN` as an environment variable/secret in your host's dashboard
   (Render, Railway, Fly, etc.) instead of shipping a `.env` file.

## Run

```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000, with docs at http://localhost:8000/docs.
