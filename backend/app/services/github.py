"""Client functions for calling the GitHub REST API.

Keep external API calls (GitHub, etc.) out of main.py / route handlers —
routes should call into functions here and just handle the HTTP layer
(status codes, request/response shaping).
"""

import httpx

GITHUB_API_BASE_URL = "https://api.github.com"


async def get_user(username: str) -> dict:
    async with httpx.AsyncClient(base_url=GITHUB_API_BASE_URL) as client:
        response = await client.get(f"/users/{username}")
        response.raise_for_status()
        return response.json()
