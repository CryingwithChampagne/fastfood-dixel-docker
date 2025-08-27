import { useEffect, useState } from "react";
import "./App.css";

type MenuItem = {
  name: string;
  price: number;
  image?: string;
  description?: string;
};

type OrderResponse = {
  message?: string;
  error?: string;
  order?: {
    item: string;
    quantity: number;
    total: number;
    createdAt?: string;
    status?: string;
  };
};
  useEffect(() => {
    // Add gothic font link to head if not present
    if (!document.getElementById('gothic-font')) {
      const link = document.createElement('link');
      link.id = 'gothic-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

const TAX_RATE = 0.07;

function App() {
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const darkMode = true;

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenu(
          data.map((item: MenuItem) => ({
            ...item,
            image: `/assets/${item.name.replace(/\s/g, "").toLowerCase()}.png`,
            description: `${item.name} is a delicious fast food item.`,
          }))
        );
      })
      .catch(() => setError("Failed to load menu."));
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.className = "dark";
  }, []);

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = () => {
    if (!selectedItem || quantity < 1) return;
    const item = menu.find((m) => m.name === selectedItem);
    if (!item) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.name === selectedItem);
      if (existing) {
        return prev.map((c) =>
          c.name === selectedItem ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { name: item.name, price: item.price, quantity }];
    });
    setSelectedItem("");
    setQuantity(1);
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const editCartItem = (name: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError("");
    setConfirmation("");
    try {
      const results = [];
      for (const item of cart) {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: item.name, quantity: item.quantity }),
        });
        const data: OrderResponse = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Order failed");
        results.push({ ...data, status: "Pending" });
      }
      setConfirmation(`Order placed! (${results.map(r => r.message).join(" | ")})`);
      setCart([]);
      fetch("/api/orders").then((res) => res.json()).then(setOrders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const modalClass = showModal ? "modal show" : "modal";

  useEffect(() => {
    // Listen for Get Dixel button click from index.html
    const btn = document.getElementById("get-dixel-btn");
    if (btn) {
      btn.onclick = () => setShowMenuPopup(true);
    }
    return () => {
      if (btn) btn.onclick = null;
    };
  }, []);

  return (
    <div className={`container advanced${darkMode ? " dark" : ""}`}>
      {/* ...existing header... */}
      {showMenuPopup && (
        <div className="modal show" style={{zIndex: 2000}} onClick={() => setShowMenuPopup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Menu</h2>
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
            {filteredMenu.length === 0 ? (
              <p>No items found.</p>
            ) : (
              <div className="menu-list">
                {filteredMenu.map((item) => (
                  <div className="menu-card" key={item.name}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="menu-img"
                      onClick={() => {
                        setModalItem(item);
                        setShowModal(true);
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/default.png";
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <div>
                      <strong>{item.name}</strong>
                      <div>${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowMenuPopup(false)} style={{marginTop: "1em"}}>Close Menu</button>
          </div>
        </div>
      )}
      {/* ...existing code... */}

      <div className="order-section">
        <h2>Add to Cart</h2>
        <div className="order-form">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an item
            </option>
            {menu.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
          <button type="button" onClick={addToCart}>
            Add
          </button>
        </div>
      </div>

      <div className="cart-section">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.name} className="cart-item">
                <span>{item.name}</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => editCartItem(item.name, Number(e.target.value))}
                  className="cart-qty"
                />
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button className="remove-btn" onClick={() => removeFromCart(item.name)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-total">Subtotal: ${subtotal.toFixed(2)} | Tax: ${tax.toFixed(2)} | Total: ${total.toFixed(2)}</div>
        <button type="button" onClick={handleOrder} disabled={loading || cart.length === 0}>
          {loading ? "Ordering..." : "Place Order"}
        </button>
        {confirmation && <p className="success">{confirmation}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="history-section">
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul className="order-list">
            {orders.map((order, idx) => (
              <li key={idx} className="order-item">
                <span>{order.quantity} x {order.item} (${order.total.toFixed(2)})</span>
                <span>Status: <span className="order-status">{order.status || "Completed"}</span></span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for menu item details */}
      {showModal && modalItem && (
        <div className={modalClass} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={modalItem.image} alt={modalItem.name} className="modal-img" />
            <h3>{modalItem.name}</h3>
            <p>{modalItem.description}</p>
            <p>Price: ${modalItem.price.toFixed(2)}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;