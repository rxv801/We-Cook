import { useEffect, useRef } from 'react'
import { useAuth } from '#/contexts/AuthContext'

/**
 * Renders the official Google "Sign in with Google" button via GSI.
 * When VITE_GOOGLE_CLIENT_ID is set, uses Google's button; otherwise a fallback that opens One Tap.
 */
export function GoogleSignInButton() {
  const { isGoogleReady, signInWithGoogle } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef(false)

  useEffect(() => {
    if (!isGoogleReady || !containerRef.current || !window.google?.accounts?.id) return
    if (renderedRef.current) return
    renderedRef.current = true
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      width: 280,
    })
  }, [isGoogleReady])

  if (!isGoogleReady) {
    return (
      <button
        type="button"
        className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-2.5 text-[var(--sea-ink)] opacity-70"
        disabled
      >
        Loading…
      </button>
    )
  }

  return (
    <div ref={containerRef} className="min-h-[40px]">
      {/* Fallback when no Google button rendered (e.g. missing VITE_GOOGLE_CLIENT_ID) */}
      {typeof window !== 'undefined' && !window.google?.accounts?.id ? (
        <button
          type="button"
          onClick={signInWithGoogle}
          className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-2.5 text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
        >
          Sign in with Google
        </button>
      ) : null}
    </div>
  )
}
