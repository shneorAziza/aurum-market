import { X } from "lucide-react";

export function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="product-modal" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button close" onClick={onClose} aria-label="Close product details">
          <X size={19} />
        </button>
        <img src={product.image_url} alt={product.name} />
        <div className="modal-content">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <dl>
            <div>
              <dt>Rating</dt>
              <dd>{product.rating}/5</dd>
            </div>
            <div>
              <dt>Available</dt>
              <dd>{product.inventory} units</dd>
            </div>
          </dl>
          <div className="modal-actions">
            <strong>${Number(product.price).toFixed(2)}</strong>
            <button className="primary" onClick={() => onAdd(product.id)}>
              Add to cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

