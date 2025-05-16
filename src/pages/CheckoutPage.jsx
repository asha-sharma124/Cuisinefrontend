import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;


  const { cart } = useCart();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [lane, setLane] = useState("");
  const [nearby, setNearby] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.item.price,
    0
  );

  useEffect(() => {
    fetch(`${apiUrl}/api/orders/addresses/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSavedAddresses(data));
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
  
    const orderItems = cart.map((cartItem) => ({
      item_id: cartItem.item.id,
      quantity: cartItem.quantity,
      price: cartItem.item.price,
    }));
  
    let addressDetails;
    if (selectedAddressId) {
      addressDetails = savedAddresses.find(
        (addr) => addr.id === parseInt(selectedAddressId)
      );
    } else {
      addressDetails = {
        lane,
        nearby_location: nearby,
        city,
        pincode,
      };
      await fetch(`${apiUrl}/api/orders/addresses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(addressDetails),
      });
    }
  
    const orderData = {
      amount: totalPrice, // amount in INR
    };
  
    // Create Razorpay Order
    const razorRes = await fetch(`${apiUrl}/api/orders/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(orderData),
    });
  
    const razorData = await razorRes.json();
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
    console.log(razorpayKey);
    const options = {
     
      
      key: process.env.REACT_APP_RAZORPAY_KEY ,// Replace with your Razorpay Key ID
      amount: razorData.amount,
      currency: "INR",
      name: "YUMYARD STORE",
      description: "Order Payment",
      image: "https://example.com/logo.png",
      order_id: razorData.id,
      handler: async function (response) {
        const confirmOrder = {
          user_id: 1, // or fetch from auth
          address: `${addressDetails.lane}, ${addressDetails.nearby_location}, ${addressDetails.city} - ${addressDetails.pincode}`,
          total_price: totalPrice,
          items: orderItems,
          payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        };
  
        const res = await fetch(`${apiUrl}/api/orders/place-order/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(confirmOrder),
        });
  
        if (res.ok) {
          navigate("/order-confirmation");
        } else {
          console.error("Order placement failed");
        }
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Choose Saved Address</label>
          <select
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            <option value="">-- Add New Address --</option>
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.lane}, {addr.nearby_location}, {addr.city} -{" "}
                {addr.pincode}
              </option>
            ))}
          </select>
        </div>

        {!selectedAddressId && (
          <>
            <div className="form-group">
              <label>Lane</label>
              <input
                type="text"
                value={lane}
                onChange={(e) => setLane(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Nearby Location</label>
              <input
                type="text"
                value={nearby}
                onChange={(e) => setNearby(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.item.id}>
                {item.item.name} × {item.quantity} = ₹
                {(item.quantity * item.item.price).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="total-price">
            <strong>Total: ₹{totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <button type="submit" className="checkout-btn">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
