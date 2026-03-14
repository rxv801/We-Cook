import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated, isAuthLoading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    } else {
      console.log(user)
    }
  }, [isAuthenticated, isAuthLoading, navigate, user])

  if (isAuthLoading) {
    return (
      <main className="page-wrap flex items-center justify-center px-4 pb-8 pt-14">
        <p className="text-[var(--sea-ink)] opacity-80">Loading…</p>
      </main>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  return <div>Hello "/feed"!</div>
}
