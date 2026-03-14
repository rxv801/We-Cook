import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/contexts/AuthContext'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { isAuthenticated, isAuthLoading, user, backendUser, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) navigate({ to: '/login' })
  }, [isAuthenticated, isAuthLoading, navigate])

  if (isAuthLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4 pt-4">
        <p className="text-[var(--sea-ink)] opacity-80">Loading…</p>
      </main>
    )
  }
  if (!isAuthenticated) return null

  const profile = backendUser ?? null
  const displayName = profile?.displayName ?? user?.name ?? '—'
  const email = profile?.email ?? user?.email ?? '—'
  const university = profile?.university ?? '—'
  const campus = profile?.campus ?? '—'
  const strikeCount = profile?.strikeCount ?? 0
  const isBanned = profile?.isBannedFromPosting ?? false

  return (
    <main className="px-4 pb-8 pt-4">
      <div className="page-wrap mx-auto max-w-[480px]">
        <section aria-label="Profile">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-4">
            {user?.picture && (
              <img
                src={user.picture}
                alt=""
                width={64}
                height={64}
                className="mb-4 rounded-full border border-[var(--line)]"
              />
            )}
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Name</dt>
                <dd className="font-medium text-[var(--sea-ink)]">{displayName}</dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Email</dt>
                <dd className="font-medium text-[var(--sea-ink)]">{email}</dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">University</dt>
                <dd className="font-medium text-[var(--sea-ink)]">{university}</dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Campus</dt>
                <dd className="font-medium text-[var(--sea-ink)]">{campus}</dd>
              </div>
              <div>
                <dt className="text-[var(--sea-ink-soft)]">Strikes</dt>
                <dd className="font-medium text-[var(--sea-ink)]">{strikeCount}</dd>
              </div>
              {isBanned && (
                <p className="text-sm text-red-600">You are banned from posting.</p>
              )}
            </dl>
            <button
              type="button"
              onClick={() => signOut()}
              className="mt-6 rounded-md border border-[var(--line)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--sea-ink)] hover:bg-[var(--line)]"
            >
              Sign out
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
