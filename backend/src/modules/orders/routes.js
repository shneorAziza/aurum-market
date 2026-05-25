import { Router } from "express";
import { z } from "zod";
import { pool, query } from "../../db/pool.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";

const router = Router();
router.use(requireAuth);

const checkoutSchema = z.object({
  body: z.object({
    shippingName: z.string().min(2),
    shippingAddress: z.string().min(5),
    shippingCity: z.string().min(2),
    shippingCountry: z.string().min(2)
  })
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await query(
      "SELECT id, status, total, created_at AS createdAt FROM orders WHERE user_id = :userId ORDER BY created_at DESC",
      { userId: req.user.id }
    );
    return res.json({ orders });
  } catch (error) {
    return next(error);
  }
});

router.post("/checkout", validate(checkoutSchema), async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[cart]] = await connection.execute("SELECT * FROM carts WHERE user_id = ?", [req.user.id]);
    if (!cart) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const [items] = await connection.execute(
      `SELECT ci.product_id, ci.quantity, p.name, p.price
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );

    if (!items.length) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const { shippingName, shippingAddress, shippingCity, shippingCountry } = req.validated.body;

    await connection.execute(
      `INSERT INTO orders (user_id, total, shipping_name, shipping_address, shipping_city, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, total, shippingName, shippingAddress, shippingCity, shippingCountry]
    );

    const [[order]] = await connection.execute(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [req.user.id]
    );

    for (const item of items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [order.id, item.product_id, item.name, item.quantity, item.price]
      );
    }

    await connection.execute("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
    await connection.commit();
    return res.status(201).json({ orderId: order.id, total });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
});

export default router;

