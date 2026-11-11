import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { useProfile } from "../../context/ProfileContext";
import { useOrder } from "../../context/OrderContext";

const PAYMENT_METHODS = [
  { key: "COD", label: "Cash on Delivery", available: true },
  { key: "UPI", label: "UPI", available: false },
  { key: "Card", label: "Credit / Debit Card", available: false },
  { key: "NetBanking", label: "Net Banking", available: false },
];

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const { profile } = useProfile();
  const { createOrder } = useOrder();

  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (profile?.addresses?.length > 0) {
      const defaultAddr = profile.addresses.find((a) => a.isDefault) || profile.addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [profile]);

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      const list = Array.isArray(data) ? data : data.products || [];
      setAllProducts(list);
    } catch (error) {
      console.log("Could not load products", error);
      setAllProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const enrichedItems = cartItems
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  const getItemPrice = (product) => product.discountPrice ?? product.price;

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + getItemPrice(item.product) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setErrorMsg("");

    if (!selectedAddressId) {
      setErrorMsg("Please select a delivery address");
      return;
    }
    if (enrichedItems.length === 0) {
      setErrorMsg("Your cart is empty");
      return;
    }

    setPlacingOrder(true);

    const orderItems = enrichedItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      brand: item.product.brand,
      size: item.size,
      quantity: item.quantity,
      price: getItemPrice(item.product),
    }));

    const res = await createOrder({
      addressId: selectedAddressId,
      paymentMethod,
      items: orderItems,
    });

    setPlacingOrder(false);

    if (res.success) {
      await fetchCart();
      navigate(`/order-success/${res.order._id}`);
    } else {
      setErrorMsg(res.message);
    }
  };

  const isLoading = productsLoading || !profile;

  if (isLoading) {
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

  if (enrichedItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</p>
          <Link
            to="/"
            className="mt-4 bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* LEFT: Address + Payment */}
          <div className="md:col-span-2 space-y-8">
            {/* ADDRESS */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Delivery Address</h2>
                <Link to="/profile" className="text-sm underline text-gray-600 hover:text-black">
                  Manage Addresses
                </Link>
              </div>

              {!profile.addresses || profile.addresses.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No saved addresses.{" "}
                  <Link to="/profile" className="underline font-medium text-black">
                    Add an address
                  </Link>{" "}
                  to continue.
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">
                          {addr.fullName} • {addr.phone}
                        </p>
                        <p className="text-gray-500">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city},{" "}
                          {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4">Payment Method</h2>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.key}
                    className={`flex items-center justify-between border rounded-lg p-4 transition-all ${
                      !method.available
                        ? "opacity-60 cursor-not-allowed border-gray-200"
                        : paymentMethod === method.key
                        ? "border-black bg-gray-50 cursor-pointer"
                        : "border-gray-200 hover:border-gray-300 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method.key}
                        disabled={!method.available}
                        onChange={() => setPaymentMethod(method.key)}
                      />
                      <span className="font-medium text-sm">{method.label}</span>
                    </div>
                    {!method.available && (
                      <span className="text-xs text-gray-400">Available soon</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="md:sticky md:top-24 border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {enrichedItems.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3 text-sm">
                  <img
                    src={
                      item.product.images?.[0]
                        ? `http://localhost:5000${item.product.images[0]}`
                        : ""
                    }
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-gray-500 text-xs">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold shrink-0">
                    ₹{getItemPrice(item.product) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-base mb-6">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;