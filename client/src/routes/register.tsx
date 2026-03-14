import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/contexts/AuthContext'
import { MicrosoftSignInButton } from '#/components/MicrosoftSignInButton'

export const Route = createFileRoute('/register')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthLoading) return
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isAuthLoading, navigate])

  if (isAuthLoading) {
    return (
      <main className="page-wrap flex items-center justify-center px-4 pb-8 pt-14">
        <p className="text-[var(--sea-ink)] opacity-80">Loading…</p>
      </main>
    )
  }
  if (isAuthenticated) {
    return null
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="mx-auto max-w-md pt-16">
        <p className="mb-6 text-[var(--sea-ink)]">
          Sign in to browse meals and connect with cooks.
        </p>
        <MicrosoftSignInButton />
      </section>
    </main>
  )
}
