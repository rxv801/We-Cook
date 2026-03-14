import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return <div>Hello "/feed"!</div>
}
