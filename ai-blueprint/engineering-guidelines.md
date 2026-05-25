# Engineering Guidelines and Constraints

## Product Goal

Build a premium full-stack eCommerce platform that is maintainable by multiple teams and can be safely extended by AI agents. The implementation must favor clear domain boundaries, predictable conventions, and production-minded defaults over clever one-off code.

## Core Stack

- Frontend: React with Vite.
- Backend: Node.js with Express.
- Database: MySQL 8.
- Authentication: JWT bearer tokens.
- Styling: Plain CSS with a premium editorial retail aesthetic. Additional styling libraries are allowed, but the generated code should not depend on a heavy design system unless it creates clear value.

## Architectural Rules

- Keep frontend and backend in separate top-level directories.
- Organize backend code by domain modules: auth, products, cart, orders, users.
- Keep Express route handlers thin. Use validation at the route boundary and DB helpers for persistence.
- Keep frontend state localized where possible. Use React context only for cross-cutting auth and cart state.
- Favor deterministic file names and clear exports over generated abstractions.
- Do not place unrelated domains in a shared catch-all file.

## Naming Conventions

- JavaScript files use camelCase for variables and functions.
- React components use PascalCase.
- SQL columns use snake_case.
- API JSON responses use clear resource names: `{ user }`, `{ products }`, `{ cart }`, `{ orders }`.
- Route paths use plural nouns except auth actions.

## API Standards

- All protected routes require `Authorization: Bearer <token>`.
- All validation failures return HTTP 400 with `{ message, issues }`.
- Auth failures return HTTP 401.
- Resource conflicts return HTTP 409.
- Unexpected errors are logged server-side and return a generic HTTP 500 message.

## Data Standards

- Use UUID primary keys.
- Store password hashes only, never plaintext passwords.
- Use foreign keys for ownership and order composition.
- Persist carts per user.
- Snapshot order item name and price at checkout time to preserve historical order accuracy.

## Frontend UX Standards

- The first screen must be the shopping experience, not a marketing landing page.
- Product cards must include image, category, rating, price, and a clear add-to-cart action.
- Checkout must be multi-step: bag, shipping, confirmation.
- Account area must expose profile management and order history.
- UI must be responsive across mobile and desktop.

## AI Constraints

- Do not silently invent services that are not in the stack.
- Do not hardcode secrets; provide `.env.example`.
- Do not skip seed data. The reviewer must be able to see the product catalog quickly.
- Avoid broad refactors while fixing localized issues.
- Document every manual intervention in `README.md`.

