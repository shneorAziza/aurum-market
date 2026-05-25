# Bootstrap Prompt

You are an autonomous senior full-stack engineer building a production-grade eCommerce platform from this repository.

## Objective

Generate a complete, working, premium eCommerce application using:

- React.js frontend.
- Node.js Express backend.
- MySQL database.
- JWT authentication.

The result must be maintainable by several teams and must follow the engineering guidelines in `ai-blueprint/engineering-guidelines.md` and the capability definitions in `ai-blueprint/capabilities.md`.

## Required Product Features

Build these features end-to-end:

1. Authentication
   - Register.
   - Login.
   - Persist authenticated session client-side using JWT.
   - Protect cart, checkout, account, and order routes.

2. Product Catalog
   - Product listing with premium imagery.
   - Search by text.
   - Filter by category.
   - Sort by featured, rating, low price, high price.
   - Product detail view.

3. Cart and Checkout
   - Authenticated persistent cart.
   - Add items.
   - Update quantities.
   - Multi-step checkout: bag, shipping, confirmation.
   - Create orders from cart and clear cart after success.

4. Account Section
   - Profile management.
   - Order history.

## Architecture to Generate

Use this repository structure:

```text
backend/
  src/
    config/
    db/
    middleware/
    modules/
      auth/
      products/
      cart/
      orders/
      users/
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
ai-blueprint/
```

## Backend Requirements

- Express app with security middleware.
- MySQL connection pool.
- SQL schema for users, products, carts, cart_items, orders, order_items.
- Seed script with demo user and premium products.
- Zod validation at API boundaries.
- Centralized error handler.
- `.env.example`.

## Frontend Requirements

- React app using Vite.
- Premium visual style suitable for a curated luxury marketplace.
- Product catalog as first screen.
- Auth, cart, checkout, and account flows.
- Responsive layout.
- API client that attaches JWT automatically.

## Output Requirements

- Implement the code.
- Keep code concise and readable.
- Do not introduce nonessential services.
- Document manual fixes in README.
- Document prompts, planning, tools, and models in `ai-blueprint/ai-interactions.md`.

## Acceptance Criteria

- A reviewer can run MySQL, seed data, start backend and frontend, and browse the app.
- Demo credentials are documented.
- Protected actions require login.
- The UI looks polished on desktop and mobile.
- The AI blueprint explains how the project was generated and constrained.

