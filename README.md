# RepoRadar

RepoRadar is a project that combines a React frontend and a Python backend
to make a dashboard that surfaces a GitHub profile's repositories,
languages, and contribution activity. Look up any public GitHub username
and see their profile, repositories, languages, top starred projects,
contribution history, and recent activity, all in one place.

It's a small full-stack app with no database: the backend does nothing but
proxy requests to GitHub's REST and GraphQL APIs. See the in-app
[About page](http://localhost:5173/about) (once running) for the tech
stack and API links.

## Features

- Look up any public GitHub user by username
- Profile overview: avatar, bio, location, blog, email, followers/following, join date
- Repo stats: total stars, forks, active-in-90-days count, language count, top language, most-starred repo, account age
- Language breakdown donut chart
- Top starred repositories
- Contribution calendar (heatmap), for personal accounts only, not organizations
- Full repo browser: sortable (updated/created/name), paginated
- Recent public activity feed (pushes, PRs, issues, forks, releases, stars)
- Light/dark theme toggle

## Structure

```
frontend/   React + TypeScript + Vite app
backend/    FastAPI app
```

## Quick start

From the repo root, run both frontend and backend together:

```bash
npm install
npm run dev
```

Frontend runs at http://localhost:5173, backend at http://localhost:8000
(docs at `/docs`). Or run them separately:

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### GitHub token (optional but recommended)

Unauthenticated requests to the GitHub API are capped at 60/hr per IP. A
token raises that to 5,000/hr, and it's required for the contribution
calendar, since that's only available via GitHub's GraphQL API, which
always requires authentication. No scopes/permissions are needed, since
this app only reads public data. See
[`backend/README.md`](backend/README.md) for setup steps.

## Tech stack

**Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS, Base UI, shadcn

**Backend:** FastAPI, Uvicorn, httpx, python-dotenv

**APIs:** [GitHub REST API](https://docs.github.com/en/rest) (users, repos, events) and [GitHub GraphQL API](https://docs.github.com/en/graphql) (`contributionsCollection`, for the heatmap)
