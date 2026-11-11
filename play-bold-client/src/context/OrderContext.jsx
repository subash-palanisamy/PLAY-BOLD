import { createContext, useContext, useState } from "react";
import axios from "axios";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const createOrder = async ({ addressId, paymentMethod, items }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        { addressId, paymentMethod, items },
        authHeader
      );
      return { success: true, order: res.data };
    } catch (err) {
      console.error("Create order error:", err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to place order",
      };
    }
  };

  const fetchMyOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/orders/my", authHeader);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, authHeader);
      return { success: true, order: res.data };
    } catch (err) {
      console.error("Get order error:", err.message);
      return { success: false, message: "Order not found" };
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        authHeader
      );
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      return { success: true };
    } catch (err) {
      console.error("Cancel order error:", err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to cancel order",
      };
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        fetchMyOrders,
        getOrderById,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};