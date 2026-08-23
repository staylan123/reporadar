from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.services import github

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


@app.get("/users/{username}/repos")
async def get_user_repos(
    username: str,
    type: Literal["owner", "member", "all"] = "owner",
    sort: Literal["created", "updated", "pushed", "full_name"] = "updated",
    direction: Literal["asc", "desc"] = "desc",
    per_page: int = Query(default=30, ge=1, le=100),
    page: int = Query(default=1, ge=1),
) -> list[dict]:
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
