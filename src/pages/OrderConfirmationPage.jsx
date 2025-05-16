import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const recommendedItems = [
    { id: 1, name: "Paneer Butter Masala", price: 250 },
    { id: 2, name: "Chole Bhature", price: 180 },
    { id: 3, name: "Vegetable Biryani", price: 220 },
  ];

  useEffect(() => {
    clearCart(); // ✅ run once on mount
  }, []); // ❗ fix: run only once

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleTryAgain = () => {
    navigate("/");
  };

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-box">
        <h2>🎉 Order Confirmed!</h2>
        <p className="message">Thank you for your order. We’re preparing your delicious meal! 🍴</p>

        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
              <p>Would you like to try more dishes?</p>
              <button className="close-btn" onClick={handleClosePopup}>
                ✖ Close
              </button>
            </div>
          </div>
        )}

        <h3 className="suggestion-heading">🍽 You may also like:</h3>
        <div className="recommended-items">
          {recommendedItems.map((item) => (
            <div key={item.id} className="recommended-item">
              <p className="item-name">{item.name}</p>
              <p className="item-price">₹{item.price}</p>
              <button className="try-btn" onClick={handleTryAgain}>
                Try Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
