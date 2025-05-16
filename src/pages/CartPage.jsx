import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import AOS from "aos";
import "aos/dist/aos.css";

const CartPage = () => {
 const apiUrl = process.env.REACT_APP_API_URL;

  const { cart, addToCart, removeFromCart, clearFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 400, once: true });
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.item.price,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container" data-aos="fade-up">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.length > 0 ? (
          cart.map((cartItem) => (
            <div
              key={cartItem.item.id}
              className="cart-item"
              data-aos="fade-up"
            >
              <div className="cart-item-image">
                <img
                  src={`${apiUrl}/${cartItem.item.image}`}
                  alt={cartItem.item.name}
                  className="cart-item-img"
                />
              </div>
              <div className="cart-item-details">
                <h3>{cartItem.item.name}</h3>
                <p>Price: ₹{cartItem.item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => removeFromCart(cartItem.item.id)}>
                    -
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={() => addToCart(cartItem.item)}>+</button>
                </div>
                <p>
                  Total: ₹
                  {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => clearFromCart(cartItem.item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-total" data-aos="fade-up">
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
        </div>
      )}

      {cart.length > 0 && (
        <div className="checkout-btn-container" data-aos="fade-up">
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
