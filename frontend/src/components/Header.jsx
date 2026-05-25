import { LogOut, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function Header({ view, setView }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="site-header">
      <button className="brand" onClick={() => setView("catalog")}>
        <span>Aurum</span>
        <small>Market</small>
      </button>
      <nav className="nav-actions">
        <button className={view === "catalog" ? "active" : ""} onClick={() => setView("catalog")}>
          Catalog
        </button>
        <button className="icon-button" onClick={() => setView("cart")} aria-label="Open cart">
          <ShoppingBag size={19} />
          {count > 0 && <span className="badge">{count}</span>}
        </button>
        {user ? (
          <>
            <button className="icon-button" onClick={() => setView("account")} aria-label="Open account">
              <UserRound size={19} />
            </button>
            <button className="icon-button" onClick={logout} aria-label="Log out">
              <LogOut size={19} />
            </button>
          </>
        ) : (
          <button className="primary small" onClick={() => setView("auth")}>
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}

