# Comprehensive UniEats Backend Execution Guide (Logic & Architecture Plan)

**Event:** UNIHACK 2026
**Architecture:** 3-Layer Clean Architecture (ASP.NET Core + PostgreSQL)



[Image of Clean Architecture in .NET Core]


This document outlines the exact step-by-step workflow to build the backend without detailing the specific C# syntax. Use this as your master checklist to prompt your agentic AI or guide your own coding.

---

## Phase 1: Environment & Project Scaffolding
**Goal:** Create the blank canvas, establish the folder structure, and connect the required tools.

### Action Steps:
1. **Initialize the Solution:** Create a master `.sln` file named `UniEats`.
2. **Create the Layers:** Generate three separate projects inside a `src/` directory:
   * `UniEats.Api` (Web API project - The "Front Door")
   * `UniEats.Application` (Class Library - The "Brain")
   * `UniEats.Domain` (Class Library - The "Blueprints")
3. **Link Dependencies:** * Configure `Api` to reference `Application`.
   * Configure `Application` to reference `Domain`.
4. **Install Database Packages:** Add Entity Framework Core and the Npgsql (PostgreSQL) provider to your `Domain` and `Api` projects.

**Expectation:** You have a compiling, empty 3-tier architecture. The foundational structure is ready so that your AI models or frontend developers know exactly where to look for endpoints.

---

## Phase 2: Domain Layer (Database Blueprints & Invariants)
**Goal:** Define the exact shape of your data and the unbreakable rules of your platform. 

### Action Steps:
1. **Create the User Entity:** * Define fields for `UserId`, `Email`, `DisplayName`, `StrikeCount`, and `IsBannedFromPosting`.
   * Add a validation rule: The email string must end in `.edu.au`.
2. **Create the MealListing Entity:** * Define fields for `CookId`, `Title`, `Type` (Marketplace vs Rescue), `PriceCents`, and `ServingsAvailable`.
   * **Crucial:** Add a `RowVersion` field configured as a concurrency token. This is what prevents two students from buying the last serving.
3. **Create the Order & Review Entities:** * Define fields to track `BuyerId`, `TotalPaidCents`, and status.
4. **Establish the DbContext:** * Create the central database configuration file (`UniEatsDbContext`) that maps these C# entities into PostgreSQL tables.

**Expectation:** Your application knows what a "Meal" and a "User" are, and it knows the fundamental rules (like Rescue meals costing $0).

---

## Phase 3: Database Migrations (Building the Tables)
**Goal:** Push your C# blueprints into the actual PostgreSQL database.



### Action Steps:
1. **Configure the Connection:** Add your PostgreSQL connection string to the API project's configuration settings.
2. **Generate Initial Migration:** Use the EF Core CLI tools to create a migration file based on your DbContext.
3. **Update Database:** Execute the migration command to push the schema to PostgreSQL.

**Expectation:** Opening pgAdmin or your database viewer will reveal perfectly structured, empty tables ready to store application data.

---

## Phase 4: Application Layer (Core Business Logic)
**Goal:** Write the "Services" that execute the actions of the platform.

### Action Steps:
1. **Build the AuthService:** * Implement the `.edu.au` verification logic to restrict access solely to university students.
2. **Build the MealService:** * Create logic for listing meals.
   * Implement a sorting mechanism to return newest meals first (`CreatedAt DESC`). As an AI student, you can easily swap this out later for your "Fresh & Local" weighted algorithm, but keep it simple for the MVP.
3. **Build the OrderService (The Transaction Engine):**
   * Open a database transaction.
   * Verify `ServingsAvailable` is greater than 0.
   * Calculate the fees using integer math to avoid rounding errors: `(price * 5 + 50) / 100`.
   * Deduct 1 from `ServingsAvailable`.
   * Save the changes. If a concurrency conflict occurs (someone else bought it a millisecond earlier), catch the error, roll back the transaction, and return a "Sold Out" message.
4. **Build the ModerationService:** * Create logic to flag an order. 
   * Increment the cook's `StrikeCount`. If it reaches 2, toggle `IsBannedFromPosting` to true.

**Expectation:** The rules of Home Cooked are fully operational in isolation. The math is perfect, and overselling is mathematically impossible.

---

## Phase 5: API Layer (Exposing the Endpoints)
**Goal:** Create the HTTP doorways so the mobile app can trigger your Application Services.

### Action Steps:
1. **Dependency Injection:** Register all your new Services and the DbContext in the application's startup configuration.
2. **Create AuthController:** Expose an endpoint for logging in and generating a session token.
3. **Create MealsController:** * Expose a `GET` endpoint to retrieve the feed.
   * Expose a `POST` endpoint to create a new meal listing.
4. **Create OrdersController:** Expose endpoints for purchasing a marketplace meal and claiming a rescue meal.
5. **Create ModerationController:** Expose an endpoint to trigger a health/safety strike.
6. **Enable Swagger:** Turn on the automated API documentation tool.

**Expectation:** The backend can now receive web requests and route them to your logic layer.

---

## Phase 6: Hackathon Demo Preparation
**Goal:** Ensure the app looks alive the second the frontend team connects.

### Action Steps:
1. **Launch Swagger UI:** Run the backend server and open the Swagger web interface.
2. **Seed the Database:** Manually input 10-15 highly realistic "dummy" meals. Use familiar context—pin these test meals around the Deakin Burwood campus or nearby student accommodations so the map feature immediately looks populated and relevant during the pitch.
3. **Lock the Scope:** Resist the urge to add features like chat or escrow until this exact checklist is 100% verified and tested.

**Expectation:** You are completely ready for UNIHACK 2026. Your frontend dev has a live, documented API to connect to, and your presentation demo is populated with rich test data.
