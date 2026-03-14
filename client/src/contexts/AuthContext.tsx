import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import type { AccountInfo } from '@azure/msal-browser'
import { loginWithBackend } from '#/api/auth'
import type { LoginResponse } from '#/api/auth'

const AUTH_STORAGE_KEY = 'we-cook-auth'
const BACKEND_USER_KEY = 'we-cook-backend-user'
const ALLOWED_EMAIL_SUFFIX = '.edu.au'

export interface AuthUser {
  email: string
  name: string
  picture?: string
  idToken: string
}

interface AuthState {
  user: AuthUser | null
  /** User object from backend (POST /auth/login) after login/register */
  backendUser: LoginResponse | null
  isAuthenticated: boolean
  /** True while MSAL is initializing or we have an account but haven't finished token acquisition yet. Don't redirect during this. */
  isAuthLoading: boolean
  isMicrosoftReady: boolean
  signInWithMicrosoft: () => void
  signOut: () => void
  authError: string | null
}

const AuthContext = createContext<AuthState | null>(null)

function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().endsWith(ALLOWED_EMAIL_SUFFIX)
}

function accountToAuthUser(account: AccountInfo, idToken: string): AuthUser {
  const email = account.username ?? (account.idTokenClaims as Record<string, unknown>)?.preferred_username ?? (account.idTokenClaims as Record<string, unknown>)?.email as string ?? ''
  const name = account.name ?? (account.idTokenClaims as Record<string, unknown>)?.name as string ?? email
  const picture = (account.idTokenClaims as Record<string, unknown>)?.picture as string | undefined
  return {
    email,
    name,
    picture,
    idToken,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { instance, accounts, inProgress } = useMsal()
  const isAuthenticatedMsal = useIsAuthenticated()
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!raw) return null
      const data = JSON.parse(raw) as AuthUser
      if (!data.email || !data.idToken) return null
      if (!isAllowedEmail(data.email)) return null
      return data
    } catch {
      return null
    }
  })
  const [authError, setAuthError] = useState<string | null>(null)
  const [backendUser, setBackendUser] = useState<LoginResponse | null>(() => {
    try {
      const raw = localStorage.getItem(BACKEND_USER_KEY)
      if (!raw) return null
      return JSON.parse(raw) as LoginResponse
    } catch {
      return null
    }
  })

  const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID as string | undefined
  const isMicrosoftReady = Boolean(clientId) && inProgress === 'none'
  // Still loading: MSAL busy (e.g. handling redirect) or we have an account but token not acquired yet
  const isAuthLoading =
    inProgress !== 'none' || (isAuthenticatedMsal && accounts.length > 0 && !user)

  useEffect(() => {
    if (!isAuthenticatedMsal || accounts.length === 0) return
    const account = accounts[0]
    const email = account.username ?? (account.idTokenClaims as Record<string, unknown>)?.preferred_username ?? (account.idTokenClaims as Record<string, unknown>)?.email as string ?? ''
    if (!isAllowedEmail(email)) {
      setAuthError('Only .edu.au email addresses can sign in.')
      instance.logoutRedirect().catch(() => {})
      return
    }
    setAuthError(null)
    instance.acquireTokenSilent({ scopes: ['User.Read', 'openid', 'profile', 'email'], account })
      .then((response) => {
        const authUser = accountToAuthUser(account, response.idToken)
        setUser(authUser)
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
        } catch {
          // ignore
        }
        return authUser
      })
      .then((authUser) => {
        loginWithBackend({
          email: authUser.email,
          displayName: authUser.name,
        })
          .then((res) => {
            setBackendUser(res)
            try {
              localStorage.setItem(BACKEND_USER_KEY, JSON.stringify(res))
            } catch {
              // ignore
            }
          })
          .catch((err) => setAuthError(err.message ?? 'Backend login failed.'))
      })
      .catch(() => {
        instance.acquireTokenPopup({ scopes: ['User.Read', 'openid', 'profile', 'email'], account })
          .then((response) => {
            const authUser = accountToAuthUser(account, response.idToken)
            setUser(authUser)
            try {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
            } catch {
              // ignore
            }
            return authUser
          })
          .then((authUser) => {
            loginWithBackend({
              email: authUser.email,
              displayName: authUser.name,
            })
              .then((res) => {
                setBackendUser(res)
                try {
                  localStorage.setItem(BACKEND_USER_KEY, JSON.stringify(res))
                } catch {
                  // ignore
                }
              })
              .catch((err) => setAuthError(err.message ?? 'Backend login failed.'))
          })
          .catch(() => setAuthError('Failed to get token.'))
      })
  }, [isAuthenticatedMsal, accounts, instance])

  useEffect(() => {
    if (!isAuthenticatedMsal && accounts.length === 0) {
      setUser(null)
      setBackendUser(null)
      setAuthError(null)
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        localStorage.removeItem(BACKEND_USER_KEY)
      } catch {
        // ignore
      }
    }
  }, [isAuthenticatedMsal, accounts.length])

  const signInWithMicrosoft = useCallback(() => {
    setAuthError(null)
    instance.loginRedirect({ scopes: ['User.Read', 'openid', 'profile', 'email'] }).catch((err) => {
      if (err.message?.includes('user_cancelled') || err.errorCode === 'user_cancelled') return
      setAuthError(err.message ?? 'Sign-in failed.')
    })
  }, [instance])

  const signOut = useCallback(() => {
    setUser(null)
    setBackendUser(null)
    setAuthError(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(BACKEND_USER_KEY)
    } catch {
      // ignore
    }
    instance.logoutRedirect().catch(() => {})
  }, [instance])

  const value = useMemo<AuthState>(
    () => ({
      user,
      backendUser,
      isAuthenticated: !!user,
      isAuthLoading,
      isMicrosoftReady,
      signInWithMicrosoft,
      signOut,
      authError,
    }),
    [user, backendUser, isAuthLoading, isMicrosoftReady, signInWithMicrosoft, signOut, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
