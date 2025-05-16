import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CategoryPage.css";
import AOS from "aos";
import "aos/dist/aos.css";

const categories = [
  { key: "festival", label: "Festival Specific" },
  { key: "fast_food", label: "Fast Food" },
  { key: "main_course", label: "Main Course" },
  { key: "sweets", label: "Sweets" },
  { key: "drinks", label: "Drinks" },
];

export default function CategoryPage() {
 const apiUrl = process.env.REACT_APP_API_URL;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const fetchItemsByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/orders/items/?category=${category}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const isInCart = (itemId) => {
    return cart.some((cartItem) => cartItem.item.id === itemId);  // Check if item is already in the cart
  };

  return (
    <div className="category-container" data-aos="fade-up">
      <h2 data-aos="fade-down" className="category-title">🍽️ Explore by Category</h2>

      <div className="category-buttons" data-aos="fade-up" data-aos-delay="100">
        {categories.map((cat, idx) => (
          <button
            key={cat.key}
            onClick={() => fetchItemsByCategory(cat.key)}
            className="category-btn"
            data-aos="zoom-in"
            data-aos-delay={idx * 100}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && <p className="loading" data-aos="fade-in">Loading items...</p>}

      <div className="items-grid">
        {items.map((item, idx) => {
          const alreadyInCart = isInCart(item.id);  // Determine if item is in the cart
          return (
            <div
              key={item.id}
              className="item-card"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <img
                src={item.image}
                alt={item.name}
                onClick={() => navigate(`/item/${item.id}`)}
                className="item-image"
              />
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
              <button
                className={`add-btn ${alreadyInCart ? "added" : ""}`}  // Change button style if added
                onClick={() => !alreadyInCart && addToCart(item)}  // Only add if item is not in cart
                disabled={alreadyInCart}  // Disable button if already in cart
              >
                {alreadyInCart ? "✔ Added" : "Add to Cart"}  {/* Change text when added */}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
