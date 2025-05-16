import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TrackOrderPage.css";

const TrackOrderPage = () => {
 const apiUrl = process.env.REACT_APP_API_URL;

  const [remainingTime, setRemainingTime] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the latest order from the backend
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("access"); // Fetch token from localStorage
        if (!token) {
          setError("User is not authenticated.");
          return;
        }

        const response = await axios.get(`${apiUrl}/api/orders/track-order/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setOrderItems(response.data.items);
          setRemainingTime(response.data.remaining_time); // Set remaining time from the backend
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Error fetching order details.");
      }
    };

    fetchOrder();

    // Countdown timer based on remainingTime from the backend
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Format time in mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="track-order-container">
      <h2>📦 Track Your Order</h2>

      {error && <p>{error}</p>}

      {orderItems.length > 0 ? (
        <>
          <p>Your order is on the way!</p>
          <p>
            Estimated delivery in: <strong>{formatTime(remainingTime)}</strong>
          </p>

          <h3>Ordered Items:</h3>
          <ul className="track-order-list">
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.item} x {item.quantity} — ₹
                {(item.quantity * item.price).toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No active orders to track right now.</p>
      )}
    </div>
  );
};

export default TrackOrderPage;
