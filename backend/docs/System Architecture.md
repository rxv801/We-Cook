## **1\) MVP scope for a 2-day hackathon**

### **Must-have (demo works end-to-end)**

* Uni-email login (you can simulate verification if needed)

* Create meal listing (paid or rescue/free)

* Browse feed (filter paid vs rescue)

* Claim/reserve meal

* Complete order (mark picked up)

* Ratings (basic)

* Strike system (manual flag \+ auto block after 2\)

### **Not now**

* Escrow/disputes, real payments, delivery, complex moderation, chat, refunds

---

## **2\) System architecture (simple \+ sensible)**

### **Deployment shape (1 backend \+ 1 database)**

* **ASP.NET Core Web API** (single service)

* **PostgreSQL** (fast \+ simple) using **EF Core**

* Optional: **Redis** for caching feed (skip for hackathon)

### **Code architecture (Clean-ish, but not heavy)**

Use a 3-layer structure:

**API Layer (Controllers)**

* HTTP endpoints, auth, request/response DTOs

**Application Layer (Use cases / Services)**

* “CreateMeal”, “PlaceOrder”, “ClaimRescue”, “FlagOrder”, etc.

**Domain \+ Data Layer**

* Entities \+ invariants \+ EF Core mapping/repositories

This lets you implement logic once in services, not in controllers.

---

## **3\) Domain model: entities (what you store)**

### **User**

Represents both buyer and cook (same account).

* `UserId (Guid)`

* `Email` (must end with `.edu.au` for MVP)

* `DisplayName`

* `University`, `Campus` (strings)

* `AvgRating` (decimal) *(or compute from reviews)*

* `StrikeCount` (int 0..2)

* `IsBannedFromPosting` (bool) *(or derived from StrikeCount\>=2)*

* `CreatedAt`

### **MealListing**

A posted meal.

* `MealId (Guid)`

* `CookId (Guid -> User)`

* `Title`

* `Description`

* `Ingredients` (string or JSON)

* `Allergens` (string or JSON)

* `ImageUrl` (string)

* `Type` (`Marketplace` | `Rescue`)

* `PriceCents` (int) **0 if Rescue**

* `ServingsAvailable` (int)

* `PickupLocationText` (string)

* `PickupLat`, `PickupLng` (decimal) *(optional but useful for proximity)*

* `Status` (`Active` | `SoldOut` | `Removed`)

* `CreatedAt`

### **Order**

One “reservation/claim” of 1 serving (keep it simple).

* `OrderId (Guid)`

* `MealId`

* `BuyerId`

* `CookId` *(denormalize for convenience)*

* `Quantity` (int, for MVP force \= 1\)

* `MealPriceCents` (int)

* `BuyerFeeCents` (int) *(5% of meal price, 0 if rescue)*

* `MakerFeeCents` (int) *(5% of meal price, 0 if rescue)*

* `TotalPaidCents` (int) *(meal \+ buyer fee, 0 if rescue)*

* `Status` (`PendingPickup` | `Completed` | `Cancelled` | `Flagged`)

* `CreatedAt`, `CompletedAt`

### **Review**

Rating after completion (1–5 stars).

* `ReviewId`

* `OrderId`

* `CookId`

* `BuyerId`

* `Stars` (1..5)

* `Comment` (optional)

* `CreatedAt`

### **StrikeEvent (audit trail)**

So strikes aren’t “mystery increments”.

* `StrikeEventId`

* `CookId`

* `OrderId`

* `Reason` (string)

* `CreatedAt`

---

## **4\) Invariants (rules that must always be true)**

These are what you enforce in the Application layer (and some via DB constraints).

### **User invariants**

* `Email` must end with `.edu.au` (MVP)

* `StrikeCount` in `[0..2]`

* If `StrikeCount >= 2`, user **cannot create listings**

### **MealListing invariants**

* If `Type == Rescue` → `PriceCents == 0`

* If `Type == Marketplace` → `PriceCents > 0`

* `ServingsAvailable >= 0`

* If `ServingsAvailable == 0` → `Status = SoldOut`

* Only cook can edit/remove their listing

### **Order invariants**

* An order can only be created if:

  * Meal exists and `Status == Active`

  * `ServingsAvailable >= Quantity`

* Claiming reduces servings **atomically** (transaction)

* Rescue orders have:

  * `TotalPaidCents == 0`, fees \== 0

* Marketplace orders have:

  * `BuyerFeeCents = round(PriceCents * 0.05)`

  * `MakerFeeCents = round(PriceCents * 0.05)`

  * `TotalPaidCents = PriceCents + BuyerFeeCents`

