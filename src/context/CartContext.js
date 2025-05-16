import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
const apiUrl = process.env.REACT_APP_API_URL;

  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(true);

  // Fetch the user's cart from the backend
  const fetchCartFromBackend = async () => {
    const token = localStorage.getItem("access"); // Fetch the access token from localStorage
    if (!token || !userId) return; // If no token or userId, return early

    try {
      const res = await axios.get(`${apiUrl}/api/orders/carts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items); // Assuming `items` is an array of cart items
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false); // Set loading to false once the cart is fetched
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartFromBackend();
    }
  }, [userId]);

  const addToCart = (item) => {
    console.log("Adding to cart:", item);
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.item.id === item.id);
      if (existing) {
        return prevCart.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) =>
      prevCart
        .map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

 
const clearFromCart = async (itemId) => {
  const token = localStorage.getItem("access");

  try {
    await axios.delete(`${apiUrl}/api/orders/cart/item/${itemId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove from frontend state
    setCart((prevCart) => prevCart.filter((c) => c.item.id !== itemId));
  } catch (error) {
    console.error("Failed to remove item from backend:", error);
  }
};

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearFromCart,
        getTotalQuantity,
        clearCart,
        loading, // Provide the loading state
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
