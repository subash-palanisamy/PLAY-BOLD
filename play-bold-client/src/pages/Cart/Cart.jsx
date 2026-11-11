import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, loading, updateCartItem, removeFromCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchAllProducts();
  }, []);

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

  // Join cart items (productId, size, quantity) with full product data
  const enrichedItems = cartItems
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  const handleIncrement = (item) => {
    updateCartItem(item.productId, item.size, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.productId, item.size);
    } else {
      updateCartItem(item.productId, item.size, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.productId, item.size);
  };

  const getItemPrice = (product) => product.discountPrice ?? product.price;

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + getItemPrice(item.product) * item.quantity,
    0
  );

  const totalMRP = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalDiscount = totalMRP - subtotal;
  const totalItems = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
  const isLoading = loading || productsLoading;

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

        {isLoading ? (
          <p className="text-gray-500">Loading your cart...</p>
        ) : enrichedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-gray-600 mb-2">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/"
              className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 items-start">
            {/* CART ITEMS LIST */}
            <div className="md:col-span-2 space-y-4">
              {enrichedItems.map((item) => {
                const product = item.product;
                const price = getItemPrice(product);
                const hasDiscount =
                  product.discountPrice && product.discountPrice < product.price;

                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 border border-gray-200 rounded-xl p-4"
                  >
                    {/* IMAGE */}
                    <Link
                      to={`/${product.gender}/${product.sport}/${product.slug}`}
                      className="shrink-0"
                    >
                      <img
                        src={
                          product.images?.[0]
                            ? `http://localhost:5000${product.images[0]}`
                            : ""
                        }
                        alt={product.name}
                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                      />
                    </Link>

                    {/* INFO */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/${product.gender}/${product.sport}/${product.slug}`}
                            className="font-semibold text-sm md:text-base hover:underline"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <p className="text-gray-500 text-xs md:text-sm mt-1">
                          {product.brand}
                        </p>
                        {product.color && (
                          <p className="text-gray-500 text-xs md:text-sm">
                            Colour: {product.color}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs md:text-sm">
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* QTY STEPPER */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="flex items-center gap-2">
                          {hasDiscount && (
                            <span className="text-gray-400 line-through text-xs">
                              ₹{product.price}
                            </span>
                          )}
                          <span className="font-bold text-sm md:text-base">
                            ₹{price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="md:sticky md:top-24 border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span>₹{totalMRP}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount on MRP</span>
                    <span>−₹{totalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-base">
                <span>Total ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                <span>₹{subtotal}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Checkout coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;