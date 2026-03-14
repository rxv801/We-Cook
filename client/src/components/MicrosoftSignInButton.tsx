import { useAuth } from '#/contexts/AuthContext'

/**
 * Sign in with Microsoft. Only .edu.au emails are allowed to complete sign-in.
 */
export function MicrosoftSignInButton() {
  const { isMicrosoftReady, signInWithMicrosoft, authError } = useAuth()

  if (!isMicrosoftReady) {
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
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={signInWithMicrosoft}
        className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-2.5 text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
      >
        Sign in with Microsoft
      </button>
      {authError ? (
        <p className="text-sm text-red-600" role="alert">
          {authError}
        </p>
      ) : (
        <p className="text-sm text-[var(--sea-ink)] opacity-80">
          Only .edu.au email addresses can sign in.
        </p>
      )}
    </div>
  )
}
