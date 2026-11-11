import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Add to cart error:", err.message);
    }
  };

  const updateCartItem = async (productId, size, quantity) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Update cart item error:", err.message);
    }
  };

  const removeFromCart = async (productId, size) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}/${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Remove from cart error:", err.message);
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Clear cart error:", err.message);
    }
  };

  const isInCart = (productId, size) => {
    return cartItems.some(
      (item) => item.productId === productId && item.size === size
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isInCart,
        getCartCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};