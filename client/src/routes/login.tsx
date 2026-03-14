import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/contexts/AuthContext'
import { GoogleSignInButton } from '#/components/GoogleSignInButton'

export const Route = createFileRoute('/login')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="mx-auto max-w-md pt-16">
        <p className="mb-6 text-[var(--sea-ink)]">
          Sign in to browse meals and connect with cooks.
        </p>
        <GoogleSignInButton />
      </section>
    </main>
  )
}
