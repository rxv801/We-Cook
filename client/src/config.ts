/**
 * API base URL for the backend (System Architecture: Auth, Meals, Orders, etc.)
 * Default: http://localhost:5103/api
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:5103/api'
