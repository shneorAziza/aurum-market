import { Minus, Plus } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export function Cart({ setView }) {
  const { user } = useAuth();
  const { cart, updateItem, refreshCart } = useCart();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState(() => ({
    shippingName: user?.name || "John Doe",
    shippingAddress: "14 Rothschild Blvd",
    shippingCity: "Tel Aviv",
    shippingCountry: "Israel"
  }));
  const [orderId, setOrderId] = useState("");

  async function checkout() {
    const data = await api("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(shipping)
    });
    setOrderId(data.orderId);
    await refreshCart();
    setStep(3);
  }

  return (
    <main className="cart-layout">
      <section>
        <p className="eyebrow">Bag and checkout</p>
        <h1>Your cart</h1>
        {!cart.items.length && step !== 3 && <p className="muted">Your cart is empty.</p>}
        <div className="cart-list">
          {cart.items.map((item) => (
            <article className="cart-row" key={item.productId}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="quantity">
                <button onClick={() => updateItem(item.productId, item.quantity - 1)} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.productId, item.quantity + 1)} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="checkout-panel">
        <div className="steps">
          <span className={step >= 1 ? "done" : ""}>Bag</span>
          <span className={step >= 2 ? "done" : ""}>Shipping</span>
          <span className={step >= 3 ? "done" : ""}>Done</span>
        </div>
        {step === 1 && (
          <>
            <h2>Order summary</h2>
            <p className="summary-line">
              <span>Subtotal</span>
              <strong>${cart.total.toFixed(2)}</strong>
            </p>
            <button className="primary" disabled={!cart.items.length} onClick={() => setStep(2)}>
              Continue to shipping
            </button>
          </>
        )}
        {step === 2 && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              checkout();
            }}
          >
            <h2>Shipping details</h2>
            {Object.entries(shipping).map(([key, value]) => (
              <label key={key}>
                {key.replace("shipping", "")}
                <input value={value} onChange={(event) => setShipping({ ...shipping, [key]: event.target.value })} />
              </label>
            ))}
            <button className="primary" type="submit">
              Place order
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="success">
            <h2>Order confirmed</h2>
            <p>Confirmation #{orderId.slice(0, 8).toUpperCase()}</p>
            <button className="primary" onClick={() => setView("account")}>
              View orders
            </button>
          </div>
        )}
      </aside>
    </main>
  );
}
