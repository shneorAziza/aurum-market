import { Router } from "express";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";

const router = Router();
router.use(requireAuth);

const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().max(40).optional().nullable()
  })
});

router.patch("/me", validate(profileSchema), async (req, res, next) => {
  try {
    const { name, phone = null } = req.validated.body;
    await query("UPDATE users SET name = :name, phone = :phone WHERE id = :id", {
      id: req.user.id,
      name,
      phone
    });

    const [user] = await query("SELECT id, name, email, phone FROM users WHERE id = :id", {
      id: req.user.id
    });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

export default router;

