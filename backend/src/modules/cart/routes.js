import { Router } from "express";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";

const router = Router();
router.use(requireAuth);

const itemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99)
  })
});

const updateItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(0).max(99)
  })
});

async function getOrCreateCart(userId) {
  const [cart] = await query("SELECT * FROM carts WHERE user_id = :userId", { userId });
  if (cart) return cart;

  await query("INSERT INTO carts (user_id) VALUES (:userId)", { userId });
  const [created] = await query("SELECT * FROM carts WHERE user_id = :userId", { userId });
  return created;
}

async function getCartResponse(userId) {
  const cart = await getOrCreateCart(userId);
  const items = await query(
    `SELECT ci.product_id AS productId, ci.quantity, p.name, p.slug, p.price, p.image_url AS imageUrl, p.inventory
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = :cartId
     ORDER BY p.name ASC`,
    { cartId: cart.id }
  );
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  return { id: cart.id, items, total };
}

router.get("/", async (req, res, next) => {
  try {
    return res.json({ cart: await getCartResponse(req.user.id) });
  } catch (error) {
    return next(error);
  }
});

router.post("/items", validate(itemSchema), async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const { productId, quantity } = req.validated.body;

    await query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (:cartId, :productId, :quantity)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      { cartId: cart.id, productId, quantity }
    );

    return res.status(201).json({ cart: await getCartResponse(req.user.id) });
  } catch (error) {
    return next(error);
  }
});

router.patch("/items/:productId", validate(updateItemSchema), async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const quantity = Number(req.body.quantity);

    if (quantity < 1) {
      await query("DELETE FROM cart_items WHERE cart_id = :cartId AND product_id = :productId", {
        cartId: cart.id,
        productId: req.params.productId
      });
    } else {
      await query(
        "UPDATE cart_items SET quantity = :quantity WHERE cart_id = :cartId AND product_id = :productId",
        { cartId: cart.id, productId: req.params.productId, quantity }
      );
    }

    return res.json({ cart: await getCartResponse(req.user.id) });
  } catch (error) {
    return next(error);
  }
});

router.delete("/items/:productId", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await query("DELETE FROM cart_items WHERE cart_id = :cartId AND product_id = :productId", {
      cartId: cart.id,
      productId: req.params.productId
    });
    return res.json({ cart: await getCartResponse(req.user.id) });
  } catch (error) {
    return next(error);
  }
});

export default router;
