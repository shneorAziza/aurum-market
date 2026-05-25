import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function Account() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || "", phone: user?.phone || "" });

  useEffect(() => {
    api("/orders").then((data) => setOrders(data.orders));
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    const data = await api("/users/me", {
      method: "PATCH",
      body: JSON.stringify(profile)
    });
    setUser(data.user);
  }

  return (
    <main className="account-layout">
      <section>
        <p className="eyebrow">Customer account</p>
        <h1>Profile</h1>
        <form className="profile-form" onSubmit={saveProfile}>
          <label>
            Name
            <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
          </label>
          <label>
            Phone
            <input value={profile.phone || ""} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
          </label>
          <button className="primary" type="submit">
            <Save size={17} />
            Save profile
          </button>
        </form>
      </section>

      <section>
        <p className="eyebrow">Past purchases</p>
        <h2>Order history</h2>
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <span>#{order.id.slice(0, 8).toUpperCase()}</span>
              <strong>${Number(order.total).toFixed(2)}</strong>
              <em>{order.status}</em>
            </article>
          ))}
          {!orders.length && <p className="muted">No orders yet.</p>}
        </div>
      </section>
    </main>
  );
}

