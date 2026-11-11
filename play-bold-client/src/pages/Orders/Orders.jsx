import { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useOrder } from "../../context/OrderContext";

const STATUS_COLORS = {
  Received: "bg-gray-100 text-gray-700",
  Picked: "bg-blue-100 text-blue-700",
  "In-transit": "bg-blue-100 text-blue-700",
  "Out for delivery": "bg-orange-100 text-orange-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function Orders() {
  const { orders, loading, fetchMyOrders, cancelOrder } = useOrder();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm("Cancel this order?")) {
      await cancelOrder(orderId);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-lg font-medium text-gray-500">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 min-h-[60vh]">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-gray-600 mb-2">No orders yet</p>
            <p className="text-sm text-gray-400 mb-6">
              When you place an order, it'll show up here.
            </p>
            <Link
              to="/"
              className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              // Compute the real display status the same way Profile.jsx does —
              // trackingStatus reflects live simulated progress (Received →
              // Picked → In-transit → Out for delivery → Delivered) computed
              // from createdAt. orderStatus alone stays stuck at "Processing"
              // until it's explicitly cancelled, so it's not accurate on its own.
              const displayStatus =
                order.orderStatus === "Cancelled"
                  ? "Cancelled"
                  : order.trackingStatus || order.orderStatus;

              return (
                <div key={order._id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="text-sm font-medium">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Placed On</p>
                      <p className="text-sm font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment</p>
                      <p className="text-sm font-medium">
                        {order.paymentMethod} • {order.paymentStatus}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        STATUS_COLORS[displayStatus] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {displayStatus}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <img
                          src={item.image ? `http://localhost:5000${item.image}` : ""}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500 text-xs">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold shrink-0">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <p className="font-bold">Total: ₹{order.totalAmount}</p>
                    {/* Cancel eligibility is based on the REAL orderStatus, not
                        displayStatus — an order still shows "Cancel" here even
                        if it visually looks "Out for delivery" / "Delivered",
                        since no real fulfillment has actually happened yet. */}
                    {["Processing"].includes(order.orderStatus) && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="text-sm font-medium text-red-600 underline hover:text-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Orders;