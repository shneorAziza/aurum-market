import { Star } from "lucide-react";

export function ProductCard({ product, onOpen, onAdd }) {
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => onOpen(product)}>
        <img src={product.image_url} alt={product.name} />
      </button>
      <div className="product-card-body">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3>{product.name}</h3>
        </div>
        <div className="rating">
          <Star size={16} fill="currentColor" />
          {product.rating}
        </div>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>${Number(product.price).toFixed(0)}</strong>
          <button className="primary small" onClick={() => onAdd(product.id)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

