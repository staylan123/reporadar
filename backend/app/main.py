from pathlib import Path
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.services import github

# load_dotenv() with no path searches from the process's current working
# directory, not this file's location — `npm run dev` launches uvicorn with
# cwd at the repo root, one level above backend/.env, so the default lookup
# never found it. Pointing at it explicitly makes this work regardless of
# where the process is started from.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI(title="RepoRadar API")

# Allow the Vite dev server to call the API during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/users/{username}")
async def get_user(username: str) -> dict:
    try:
        return await github.get_user(username)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"GitHub user '{username}' not found",
        ) from exc


@app.get("/users/{username}/activity")
async def get_user_activity(
    username: str,
    per_page: int = Query(default=30, ge=1, le=100),
    page: int = Query(default=1, ge=1),
) -> dict:
    try:
        return await github.get_user_activity(
            username,
            per_page=per_page,
            page=page,
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"GitHub user '{username}' not found",
        ) from exc


@app.get("/users/{username}/contributions")
async def get_user_contributions(username: str) -> dict:
    try:
        return await github.get_user_contributions(username)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"GitHub user '{username}' not found",
        ) from exc


@app.get("/users/{username}/repos")
async def get_user_repos(
    username: str,
    type: Literal["owner", "member", "all"] = "owner",
    sort: Literal["created", "updated", "pushed", "full_name"] = "updated",
    direction: Literal["asc", "desc"] = "desc",
    per_page: int = Query(default=30, ge=1, le=100),
    page: int = Query(default=1, ge=1),
) -> dict:
    try:
        return await github.get_user_repos(
            username,
            type=type,
            sort=sort,
            direction=direction,
            per_page=per_page,
            page=page,
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"GitHub user '{username}' not found",
        ) from exc
