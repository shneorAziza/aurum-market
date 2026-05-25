# Capability Definitions

These capabilities describe the functional building blocks the AI agent may use while generating or extending the commerce application.

## Authentication Capability

Responsible for registration, login, current-user lookup, JWT signing, password hashing, and protected-route middleware.

Required behaviors:

- Hash passwords with bcrypt before storage.
- Return signed JWTs after registration and login.
- Expose a reusable middleware that rejects missing or invalid tokens.
- Never expose `password_hash` in API responses.

## Product Catalog Capability

Responsible for public product browsing.

Required behaviors:

- Return product lists with search, category filter, and sort.
- Return distinct categories for filter UI.
- Return detailed product data by slug.
- Preserve visually useful product fields: image, description, price, category, rating, inventory.

## Cart Capability

Responsible for authenticated persistent cart behavior.

Required behaviors:

- Create a cart automatically for authenticated users.
- Add products by product id and quantity.
- Increment quantity if the item already exists.
- Update or remove line items.
- Return computed cart total.

## Checkout and Orders Capability

Responsible for transforming cart state into an order.

Required behaviors:

- Validate shipping data before checkout.
- Use a database transaction during checkout.
- Snapshot item name and price into order items.
- Clear cart after successful checkout.
- Return order id and total.

## Account Capability

Responsible for user-owned profile and order history.

Required behaviors:

- Allow profile updates for name and phone.
- Return authenticated user's order history.
- Scope all reads and writes by authenticated user id.

## UI Composition Capability

Responsible for the premium frontend experience.

Required behaviors:

- Use a sticky header with catalog, cart, auth, and account actions.
- Use a visual product grid and product detail modal.
- Use a cart summary with quantity controls.
- Use a multi-step checkout panel.
- Use icons only where they improve recognition.

## Documentation Capability

Responsible for making AI work auditable.

Required behaviors:

- Keep `initial.md` as the bootstrap prompt.
- Keep guideline files versioned in `ai-blueprint`.
- Document prompts, tools, models, and manual fixes.
- Explain any AI failures honestly and briefly.

