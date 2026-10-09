"""Vercel serverless entry point for the FastAPI backend.

Vercel rewrites every /api/* request to this function but keeps the original
path, so the backend app (whose routes have no /api prefix) is mounted under
/api here. GITHUB_TOKEN comes from the Vercel project's environment variables.
"""

import sys
from pathlib import Path

from fastapi import FastAPI

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.main import app as backend_app  # noqa: E402

app = FastAPI()
app.mount("/api", backend_app)
