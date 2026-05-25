import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

const products = [
  {
    name: "Aurum Weekender",
    slug: "aurum-weekender",
    category: "Travel",
    price: 248,
    rating: 4.9,
    inventory: 18,
    featured: true,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    description: "Full-grain leather weekender with a structured silhouette, brass hardware, and a laptop sleeve."
  },
  {
    name: "Noir Ceramic Pour-Over",
    slug: "noir-ceramic-pour-over",
    category: "Home",
    price: 86,
    rating: 4.8,
    inventory: 42,
    featured: true,
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    description: "Hand-glazed ceramic pour-over coffee dripper engineered for thermal stability and a slow, elegant morning ritual."
  },
  {
    name: "Lumen Desk Lamp",
    slug: "lumen-desk-lamp",
    category: "Workspace",
    price: 172,
    rating: 4.7,
    inventory: 25,
    featured: true,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    description: "A dimmable aluminum task lamp with warm-to-cool tuning and an understated architectural profile."
  },
  {
    name: "Alpine Merino Throw",
    slug: "alpine-merino-throw",
    category: "Home",
    price: 134,
    rating: 4.8,
    inventory: 30,
    featured: false,
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
    description: "Soft merino throw woven in a compact herringbone pattern for quiet luxury in the living room."
  },
  {
    name: "Atlas Carry-On",
    slug: "atlas-carry-on",
    category: "Travel",
    price: 295,
    rating: 4.6,
    inventory: 12,
    featured: false,
    image_url: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80",
    description: "A resilient polycarbonate carry-on with whisper wheels, compression panels, and modular organizers."
  },
  {
    name: "Cove Noise-Canceling Headphones",
    slug: "cove-noise-canceling-headphones",
    category: "Tech",
    price: 219,
    rating: 4.9,
    inventory: 20,
    featured: true,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    description: "Premium wireless headphones with adaptive noise cancellation, plush earcups, and 38-hour battery life."
  }
];

async function seed() {
  const passwordHash = await bcrypt.hash("Password123!", 12);
  await pool.execute(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    ["Demo Customer", "demo@commerce.dev", passwordHash]
  );

  for (const product of products) {
    await pool.execute(
      `INSERT INTO products
       (name, slug, category, price, rating, inventory, featured, image_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       name = VALUES(name), category = VALUES(category), price = VALUES(price), rating = VALUES(rating),
       inventory = VALUES(inventory), featured = VALUES(featured), image_url = VALUES(image_url),
       description = VALUES(description)`,
      [
        product.name,
        product.slug,
        product.category,
        product.price,
        product.rating,
        product.inventory,
        product.featured,
        product.image_url,
        product.description
      ]
    );
  }

  await pool.end();
  console.log("Seed complete. Demo login: demo@commerce.dev / Password123!");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
