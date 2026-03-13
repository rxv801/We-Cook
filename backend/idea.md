# Project Home Cooked (UNIHACK 2026)

## 1. The Idea: Revolutionizing Campus Dining

**Home Cooked** is a peer-to-peer marketplace designed to bridge the gap between hungry students and the abundance of "extra" food and cooking talent hidden in university dorms and apartments.

### The Problem
* **Financial Strain:** Students are hit hard by the cost-of-living crisis. Traditional delivery apps (UberEats/DoorDash) are overpriced luxury services, not daily solutions.
* **Health & Culture:** Fast food is often the only "affordable" option, leading to poor nutrition and a lack of authentic, "home-style" meals for international students.
* **Waste:** Massive amounts of groceries and cooked portions go to waste every day because students cook more than they can eat.

### The Solution
Home Cooked provides a platform where students can list extra portions of their meals for a small price or offer them for free via the **"Food Rescue"** tab. It turns every student kitchen into a micro-node of a campus-wide food network.

### Scalability: The "Infinite Kitchen"
While we launch at the university level to leverage high-trust student networks (.edu.au verification), the model is infinitely scalable. It can expand to high-density apartment complexes, corporate offices, and local suburbs, eventually becoming a global standard for sustainable, neighborhood-driven eating.

---

## 2. Business Model: The "5+5" Community Logic

Taking inspiration from **Airbnb**, Home Cooked does not own the inventory. We provide the **Trust Infrastructure** (Verification, Escrow Payments, and Dispute Resolution) and charge a small service fee to keep the platform running.

### The 10% Revenue Split
To maintain the most competitive pricing in the market, we implement a flat 10% total commission:
* **5% Service Fee (Customer):** A small "convenience fee" added to the meal cost.
* **5% Transaction Fee (Maker):** A small deduction from the cook's payout to cover identity verification and platform maintenance.



### Why This Works
1. **The Airbnb Strategy:** We don't charge "rent" for the platform; we only make money when the students make money.
2. **Value Proposition:** Traditional apps take 30%. By taking only 5% from the maker, we allow students to keep their prices low while still earning a meaningful side income.
3. **Safety as a Service:** The fees directly fund the **Trust Engine**—allowing us to verify student IDs, implement the "Strike System," and provide a point of contact if a meal doesn't meet quality standards.
4. **Zero-Fee Rescue:** The "Food Rescue" section remains **0% commission** to ensure our mission of zero food waste is never hindered by costs.

---

## 4. Frontend Specifications (The "Dining Room")

### Tech Stack
* **Framework:** [React Native / Flutter] - *To be confirmed by the Frontend team.*
* **UI Library:** [e.g., NativeBase or Material UI] - For rapid component building.

### Core Screens & Logic
1. **Login Screen (Unified)**
    * Single login for both Customers and Cooks.
    * Requirement: Valid `.edu.au` university email only.
    * Feature: Quick onboarding (Name, Uni, Campus).

2. **The Feed (Marketplace & Rescue)**
    * Visual-first list of available meals.
    * Metadata: Dish name, Price, Distance (meters/km), and Cook rating.
    * **The Toggle:** A prominent switch at the top to filter between "Paid Marketplace" and "Free Food Rescue."

3. **Purchase/Detail Screen**
    * High-res image and full description.
    * Ingredients & Allergen list (Safety requirement).
    * Clear Price Breakdown: Meal Price + 5% Service Fee.
    * Pickup Location: Integrated map pin or text address.

4. **Merchant/Post Screen**
    * Simple form: Upload Photo -> Title -> Set Price -> Servings Available.
    * "List as Rescue" Toggle: Automatically sets price to $0 and moves item to the Rescue tab.

### Visual Identity (not confirmed)
* **Primary Color:** Hunger-stimulating Orange (#FF8C00) or Warm Yellow.
* **Background:** Clean White/Light Grey to ensure food photography is the focus.
* **Typography:** Sans-serif (Bold for titles, regular for ingredients).

---

## 5. Backend Specifications (The "Kitchen")

### Tech Stack
* **Server/Database:** [Firebase / Supabase / Node.js] - *Manit to confirm.*
* **Auth:** University Email Verification (.edu.au) via Firebase Auth.

### Database Schema (What we store)
* **Users Table:** ID, Email, Name, Bio, Average Rating, Strike Count (0-2).
* **Meals Table:** ID, CookID, Title, Description, ImageURL, Price, Type (Marketplace/Rescue), Servings.
* **Orders Table:** ID, BuyerID, CookID, Total Price, Fee Amount, Status (Pending/Completed).

### Essential Logic (The Rules)
1. **The Strike System:** If an order is flagged for health/safety, increment `Strike Count`. If Count = 2, block `postMeal` access.
2. **Fee Calculation:** Automatically apply a 5% surcharge to the buyer and deduct 5% from the seller's payout.
3. **Rescue Filter:** If `Price == 0`, bypass payment logic and trigger "Instant Claim."

---

## 6. Data Science & Logic (The "Brain")

### Core Logic: The Ranking Engine
* **The "Fresh & Local" Algorithm:** Meals are sorted based on a weighted score:
    * **40% Proximity:** Distance from the user’s current campus location.
    * **30% Recency:** Time since the meal was posted.
    * **30% Reputation:** The cook's average star rating.

### Impact Tracking (Pitch Data)
* **Waste Prevention Tracker:** Every "Rescue" transaction adds to a global 'Kilograms Saved' counter.
* **Economic Impact:** Track total savings for students compared to average retail food prices ($15 vs $7 Home Cooked).

### Trust Analytics
* **Sentiment Filter:** Basic keyword detection in reviews (e.g., "raw," "cold," "sick") to auto-flag potential health strikes for the Admin to review.

---

## 7. The Pitch Strategy: "The Fire Script"
```

```

```
