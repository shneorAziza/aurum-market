import { Router } from "express";
import { query } from "../../db/pool.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", category = "", sort = "featured" } = req.query;
    const orderBy =
      sort === "price-asc"
        ? "price ASC"
        : sort === "price-desc"
          ? "price DESC"
          : sort === "rating"
            ? "rating DESC"
            : "featured DESC, created_at DESC";

    const products = await query(
      `SELECT * FROM products
       WHERE (:search = '' OR name LIKE CONCAT('%', :search, '%') OR description LIKE CONCAT('%', :search, '%'))
       AND (:category = '' OR category = :category)
       ORDER BY ${orderBy}`,
      { search, category }
    );

    const categories = await query("SELECT DISTINCT category FROM products ORDER BY category ASC");
    return res.json({ products, categories: categories.map((item) => item.category) });
  } catch (error) {
    return next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const [product] = await query("SELECT * FROM products WHERE slug = :slug", {
      slug: req.params.slug
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product });
  } catch (error) {
    return next(error);
  }
});

export default router;

