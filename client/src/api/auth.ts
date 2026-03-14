import { API_BASE_URL } from '#/config'

/** User as returned by GET /users/me and POST /auth/login */
export interface ApiUser {
  userId: string
  email: string
  displayName: string
  picture?: string
  university?: string
  campus?: string
  avgRating?: number
  strikeCount?: number
  isBannedFromPosting?: boolean
  createdAt?: string
}

/** POST /api/Auth/login request body (matches backend RegisterUserDto from Swagger) */
export interface LoginRequest {
  email: string
  displayName: string
  university?: string | null
  campus?: string | null
}

/** POST /api/Auth/login response (backend UserDto) */
export interface LoginResponse {
  userId: string
  email: string
  displayName: string
  university?: string | null
  campus?: string | null
  strikeCount?: number
  isBannedFromPosting?: boolean
}

/** Base path for Auth controller: POST /api/Auth/login */
const AUTH_PREFIX = `${API_BASE_URL}/Auth`
const USERS_PREFIX = `${API_BASE_URL}/Users`

function getAuthHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Register or login with backend (POST /api/Auth/login).
 * Body: RegisterUserDto { email, displayName, university?, campus? }.
 * Email must end with .edu.au (enforced by backend).
 */
export async function loginWithBackend(
  body: LoginRequest,
): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_PREFIX}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: body.email,
      displayName: body.displayName,
      university: body.university ?? null,
      campus: body.campus ?? null,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      res.status === 400
        ? text || 'Only .edu.au email addresses can sign in.'
        : text || `Login failed (${res.status})`,
    )
  }
  return res.json() as Promise<LoginResponse>
}

/**
 * Get current user. Use after login or on app load to restore session.
 * GET /users/me
 */
export async function getMe(token: string): Promise<ApiUser> {
  const res = await fetch(`${USERS_PREFIX}/me`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  })
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized')
    const text = await res.text()
    throw new Error(text || `Failed to load user (${res.status})`)
  }
  return res.json() as Promise<ApiUser>
}

/**
 * Update current user profile.
 * PUT /users/me
 */
export async function updateMe(
  token: string,
  body: Partial<Pick<ApiUser, 'displayName' | 'university' | 'campus'>>,
): Promise<ApiUser> {
  const res = await fetch(`${USERS_PREFIX}/me`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Update failed (${res.status})`)
  }
  return res.json() as Promise<ApiUser>
}
