"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Leaf } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function generateTags(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase()
  const tags = []

  if (text.includes("veg")) tags.push("Vegetarian")
  if (text.includes("cheese") || text.includes("milk")) tags.push("Contains Dairy")
  if (text.includes("spicy") || text.includes("chili")) tags.push("Spicy")
  tags.push("Best Eaten Tonight")

  return tags.slice(0, 4)
}

export default function CreatePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Meal")
  const [price, setPrice] = useState("0")
  const [quantity, setQuantity] = useState("1")
  const [pickupHub, setPickupHub] = useState("Library")
  const [pickupTime, setPickupTime] = useState("")
  const [isFree, setIsFree] = useState(false)
  const [isRescue, setIsRescue] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  async function handleCreateListing(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    try {
      if (!user) throw new Error("Please sign in first.")

      let imageUrl: string | null = null

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      const aiTags = generateTags(title, description)

      const { error } = await supabase.from("listings").insert({
        seller_id: user.id,
        title,
        description,
        category,
        price: isFree ? 0 : Number(price),
        is_free: isFree,
        is_rescue: isRescue,
        quantity: Number(quantity),
        pickup_hub: pickupHub,
        pickup_time: pickupTime,
        image_url: imageUrl,
        ai_tags: aiTags,
        status: "active",
      })

      if (error) throw error

      router.push("/marketplace")
    } catch (err: any) {
      setMessage(err.message ?? "Failed to create listing.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Please sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              You need an account before creating a listing.
            </p>
            <Link href="/auth">
              <Button>Go to Auth</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-6 w-6" />
          </div>
          <CardTitle>Create a Listing</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreateListing} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Spicy veggie pasta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Freshly made, best eaten tonight"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Meal</option>
                  <option>Groceries</option>
                  <option>Snacks</option>
                  <option>Dessert</option>
                  <option>Drinks</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isFree}
                  required={!isFree}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupHub">Pickup Hub</Label>
                <select
                  id="pickupHub"
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                >
                  <option>Library</option>
                  <option>Student Union</option>
                  <option>West Dorm</option>
                  <option>Community Fridge</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input
                id="pickupTime"
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Photo</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                />
                <span>Free item</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isRescue}
                  onChange={(e) => setIsRescue(e.target.checked)}
                />
                <span>Rescue mode</span>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating listing..." : "Create Listing"}
            </Button>

            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}