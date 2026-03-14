import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

const AUTH_STORAGE_KEY = 'we-cook-auth'

export interface AuthUser {
  email: string
  name: string
  picture?: string
  idToken: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isGoogleReady: boolean
  signInWithGoogle: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

function parseJwtPayload(token: string): {
  email?: string
  name?: string
  picture?: string
} {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return {}
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as {
      email?: string
      name?: string
      picture?: string
    }
  } catch {
    return {}
  }
}

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src*="accounts.google.com/gsi/client"]',
    )
    if (existing) {
      if (window.google?.accounts.id) return resolve()
      window.onGoogleLibraryLoad = () => resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      if (window.google?.accounts.id) return resolve()
      window.onGoogleLibraryLoad = () => resolve()
    }
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'))
    document.head.appendChild(script)
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      // localStorage.removeItem(AUTH_STORAGE_KEY)
      const raw = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!raw) return null
      const data = JSON.parse(raw) as AuthUser
      return data.email && data.idToken ? data : null
    } catch {
      return null
    }
  })
  const [isGoogleReady, setGoogleReady] = useState(false)
  const initRef = useRef(false)

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    if (!clientId) {
      setGoogleReady(true)
      return
    }
    loadGoogleScript()
      .then(() => {
        window.google?.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            const payload = parseJwtPayload(response.credential)
            const authUser: AuthUser = {
              email: payload.email ?? '',
              name: payload.name ?? payload.email ?? '',
              picture: payload.picture,
              idToken: response.credential,
            }
            setUser(authUser)
            try {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
            } catch {
              // ignore
            }
          },
        })
        setGoogleReady(true)
      })
      .catch(() => setGoogleReady(true))
  }, [clientId])

  const signInWithGoogle = useCallback(() => {
    if (!window.google?.accounts.id || !clientId) return
    window.google.accounts.id.prompt()
  }, [clientId])

  const signOut = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // ignore
    }
    if (window.google?.accounts.id) {
      window.google.accounts.id.disableAutoSelect()
      window.google.accounts.id.cancel()
    }
  }, [])

  const hasClientId = Boolean(clientId)
  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      isGoogleReady: hasClientId && isGoogleReady,
      signInWithGoogle,
      signOut,
    }),
    [user, isGoogleReady, signInWithGoogle, signOut, hasClientId],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
