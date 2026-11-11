import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useProfile } from "../../context/ProfileContext";

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById, cancelOrder } = useProfile();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    const res = await fetchOrderById(id);

    if (res.success) {
      setOrder(res.order);
    } else {
      setError(res.message || "Order not found");
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    setCancelling(true);
    const res = await cancelOrder(id);
    setCancelling(false);

    if (res.success) {
      load();
    } else {
      alert(res.message);
    }
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-lg font-medium text-gray-500">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Error / Not found ───
  if (error || !order) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <p className="text-lg font-medium text-gray-500">
            {error || "Order not found"}
          </p>
          <Link to="/profile" className="text-sm font-semibold underline">
            Back to My Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { tracking } = order;
  const isCancelled = order.orderStatus === "Cancelled";
  const canCancel = !isCancelled && order.orderStatus === "Processing";

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* BACK LINK */}
        <Link
          to="/profile"
          className="text-sm font-medium text-gray-500 hover:text-black inline-flex items-center gap-1 mb-6"
        >
          ← Back to My Orders
        </Link>

        {/* HEADER CARD */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isCancelled ? "text-red-500" : "text-green-600"
                }`}
              >
                {isCancelled
                  ? "Cancelled"
                  : tracking?.currentStatus || order.orderStatus}
              </h1>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-800">
                    Order ID:{" "}
                  </span>
                  {order._id}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Order Date:{" "}
                  </span>
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>

            {!isCancelled && order.trackingId && (
              <div className="text-sm text-gray-600 sm:text-right">
                <p>
                  <span className="font-semibold text-gray-800">
                    Courier:{" "}
                  </span>
                  {order.courierName}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Tracking ID:{" "}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {order.trackingId}
                  </span>
                </p>
                {tracking?.eta && (
                  <p className="mt-2 inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    ETA: {tracking.eta}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SHIPMENT TRACKING */}
        {!isCancelled && tracking?.steps?.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg mb-6">Shipment Tracking</h2>

            {/* Desktop: horizontal timeline */}
            <div className="hidden md:flex items-start">
              {tracking.steps.map((step, idx) => (
                <div
                  key={step.label}
                  className="flex-1 flex flex-col items-center text-center relative px-2"
                >
                  {idx !== 0 && (
                    <div
                      className={`absolute top-5 right-1/2 w-full h-[2px] ${
                        step.completed ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      step.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {step.completed ? "✓" : idx + 1}
                  </div>

                  <p className="mt-3 font-semibold text-sm">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.location}
                  </p>
                  {step.completed && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(step.timestamp)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden">
              {tracking.steps.map((step, idx) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        step.completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {step.completed ? "✓" : idx + 1}
                    </div>
                    {idx !== tracking.steps.length - 1 && (
                      <div
                        className={`w-[2px] flex-1 min-h-[32px] ${
                          step.completed ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pb-6">
                    <p
                      className={`font-semibold text-sm ${
                        step.completed ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.location}
                    </p>
                    {step.completed && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDateTime(step.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ITEMS */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">
            Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {item.brand} • Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SHIPPING + PAYMENT */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.phone}</p>
              <p>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2
                  ? `, ${order.shippingAddress.addressLine2}`
                  : ""}
              </p>
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pincode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-3">Payment Summary</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>₹{order.itemsTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {order.shippingFee > 0
                    ? `₹${order.shippingFee}`
                    : "Free"}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-black pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span
                  className={
                    order.paymentStatus === "Paid"
                      ? "text-green-600 font-medium"
                      : "text-gray-600"
                  }
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CANCEL BUTTON */}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="border border-red-200 text-red-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetails;