// src/OrderMenu.tsx
import { useState } from "react";

interface Item {
  id: number;
  name: string;
  price: number;
}

export default function OrderMenu() {
  const [cart, setCart] = useState<Item[]>([]);

  const menu: Item[] = [
    { id: 1, name: "Cola", price: 20 },
    { id: 2, name: "French Fries", price: 30 },
    { id: 3, name: "Hamburger", price: 50 },
  ];

  const addToCart = (item: Item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📋 Order Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-2xl shadow-md flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.price}฿</p>
            <button
              onClick={() => addToCart(item)}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border-t">
        <h3 className="text-2xl font-semibold mb-2">🛒 Cart</h3>
        {cart.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <ul>
            {cart.map((c, idx) => (
              <li key={idx}>
                {c.name} - {c.price}฿
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
