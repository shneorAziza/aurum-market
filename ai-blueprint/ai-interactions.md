# AI Interactions Documentation

This document records how I used AI as an engineering force multiplier during the assignment. The goal was not to ask for a generic eCommerce app, but to lead the AI through a structured engineering process: interpreting the requirements, defining the project engine, generating code against that engine, reviewing the result, and applying targeted manual corrections where that was faster and safer than additional prompting.

## Models Used

- GPT-5 Codex in the Codex desktop environment.
  - Used for repository creation, implementation, code review, debugging, and local verification.
  - Chosen because it can inspect the actual workspace, edit files directly, run builds, and validate the application through local tooling.
- GPT-5 Codex inside the IDE workflow.
  - Used as an interactive pair-programming assistant while reviewing the generated code and making focused edits.
  - Chosen for quick iteration inside the code editor when refining UI details and small implementation issues.

No Google searches were used during this implementation. I relied on known patterns for React, Vite, Express, MySQL, JWT, bcrypt, CORS, and Docker because the scope was standard enough and the time-box favored execution over research.

## Tools and Plugins Used

- Codex shell tool: inspected the workspace, checked generated files, installed dependencies, ran builds, started services, and verified Docker/MySQL status.
- Codex apply_patch tool: created and edited project files in small reviewable changes.
- Docker Compose: ran the local MySQL service.
- npm/Vite: installed dependencies and validated the frontend production build.
- VS Code/Codex IDE workflow: used for hands-on review and small manual corrections.
- Cline/OpenRouter: provided as assignment context. I did not rely on it for the final local execution because Codex already provided direct file editing, command execution, and browser validation in this environment.

## Planning and Prompt Log

### Step 1: Requirements Breakdown

I first converted the assignment into a concrete delivery checklist:

- Build a working eCommerce platform.
- Build the AI orchestration layer used to generate it.
- Document where AI needed human correction.
- Keep the repository easy for reviewers to run.
- Make the UI look premium enough to satisfy the design criterion.

Key decision:

- I treated the "AI Blueprint" as a first-class deliverable rather than documentation written after the fact. This shaped the repository structure from the beginning.

### Step 2: Repository and Blueprint Plan

Before generating the app, I defined the repository structure:

```text
ai-blueprint/
backend/
frontend/
README.md
docker-compose.yml
```

The AI was guided to create:

- `initial.md` as the bootstrap prompt.
- `engineering-guidelines.md` as the rules and constraints.
- `capabilities.md` as the reusable functional domains.
- `ai-interactions.md` as the audit trail.

### Step 3: Backend Generation

I directed the AI to build the backend around maintainable domain modules:

- `auth`
- `products`
- `cart`
- `orders`
- `users`

The generated backend includes:

- Express app setup.
- MySQL connection pool.
- JWT auth middleware.
- Zod validation.
- Centralized error handling.
- SQL schema and seed script.
- Checkout transaction that snapshots order item names and prices.

Manual review focus:

- I checked that protected routes were scoped by authenticated user id.
- I verified that passwords were hashed and never returned.
- I verified that order creation used a transaction instead of loose writes.

### Step 4: Frontend Generation

I directed the AI to generate a React/Vite frontend with the shopping experience as the first screen.

The frontend includes:

- Premium catalog screen.
- Search, category filter, and sorting.
- Product detail modal.
- Login and sign-up flow.
- Persistent cart state.
- Multi-step checkout.
- Account profile and order history.

Manual review focus:

- I reviewed whether the UI met the "premium" requirement, not just whether it functioned.
- I refined spacing, card structure, filter controls, and product copy.
- I adjusted the product cards so the price and add-to-cart actions stay aligned at the bottom regardless of description length.

### Step 5: Manual Local Verification

I did not assume the generated code worked. I manually validated the core user flows locally:

- Installed root, backend, and frontend dependencies.
- Ran the frontend production build.
- Started MySQL with Docker Compose.
- Seeded demo data.
- Started backend and frontend dev servers.
- Created users manually through the UI.
- Logged in as a user.
- Updated profile details.
- Added products to the cart.
- Created orders through checkout.
- Created additional orders to validate repeated checkout behavior.
- Checked order history in the account area.
- Tested with different users to verify that account, cart, and order data did not leak between users.

Verified flows:

- Product catalog loads from the API.
- Demo login works.
- Add to cart works.
- Checkout creates an order.
- Account/order history is reachable.

### Step 6: AI Gap and Manual Corrections

These were the main cases where I chose direct manual intervention instead of continuing to prompt the AI:

- Added an explicit Vite React plugin configuration after browser testing exposed a runtime JSX transform issue.
- Changed Docker/MySQL local mapping from `3306` to `3307` to avoid collisions with an existing MySQL installation.
- Expanded local CORS handling to support both `localhost:5173` and `127.0.0.1:5173`.
- Refined the filter toolbar so the full category/sort controls are clickable and the dropdown options have better spacing.
- Aligned product card footers so price and add-to-cart buttons remain fixed at the bottom.
- Improved product wording to make product descriptions clearer and more natural.
- Manually corrected the customer/shipping name used in the checkout demo data so the order flow looked intentional during review.

I considered these localized product-quality issues. Fixing them directly was faster and more reliable than repeatedly asking the AI.

## Architecture Decisions

- JavaScript was used instead of TypeScript to reduce setup friction inside the assignment time-box while still keeping the architecture modular and readable. For a production follow-up, I would migrate this to TypeScript.
- MySQL schema is included as plain SQL because it is transparent for reviewers and easy to initialize through Docker.
- JWT auth was selected because it is simple to run locally and easy to validate through frontend API calls.
- Backend modules are organized by business domain so future teams can own auth, catalog, cart, orders, and account work independently.
- React context is used only for auth and cart because those are the cross-cutting client concerns. I avoided adding Redux or another global state library because the scope did not justify it.
- The UI uses custom CSS rather than a large styling framework so the visual result is deliberate, fast to inspect, and easy to adjust during the time-box.

## Prompting Strategy

My prompting strategy was to move from high-level constraints to concrete implementation:

- Start with the assignment goals and evaluation criteria.
- Convert them into a repository structure and AI blueprint.
- Generate the backend and frontend around domain boundaries.
- Validate locally.
- Use targeted follow-up prompts only for specific issues, especially UI polish and reviewer experience.

This process made the generation more "zero-touch" at the architecture level, while still allowing human judgment where small manual edits produced a better result than broad prompt tuning.
