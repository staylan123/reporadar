"""Client functions for calling the GitHub REST API.

Keep external API calls (GitHub, etc.) out of main.py / route handlers —
routes should call into functions here and just handle the HTTP layer
(status codes, request/response shaping).
"""

import os

import httpx

GITHUB_API_BASE_URL = "https://api.github.com"


def _headers() -> dict[str, str]:
    """Auth header for GitHub API calls.

    Unauthenticated requests are capped at 60/hr per IP; a token (no scopes
    needed for public data) raises that to 5,000/hr. Set GITHUB_TOKEN in the
    environment (e.g. via a local .env, never committed) to enable it.
    """
    token = os.environ.get("GITHUB_TOKEN")
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def get_user(username: str) -> dict:
    async with httpx.AsyncClient(
        base_url=GITHUB_API_BASE_URL, headers=_headers()
    ) as client:
        response = await client.get(f"/users/{username}")
        response.raise_for_status()
        return response.json()


async def get_user_repos(
    username: str,
    type: str = "owner",
    sort: str = "updated",
    direction: str = "desc",
    per_page: int = 30,
    page: int = 1,
) -> dict:
    """GET /users/{username}/repos

    https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user

    GitHub paginates this by page number and doesn't return a total count in
    the body, so we read the `Link` response header (rel="next") to tell the
    caller whether another page exists, instead of guessing from per_page.
    """
    async with httpx.AsyncClient(
        base_url=GITHUB_API_BASE_URL, headers=_headers()
    ) as client:
        response = await client.get(
            f"/users/{username}/repos",
            params={
                "type": type,
                "sort": sort,
                "direction": direction,
                "per_page": per_page,
                "page": page,
            },
        )
        response.raise_for_status()
        return {
            "repos": response.json(),
            "has_next": "next" in response.links,
        }


async def get_user_activity(
    username: str,
    per_page: int = 30,
    page: int = 1,
) -> dict:
    """GET /users/{username}/events/public

    https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user

    Public events only — we call unauthenticated, so private activity isn't
    visible anyway. GitHub caps this at the user's most recent ~300 events
    (last 90 days), regardless of pagination.
    """
    async with httpx.AsyncClient(
        base_url=GITHUB_API_BASE_URL, headers=_headers()
    ) as client:
        response = await client.get(
            f"/users/{username}/events/public",
            params={"per_page": per_page, "page": page},
        )
        response.raise_for_status()
        return {
            "activity": response.json(),
            "has_next": "next" in response.links,
        }
