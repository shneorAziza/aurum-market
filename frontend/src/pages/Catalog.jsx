import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Catalog({ setView }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", sort: "featured" });
  const [message, setMessage] = useState("");
  const [openMenu, setOpenMenu] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(filters);
    api(`/products?${params}`).then((data) => {
      setProducts(data.products);
      setCategories(data.categories);
    });
  }, [filters]);

  async function handleAdd(productId) {
    if (!user) {
      setView("auth");
      return;
    }
    await addItem(productId, 1);
    setMessage("Added to cart");
    setTimeout(() => setMessage(""), 1600);
  }

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "rating", label: "Top rated" },
    { value: "price-asc", label: "Price low to high" },
    { value: "price-desc", label: "Price high to low" }
  ];

  function chooseFilter(key, value) {
    setFilters({ ...filters, [key]: value });
    setOpenMenu("");
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Curated luxury essentials</p>
          <h1>A quieter way to shop premium everyday objects.</h1>
          <p>
            Discover refined travel, home, workspace, and audio pieces selected for lasting utility and tactile quality.
          </p>
        </div>
      </section>

      <section className="toolbar">
        <label className="search toolbar-control">
          <Search size={18} />
          <input
            placeholder="Search products"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
        </label>
        <div className="select-wrap">
          <button
            className="toolbar-control select-control"
            type="button"
            onClick={() => setOpenMenu(openMenu === "category" ? "" : "category")}
          >
            <SlidersHorizontal size={18} />
            <span>{filters.category || "All categories"}</span>
            <ChevronDown size={17} />
          </button>
          {openMenu === "category" && (
            <div className="select-menu">
              <button type="button" onClick={() => chooseFilter("category", "")}>
                All categories
              </button>
              {categories.map((category) => (
                <button type="button" key={category} onClick={() => chooseFilter("category", category)}>
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="select-wrap">
          <button
            className="toolbar-control select-control sort-control"
            type="button"
            onClick={() => setOpenMenu(openMenu === "sort" ? "" : "sort")}
          >
            <span>{sortOptions.find((option) => option.value === filters.sort)?.label}</span>
            <ChevronDown size={17} />
          </button>
          {openMenu === "sort" && (
            <div className="select-menu">
              {sortOptions.map((option) => (
                <button type="button" key={option.value} onClick={() => chooseFilter("sort", option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {message && <div className="toast">{message}</div>}

      <section className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={setSelected} onAdd={handleAdd} />
        ))}
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
    </main>
  );
}
