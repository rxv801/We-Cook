"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Clock, MapPin, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Listing = {
  id: string
  seller_id: string
  title: string
  description: string | null
  category: string
  price: number
  is_free: boolean
  is_rescue: boolean
  quantity: number
  pickup_hub: string
  pickup_time: string
  image_url: string | null
  ai_tags: string[]
  status: "active" | "reserved" | "completed" | "expired"
  created_at: string
}

const demoListings: Listing[] = [
  {
    id: "demo-1",
    seller_id: "demo-user",
    title: "Free Veggie Curry Bowl",
    description: "Freshly cooked, pickup tonight",
    category: "Meal",
    price: 0,
    is_free: true,
    is_rescue: true,
    quantity: 2,
    pickup_hub: "Library",
    pickup_time: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    image_url: null,
    ai_tags: ["Vegetarian", "Best Eaten Tonight"],
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    seller_id: "demo-user",
    title: "Homemade Pasta",
    description: "Creamy pasta, one serving left",
    category: "Meal",
    price: 4.5,
    is_free: false,
    is_rescue: false,
    quantity: 1,
    pickup_hub: "Student Union",
    pickup_time: new Date(Date.now() + 1000 * 60 * 180).toISOString(),
    image_url: null,
    ai_tags: ["Contains Dairy"],
    status: "active",
    created_at: new Date().toISOString(),
  },
]

function timeLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return "Ending soon"

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) return `${hours}h ${mins}m left`
  return `${mins}m left`
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadListings() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        setMessage(error.message)
        setListings(demoListings)
        setLoading(false)
        return
      }

      if (!data || data.length === 0) {
        setListings(demoListings)
      } else {
        setListings(data as Listing[])
      }

      setLoading(false)
    }

    loadListings()
  }, [])

  async function requestPickup(listingId: string) {
    try {
      if (!user) throw new Error("Please sign in first.")

      const { error } = await supabase.from("orders").insert({
        listing_id: listingId,
        buyer_id: user.id,
        status: "requested",
      })

      if (error) throw error

      setMessage("Pickup requested.")
    } catch (err: any) {
      setMessage(err.message ?? "Request failed.")
    }
  }

  const rescueListings = useMemo(
    () => listings.filter((listing) => listing.is_rescue),
    [listings]
  )

  const normalListings = useMemo(
    () => listings.filter((listing) => !listing.is_rescue),
    [listings]
  )

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">
            Rescue affordable meals, groceries, and surplus food.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/create">
            <Button>Create Listing</Button>
          </Link>
          <Link href="/auth">
            <Button variant="outline">{user ? "Account" : "Sign In"}</Button>
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border px-4 py-3 text-sm text-muted-foreground">
          {message}
        </div>
      )}

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Rescue Mode</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rescueListings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden border-orange-400/40 bg-orange-50/40 shadow-lg"
            >
              <div className="aspect-video bg-muted">
                {listing.image_url ? (
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
                    RESCUE
                  </span>
                  {listing.is_free && (
                    <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                      FREE
                    </span>
                  )}
                </div>

                <h3 className="mb-1 text-lg font-semibold">{listing.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {listing.description}
                </p>

                <div className="mb-3 flex flex-wrap gap-2">
                  {listing.ai_tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.pickup_hub}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{timeLeft(listing.pickup_time)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {listing.is_free ? "FREE" : `$${listing.price}`}
                  </div>
                  <Button onClick={() => requestPickup(listing.id)}>
                    Rescue this meal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">All Listings</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {normalListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    {listing.is_free && (
                      <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="mb-1 text-lg font-semibold">{listing.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {listing.description}
                  </p>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {listing.ai_tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.pickup_hub}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{timeLeft(listing.pickup_time)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      {listing.is_free ? "FREE" : `$${listing.price}`}
                    </div>
                    <Button onClick={() => requestPickup(listing.id)}>
                      Request pickup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}