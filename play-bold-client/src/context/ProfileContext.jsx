import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setAuthError(true);
      setProfile(null);
      return;
    }

    setLoading(true);
    setAuthError(false);

    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/profile",
        getAuthHeader()
      );

      setProfile(res.data);
    } catch (err) {
      console.error("Fetch profile error:", err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }

      setAuthError(true);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE PERSONAL INFORMATION
  // =========================================================

  const updateProfile = async (updates) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        updates,
        getAuthHeader()
      );

      setProfile(res.data);

      return {
        success: true,
        data: res.data,
        message: "Profile updated successfully",
      };
    } catch (err) {
      console.error("Update profile error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to update profile",
      };
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword,
          newPassword,
        },
        getAuthHeader()
      );

      return {
        success: true,
        message: res.data.message || "Password changed successfully",
      };
    } catch (err) {
      console.error("Change password error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to change password",
      };
    }
  };

  // =========================================================
  // ADD ADDRESS
  // =========================================================

  const addAddress = async (address) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/addresses",
        address,
        getAuthHeader()
      );

      setProfile((prev) => ({
        ...prev,
        addresses: res.data,
      }));

      await fetchProfile();

      return {
        success: true,
        message: "Address added successfully",
      };
    } catch (err) {
      console.error("Add address error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to add address",
      };
    }
  };

  // =========================================================
  // UPDATE ADDRESS
  // =========================================================

  const updateAddress = async (addressId, updates) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/addresses/${addressId}`,
        updates,
        getAuthHeader()
      );

      setProfile((prev) => ({
        ...prev,
        addresses: res.data,
      }));

      await fetchProfile();

      return {
        success: true,
        message: "Address updated successfully",
      };
    } catch (err) {
      console.error("Update address error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to update address",
      };
    }
  };

  // =========================================================
  // DELETE ADDRESS
  // =========================================================

  const deleteAddress = async (addressId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/users/addresses/${addressId}`,
        getAuthHeader()
      );

      setProfile((prev) => ({
        ...prev,
        addresses: res.data,
      }));

      await fetchProfile();

      return {
        success: true,
        message: "Address deleted successfully",
      };
    } catch (err) {
      console.error("Delete address error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to delete address",
      };
    }
  };

  // =========================================================
  // SET DEFAULT ADDRESS
  // =========================================================

  const setDefaultAddress = async (addressId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/addresses/${addressId}/default`,
        {},
        getAuthHeader()
      );

      setProfile((prev) => ({
        ...prev,
        addresses: res.data,
      }));

      await fetchProfile();

      return {
        success: true,
        message: "Default address updated successfully",
      };
    } catch (err) {
      console.error("Set default address error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to set default address",
      };
    }
  };

  // =========================================================
  // FETCH MY ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/my",
        getAuthHeader()
      );

      return {
        success: true,
        orders: res.data,
      };
    } catch (err) {
      console.error("Fetch orders error:", err.message);

      return {
        success: false,
        orders: [],
        message:
          err.response?.data?.message || "Unable to load orders",
      };
    }
  };

  // =========================================================
  // FETCH SINGLE ORDER (with tracking info) — for Order Details page
  // =========================================================

  const fetchOrderById = async (orderId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        getAuthHeader()
      );

      return {
        success: true,
        order: res.data,
      };
    } catch (err) {
      console.error("Fetch order error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Unable to load order details",
      };
    }
  };

  // =========================================================
  // CANCEL ORDER
  // =========================================================

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        getAuthHeader()
      );

      return {
        success: true,
        order: res.data,
      };
    } catch (err) {
      console.error("Cancel order error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message || "Unable to cancel order",
      };
    }
  };

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email }
      );

      return {
        success: true,
        message:
          res.data.message ||
          "Password reset instructions have been sent.",
      };
    } catch (err) {
      console.error("Forgot password error:", err.message);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to send password reset request",
      };
    }
  };

  // =========================================================
  // INITIAL PROFILE LOAD + RE-SYNC ON LOGIN/LOGOUT
  // =========================================================

  useEffect(() => {
    fetchProfile(); // initial load on app mount

    // Re-sync whenever login/logout fires the "authChanged" event
    // (dispatched from Login.jsx, Signup.jsx, and the logout handler)
    const syncAuth = () => fetchProfile();
    window.addEventListener("authChanged", syncAuth);
    return () => window.removeEventListener("authChanged", syncAuth);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        authError,

        fetchProfile,

        updateProfile,
        changePassword,

        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        fetchOrders,
        fetchOrderById,
        cancelOrder,
        forgotPassword,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};