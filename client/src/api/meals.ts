import { API_BASE_URL } from '#/config'

/** MealType: 0 = Marketplace, 1 = Rescue */
export type MealType = 0 | 1

/** MealListingStatus: 0 = Active, 1 = SoldOut, 2 = Removed */
export type MealListingStatus = 0 | 1 | 2

/** GET /api/Meals response item (backend MealDto) */
export interface MealDto {
  mealListingId: string
  title: string
  description: string | null
  type: MealType
  priceCents: number
  servingsAvailable: number
  pickupLocationText: string | null
  status: MealListingStatus
  cookId: string
  cookName: string
}

/** POST /api/Meals body (backend CreateMealDto) */
export interface CreateMealDto {
  title: string
  description?: string | null
  ingredients?: string | null
  allergens?: string | null
  type: MealType
  priceCents: number
  servingsAvailable: number
  pickupLocationText?: string | null
}

const MEALS_PREFIX = `${API_BASE_URL}/Meals`

/**
 * GET /api/Meals - fetch all meals for feed (optional type filter).
 */
export async function getFeed(type?: MealType): Promise<MealDto[]> {
  const url = type != null ? `${MEALS_PREFIX}?type=${type}` : MEALS_PREFIX
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Feed failed (${res.status})`)
  }
  const data = await res.json()
  return (data as MealDto[]).map(normalizeMealDto)
}

/**
 * POST /api/Meals - create a meal (cooks). Query: cookId; body: CreateMealDto.
 */
export async function createMeal(
  cookId: string,
  body: CreateMealDto,
): Promise<MealDto> {
  const res = await fetch(`${MEALS_PREFIX}?cookId=${encodeURIComponent(cookId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: body.title,
      description: body.description ?? null,
      ingredients: body.ingredients ?? null,
      allergens: body.allergens ?? null,
      type: body.type,
      priceCents: body.priceCents,
      servingsAvailable: body.servingsAvailable,
      pickupLocationText: body.pickupLocationText ?? null,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Create meal failed (${res.status})`)
  }
  const data = await res.json()
  return normalizeMealDto(data)
}

/** Backend returns camelCase in JSON; ensure we have consistent shape. */
function normalizeMealDto(m: Record<string, unknown>): MealDto {
  return {
    mealListingId: String(m.mealListingId ?? m.MealListingId ?? ''),
    title: String(m.title ?? m.Title ?? ''),
    description: m.description ?? m.Description ?? null,
    type: Number(m.type ?? m.Type ?? 0) as MealType,
    priceCents: Number(m.priceCents ?? m.PriceCents ?? 0),
    servingsAvailable: Number(m.servingsAvailable ?? m.ServingsAvailable ?? 0),
    pickupLocationText: m.pickupLocationText ?? m.PickupLocationText ?? null,
    status: Number(m.status ?? m.Status ?? 0) as MealListingStatus,
    cookId: String(m.cookId ?? m.CookId ?? ''),
    cookName: String(m.cookName ?? m.CookName ?? ''),
  }
}
