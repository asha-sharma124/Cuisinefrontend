import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Dashboard() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [items, setItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]); // To track added items
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  useEffect(() => {
    AOS.init({ duration: 400, once: true });
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = searchQuery
          ? `${apiUrl}/api/orders/search/?q=${searchQuery}`
          : `${apiUrl}/api/orders/items/`;
        const res = await axios.get(url);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, [searchQuery]);

  useEffect(() => {
    // Track items that are already in the cart
    const added = cart.map((c) => c.item.id);
    setAddedItems(added);
  }, [cart]);

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const res = await axios.post(`${apiUrl}/api/token/refresh/`, {
        refresh,
      });
      const { access } = res.data;
      localStorage.setItem("access", access);
      return access;
    } catch (err) {
      console.error("Error refreshing token:", err);
      localStorage.clear();
      navigate("/login");
    }
  };

  const makeAuthenticatedRequest = async (request) => {
    let token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      return await request(token);
    } catch (err) {
      if (err.response?.status === 401) {
        token = await refreshToken();
        return await request(token);
      }
      throw err;
    }
  };

  const addItemToCart = async (itemId) => {
    if (addedItems.includes(itemId)) return; // Prevent adding the same item multiple times

    const request = async (token) => {
      await axios.post(
        `${apiUrl}/api/orders/cart/add/`,
        { item_id: itemId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    };

    try {
      await makeAuthenticatedRequest(request);
      const selectedItem = items.find((item) => item.id === itemId);
      addToCart(selectedItem);
      setAddedItems((prev) => [...prev, itemId]); // Add to addedItems to update button state
    } catch (err) {
      alert("Failed to add item to cart");
      console.error("Error:", err);
    }
  };

  return (
    <div className="dashboard-container" data-aos="fade-up">
      <h2 className="dashboard-title">
        {searchQuery ? `Search results for "${searchQuery}"` : "Explore Delicious Food"}
      </h2>
      <div className="cards-container">
        {items.map((item, idx) => (
          <div
            className="card"
            key={item.id}
            data-aos="zoom-in-up"
            data-aos-delay={`${idx * 100}`}
          >
            <img
              src={`${item.image}`}
              alt={item.name}
              className="card-image"
            />
            <div className="card-content">
              <h3 className="card-title">{item.name}</h3>
              <p className="card-description">{item.description}</p>
              {item.vendor && (
                  <p className="card-vendor">
                          {item.vendor.name} - {item.vendor.location}
                   </p>
              )}
              <p className="card-price">₹{item.price}</p>
             
              <button
                onClick={() => addItemToCart(item.id)}
                className={`add-to-cart-btn ${addedItems.includes(item.id) ? "added" : ""}`}
                disabled={addedItems.includes(item.id)}
              >
                {addedItems.includes(item.id) ? "Added" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