* Only buyer or cook can mark completion (pick one for MVP: buyer confirms pickup)

* Review allowed only when `Status == Completed`

* One review per order

### **Strike invariants**

* Strike can only be issued for an order tied to that cook

* On strike: increment cook’s StrikeCount up to max 2

* If StrikeCount reaches 2 → block posting immediately

---

## **5\) Use cases (what you implement)**

Think “verbs”. Each becomes an endpoint \+ a service method.

### **Auth / User**

1. **Register/Login**

   * Input: email, name, uni, campus

   * Output: JWT token \+ user profile

   * MVP: skip real email verification; just validate domain

2. **Get My Profile**

3. **Update My Profile** (name, campus)

### **Meals (Listings)**

4. **Create Meal Listing**

   * Guard: cook not banned from posting

   * Enforce: rescue \=\> price 0

5. **Get Feed**

   * Query: `type=Marketplace|Rescue`, `lat,lng`, `limit`, `cursor`

   * Sorting: simple MVP sort by `CreatedAt desc`; optional: weighted ranking later

6. **Get Meal Details**

7. **Update Meal Listing** (cook only)

8. **Remove Meal Listing** (cook only)

### **Orders**

9. **Place Order (Marketplace)**

   * Decrement servings transactionally

   * Calculate fees

10. **Claim Rescue**

* Same as order but price=0, instant reserve

11. **Get My Orders** (buyer)

12. **Get Orders For My Meals** (cook)

13. **Complete Order** (buyer confirms pickup)

14. **Cancel Order** (optional MVP; only if pending)

### **Trust / Moderation**

15. **Flag Order (health/safety)**

* Admin-only or “hackathon moderator” secret key

* Creates StrikeEvent, increments strike

### **Ratings**

16. **Leave Review**

17. **Get Cook Rating Summary** (or compute on the fly)

That’s enough for a full demo.

---

## **6\) API surface (concrete endpoints)**

Here’s a clean REST layout:

### **Auth**

* `POST /auth/login` (or `/auth/register`)

* `GET /users/me`

* `PUT /users/me`

### **Meals**

* `POST /meals`

* `GET /meals?type=Rescue&lat=-37.81&lng=144.96&limit=20&cursor=...`

* `GET /meals/{mealId}`

* `PUT /meals/{mealId}`

* `DELETE /meals/{mealId}`

### **Orders**

* `POST /orders` (marketplace) `{ mealId, quantity }`

* `POST /orders/rescue-claim` `{ mealId }`

* `GET /orders/mine`

* `GET /orders/for-my-meals`

* `POST /orders/{orderId}/complete`

* `POST /orders/{orderId}/cancel` (optional)

### **Moderation**

* `POST /orders/{orderId}/flag` `{ reason }`

### **Reviews**

* `POST /orders/{orderId}/review` `{ stars, comment }`

---

## **7\) Data consistency (the one tricky part)**

**The only “hard” bug in these apps is overselling servings.**  
 Fix it with:

* A DB transaction

* `SELECT ... FOR UPDATE` semantics via EF Core concurrency or raw SQL

* Or an optimistic concurrency token (`RowVersion`) on `MealListing`

**MVP approach (easy):**

* Add `byte[] RowVersion` to `MealListing` with `[Timestamp]`

* When decrementing servings, handle `DbUpdateConcurrencyException` and return “Sold out, try another listing”.

---

## **8\) Fee calculation (simple and deterministic)**

Use integer cents to avoid floating errors.

* `buyerFeeCents = (mealPriceCents * 5 + 50) / 100` (rounded)

* `makerFeeCents = (mealPriceCents * 5 + 50) / 100`

* `totalPaidCents = mealPriceCents + buyerFeeCents`

* rescue: all 0

Store the computed values on the Order so your demo is consistent.

---

## **9\) Minimal ranking engine (don’t overbuild)**

For 2 days:

* Sort by `CreatedAt DESC`

* Filter by distance radius if you store lat/lng (optional)

If you want the weighted score later:

* Compute score in query results (not stored)

* Start with only proximity \+ recency; add rating last

---

## **10\) What to implement first (build order)**

1. Auth \+ Users (`.edu.au` guard)

2. Meals create \+ list \+ details

3. Orders place/claim with **transactional decrement**

4. Complete order

5. Review \+ cook rating update (can compute avg nightly… but MVP just recompute on insert)

6. Flag/strike system \+ block posting

That yields a complete vertical slice.

