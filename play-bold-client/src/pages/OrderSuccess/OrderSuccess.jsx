import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useOrder } from "../../context/OrderContext";

function OrderSuccess() {
  const { orderId } = useParams();
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    const res = await getOrderById(orderId);
    if (res.success) setOrder(res.order);
    setLoading(false);
  };

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

  if (!order) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-lg font-medium text-gray-600 mb-2">Order not found</p>
          <Link
            to="/"
            className="mt-4 bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            className="w-10 h-10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8">
          Thanks for shopping with PlayBold. We'll get your order ready.
        </p>

        <div className="border border-gray-200 rounded-xl p-6 text-left mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">{order._id}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-medium">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Order Status</span>
            <span className="font-medium">{order.orderStatus}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-3 border-t border-gray-200">
            <span>Total Amount</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="border-2 border-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderSuccess;