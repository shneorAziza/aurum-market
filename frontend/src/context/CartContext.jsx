import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });

  async function refreshCart() {
    if (!user) {
      setCart({ items: [], total: 0 });
      return;
    }
    const data = await api("/cart");
    setCart(data.cart);
  }

  async function addItem(productId, quantity = 1) {
    const data = await api("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity })
    });
    setCart(data.cart);
  }

  async function updateItem(productId, quantity) {
    const data = await api(`/cart/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    });
    setCart(data.cart);
  }

  useEffect(() => {
    refreshCart().catch(() => setCart({ items: [], total: 0 }));
  }, [user]);

  const value = useMemo(() => ({ cart, refreshCart, addItem, updateItem }), [cart, user]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

