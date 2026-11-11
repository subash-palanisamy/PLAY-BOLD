import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setWishlistItems(res.data.products || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      alert("Please login to add items to wishlist");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      fetchWishlist();
    } catch (err) {
      console.error("Add to wishlist error:", err.message);
    }
  };

  const removeFromWishlist = async (productId) => {
    const currentToken = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      fetchWishlist();
    } catch (err) {
      console.error("Remove from wishlist error:", err.message);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Re-sync whenever login/logout fires the "authChanged" event
  // (dispatched from Login.jsx, Signup.jsx, and the logout handler)
  useEffect(() => {
    const syncAuth = () => fetchWishlist();
    window.addEventListener("authChanged", syncAuth);
    return () => window.removeEventListener("authChanged", syncAuth);
  }, []);

  useEffect(() => {
    fetchWishlist(); // initial load on app mount
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};