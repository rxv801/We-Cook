import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '#/contexts/AuthContext'
import { createMeal } from '#/api/meals'
import type { CreateMealDto, MealType } from '#/api/meals'

export const Route = createFileRoute('/meals/new')({
  component: NewMealPage,
})

function NewMealPage() {
  const { isAuthenticated, isAuthLoading, backendUser } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [allergens, setAllergens] = useState('')
  const [type, setType] = useState<MealType>(0)
  const [priceCents, setPriceCents] = useState('')
  const [servingsAvailable, setServingsAvailable] = useState('')
  const [pickupLocationText, setPickupLocationText] = useState('')

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) navigate({ to: '/login' })
  }, [isAuthenticated, isAuthLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!backendUser?.userId) {
      setSubmitError('Session expired. Please sign in again.')
      return
    }
    setSubmitting(true)
    const price = Math.round(parseFloat(priceCents || '0') * 100)
    const servings = parseInt(servingsAvailable || '0', 10)
    if (type === 1 && price !== 0) {
      setSubmitError('Rescue meals must be free (0 price).')
      setSubmitting(false)
      return
    }
    try {
      const body: CreateMealDto = {
        title: title.trim(),
        description: description.trim() || null,
        ingredients: ingredients.trim() || null,
        allergens: allergens.trim() || null,
        type,
        priceCents: price,
        servingsAvailable: isNaN(servings) ? 0 : servings,
        pickupLocationText: pickupLocationText.trim() || null,
      }
      await createMeal(backendUser.userId, body)
      navigate({ to: '/' })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create meal.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isAuthLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-[var(--sea-ink)] opacity-80">Loading…</p>
      </main>
    )
  }
  if (!isAuthenticated) return null

  return (
    <main className="px-4 pb-8 pt-4">
      <div className="page-wrap mx-auto max-w-[480px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Ingredients</span>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={2}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Allergens</span>
            <input
              type="text"
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              placeholder="e.g. nuts, dairy"
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Type</span>
            <select
              value={type}
              onChange={(e) => setType(Number(e.target.value) as MealType)}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            >
              <option value={0}>Marketplace</option>
              <option value={1}>Rescue (free)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Price ($)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={type === 1 ? '0' : priceCents}
              onChange={(e) => setPriceCents(e.target.value)}
              disabled={type === 1}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)] disabled:opacity-70"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Servings available</span>
            <input
              type="number"
              min="1"
              value={servingsAvailable}
              onChange={(e) => setServingsAvailable(e.target.value)}
              required
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--sea-ink)]">Pickup location</span>
            <input
              type="text"
              value={pickupLocationText}
              onChange={(e) => setPickupLocationText(e.target.value)}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon-deep)]"
            />
          </label>
          {submitError && (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
            className="mt-2 rounded-md border border-[var(--line)] bg-[var(--lagoon-deep)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create meal'}
          </button>
        </form>
      </div>
    </main>
  )
}
