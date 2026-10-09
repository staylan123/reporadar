// Same-origin in every environment: Vercel routes /api to the FastAPI
// function, and the Vite dev server proxies /api to uvicorn locally.
export const API_BASE_URL = '/api'

// Every backend endpoint the FE calls, grouped by service and named after
// what it does. Each entry is a function so path params (username, etc.)
// stay type-checked at the call site instead of getting hand-built inline.
export const API = {
  GITHUB: {
    GET_USER: (username: string) => `${API_BASE_URL}/users/${username}`,
    GET_USER_REPOS: (username: string) =>
      `${API_BASE_URL}/users/${username}/repos`,
    GET_USER_ACTIVITY: (username: string) =>
      `${API_BASE_URL}/users/${username}/activity`,
    GET_USER_CONTRIBUTIONS: (username: string) =>
      `${API_BASE_URL}/users/${username}/contributions`,
  },
} as const

// The backend returns errors as FastAPI's `{ detail: string }` — surface that
// message (e.g. rate-limit notices) instead of a bare status code.
export const readError = async (
  res: Response,
  fallback: string,
): Promise<string> => {
  try {
    const body = (await res.json()) as { detail?: unknown }
    if (typeof body.detail === 'string') return body.detail
  } catch {
    // response body wasn't JSON — fall through
  }
  return `${fallback} (${res.status})`
}
