"""Vercel serverless entry point for the FastAPI backend.

vercel.json rewrites /api/<rest> to this function as /api/index?__path=<rest>,
and Vercel hands the function the rewritten path, not the original one. The
middleware below puts the original path back before routing, and the backend
app (whose routes have no /api prefix) is mounted under /api. GITHUB_TOKEN
comes from the Vercel project's environment variables.
"""

import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode

from fastapi import FastAPI

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.main import app as backend_app  # noqa: E402


class RestoreOriginalPath:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            params = parse_qsl(scope["query_string"].decode(), keep_blank_values=True)
            forwarded = [value for key, value in params if key == "__path"]
            if forwarded:
                path = "/api/" + forwarded[0].lstrip("/")
                rest = [(key, value) for key, value in params if key != "__path"]
                scope = {
                    **scope,
                    "path": path,
                    "raw_path": path.encode(),
                    "query_string": urlencode(rest).encode(),
                }
        await self.app(scope, receive, send)


app = FastAPI()
app.add_middleware(RestoreOriginalPath)
app.mount("/api", backend_app)
