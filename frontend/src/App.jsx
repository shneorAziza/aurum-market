import { useState } from "react";
import { Header } from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { Account } from "./pages/Account";
import { Auth } from "./pages/Auth";
import { Cart } from "./pages/Cart";
import { Catalog } from "./pages/Catalog";

export function App() {
  const [view, setView] = useState("catalog");
  const { user } = useAuth();

  let content = <Catalog setView={setView} />;
  if (view === "auth") content = <Auth setView={setView} />;
  if (view === "cart") content = user ? <Cart setView={setView} /> : <Auth setView={setView} />;
  if (view === "account") content = user ? <Account /> : <Auth setView={setView} />;

  return (
    <>
      <Header view={view} setView={setView} />
      {content}
    </>
  );
}

