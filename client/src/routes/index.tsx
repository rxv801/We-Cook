import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '#/contexts/AuthContext'
import { getFeed } from '#/api/meals'
import type { MealDto } from '#/api/meals'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const navigate = useNavigate()
  const [meals, setMeals] = useState<MealDto[]>([])
  const [feedError, setFeedError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    let cancelled = false
    setLoading(true)
    setFeedError(null)
    getFeed()
      .then((data) => {
        if (!cancelled) setMeals(data)
      })
      .catch((err) => {
        if (!cancelled) setFeedError(err instanceof Error ? err.message : 'Failed to load feed.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [isAuthenticated, isAuthLoading, navigate])

  if (isAuthLoading) {
    return (
      <main className="feed-page flex min-h-[40vh] items-center justify-center px-4 pt-4">
        <p className="text-[var(--sea-ink)] opacity-80">Loading…</p>
      </main>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="feed-page">
      <div className="page-wrap mx-auto max-w-[640px] px-4 pb-4 pt-4">
        <section aria-label="Feed">
          {loading && (
            <p className="py-8 text-center text-[var(--sea-ink)] opacity-80">Loading feed…</p>
          )}
          {feedError && (
            <p className="py-4 text-center text-sm text-red-600" role="alert">
              {feedError}
            </p>
          )}
          {!loading && !feedError && meals.length === 0 && (
            <p className="py-8 text-center text-[var(--sea-ink-soft)]">No meals yet.</p>
          )}
          {!loading && !feedError && meals.length > 0 && (
            <ul className="grid grid-cols-2 gap-3">
              {meals.map((meal) => (
                <li key={meal.mealListingId}>
                  <MealCard meal={meal} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

function MealCard({ meal }: { meal: MealDto }) {
  const price =
    meal.type === 1 ? 'Free' : `$${(meal.priceCents / 100).toFixed(2)}`
  return (
    <article
      className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-3"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <h3 className="font-medium text-[var(--sea-ink)] line-clamp-2">
        {meal.title}
      </h3>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{meal.cookName}</p>
      <p className="mt-1 text-sm font-medium text-[var(--lagoon-deep)]">
        {price}
        {meal.type === 0 && (
          <span className="ml-1 font-normal text-[var(--sea-ink-soft)]">
            · {meal.servingsAvailable} left
          </span>
        )}
      </p>
    </article>
  )
}
