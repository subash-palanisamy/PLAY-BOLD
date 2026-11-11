import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { addRecentlyViewed, getRecentlyViewed } from "../../utils/recentlyViewed";

const API = "http://localhost:5000";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [alsoBought, setAlsoBought] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [sizeError, setSizeError] = useState(false);

  const { gender, sport, collection, slug } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [gender, sport, collection, slug]);

  const fetchProduct = async () => {
    try {
      const url = collection
        ? `${API}/api/products/${gender}/${sport}/${collection}/${slug}`
        : `${API}/api/products/${gender}/${sport}/${slug}`;

      const { data } = await axios.get(url);
      setProduct(data);
      setSelectedSize(null);
      setShowFullDescription(false);
      setSizeError(false);

      fetchSimilarAndAlsoBought(data);

      addRecentlyViewed(data);
      setRecentlyViewed(getRecentlyViewed().filter((p) => p.id !== data.id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSimilarAndAlsoBought = async (currentProduct) => {
    try {
      const { data } = await axios.get(
        `${API}/api/products/listing/${currentProduct.gender}/${currentProduct.sport}`
      );
      const list = Array.isArray(data) ? data : data.products || [];
      const filtered = list.filter((p) => p.id !== currentProduct.id);

      setSimilarProducts(filtered.slice(0, 4));
      setAlsoBought(
        filtered.slice(4, 8).length > 0 ? filtered.slice(4, 8) : filtered.slice(0, 4)
      );
    } catch (error) {
      console.log("Could not load similar products", error);
      setSimilarProducts([]);
      setAlsoBought([]);
    }
  };

  if (!product) {
    return (
      <div className="bg-[#0b241b]">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-lg font-medium text-[#b9d9c4]">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const statusBadge =
    product.stock <= 12 ? "Selling Fast" : hasDiscount ? "Best Deal" : null;

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product.id, selectedSize, 1);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    await addToCart(product.id, selectedSize, 1);
    navigate("/checkout");
  };

  const shortDescription =
    product.description && product.description.length > 140
      ? product.description.slice(0, 140) + "..."
      : product.description;

  const detailRows = [
    { label: "Designed for", value: product.designedFor },
    { label: "Width", value: product.width },
    { label: "Fit", value: product.fit },
    { label: "Closure", value: product.closureType },
    { label: "Toe Type", value: product.toeType },
    { label: "Heel Type", value: product.heelType },
    { label: "Cushioning", value: product.cushioningTech },
    { label: "Heel-to-toe drop", value: product.heelToToeDrop },
    { label: "Stack height", value: product.stackHeight },
    { label: "Weight", value: product.weight },
    { label: "Outsole", value: product.outsoleTech },
    { label: "Plating", value: product.platingTech },
    { label: "Pronation", value: product.pronation },
  ].filter((row) => row.value && row.value !== "None");

  // ✅ Single related row — See Similar wins if it has items, else Others Also Bought
  const relatedProducts =
    similarProducts.length > 0 ? similarProducts : alsoBought;
  const relatedTitle =
    similarProducts.length > 0 ? "See Similar" : "Others Also Bought";

  return (
    <div className="bg-[#0b241b] text-[#b9d9c4] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        {product.route?.length > 0 && (
          <div className="text-sm text-[#b9d9c4]/70 mb-6 flex flex-wrap items-center gap-1">
            {product.route.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx === 0 ? (
                  <Link to="/" className="hover:underline text-[#a6d98f]">
                    {crumb}
                  </Link>
                ) : (
                  <span
                    className={
                      idx === product.route.length - 1
                        ? "text-[#e6f4e8] font-medium"
                        : ""
                    }
                  >
                    {crumb}
                  </span>
                )}
                {idx < product.route.length - 1 && (
                  <span className="text-[#5db894]/60">•</span>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 gap-2">
            {product.images?.map((img, idx) => (
              <div key={idx} className="relative">
                {idx === 0 && hasDiscount && (
                  <span className="absolute top-3 left-3 z-10 bg-[#a6d98f] text-[#0b241b] text-xs font-bold px-2 py-1 rounded">
                    -{discountPercent}%
                  </span>
                )}
                {idx === 0 && (
                  <button
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 z-10 bg-[#0b241b]/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={inWishlist ? "#ef4444" : "none"}
                      stroke={inWishlist ? "#ef4444" : "#a6d98f"}
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>
                )}
                <img
                  src={`${API}${img}`}
                  alt={`${product.name} ${idx + 1}`}
                  onClick={() => setLightboxImage(`${API}${img}`)}
                  className="w-full aspect-square object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>

          {/* PRODUCT INFO (sticky) */}
          <div className="md:sticky md:top-6">
            {statusBadge && (
              <span className="inline-block bg-[#a6d98f] text-[#0b241b] text-xs font-bold px-3 py-1 rounded-full mb-3">
                {statusBadge}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[#e6f4e8]">
              {product.name}
            </h1>
            <p className="text-[#a6d98f] mt-2">{product.brand}</p>

            {product.color && (
              <p className="text-[#b9d9c4]/80 mt-1 text-sm">
                <span className="font-medium text-[#e6f4e8]">Colour:</span>{" "}
                {product.color}
              </p>
            )}

            <div className="flex items-center gap-3 mt-6">
              <h2 className="text-3xl font-bold text-[#e6f4e8]">₹{displayPrice}</h2>
              {hasDiscount && (
                <span className="text-[#b9d9c4]/50 line-through text-xl">
                  ₹{product.price}
                </span>
              )}
              <span className="text-xs text-[#b9d9c4]/50">Prices include GST</span>
            </div>

            {hasDiscount && (
              <p className="text-[#a6d98f] text-sm font-medium mt-1">
                Extra 5% off auto-applied at checkout
              </p>
            )}

            {product.sizes?.length > 0 && (
              <div
                className={`mt-6 rounded-xl transition-all ${
                  sizeError ? "animate-[shake_0.4s_ease-in-out]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-medium ${
                      sizeError ? "text-red-400" : "text-[#e6f4e8]"
                    }`}
                  >
                    Size
                  </p>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs underline text-[#a6d98f]"
                  >
                    Size Guide
                  </button>
                </div>

                {showSizeGuide && (
                  <p className="text-xs text-[#b9d9c4] bg-[#14503c] rounded-lg p-3 mb-3">
                    Sizes shown are standard PlayBold fit. If you're between sizes, we
                    recommend sizing up for a more comfortable fit.
                  </p>
                )}

                <div
                  className={`flex flex-wrap gap-2 rounded-lg p-1 ${
                    sizeError ? "ring-2 ring-red-400" : ""
                  }`}
                >
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? "border-[#a6d98f] bg-[#a6d98f] text-[#0b241b]"
                          : "border-[#5db894] text-[#e6f4e8] hover:border-[#a6d98f] hover:bg-[#1e7f5c]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {sizeError && (
                  <p className="text-red-400 text-xs font-medium mt-2">
                    Please select a size to continue
                  </p>
                )}
              </div>
            )}

            {/* Actions: Wishlist | Add to Cart | Buy Now */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleWishlistClick}
                className={`p-3 rounded-xl border-2 transition-all ${
                  inWishlist
                    ? "bg-red-500/10 border-red-400 text-red-400"
                    : "border-[#5db894] text-[#a6d98f] hover:bg-[#1e7f5c]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={inWishlist ? "#ef4444" : "none"}
                  stroke={inWishlist ? "#ef4444" : "currentColor"}
                  strokeWidth="2"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-[#a6d98f] text-[#a6d98f] font-semibold py-3 rounded-xl hover:bg-[#a6d98f] hover:text-[#0b241b] transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#a6d98f] text-[#0b241b] font-semibold py-3 rounded-xl hover:bg-[#5db894] transition-colors"
              >
                Buy Now
              </button>
            </div>

            {product.description && (
              <div className="mt-6">
                <p className="font-medium mb-1 text-[#e6f4e8]">Description</p>
                <p className="text-[#b9d9c4] text-sm leading-relaxed">
                  {showFullDescription ? product.description : shortDescription}
                </p>
                {product.description.length > 140 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-sm font-medium underline mt-1 text-[#a6d98f]"
                  >
                    {showFullDescription ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 text-sm text-[#b9d9c4]/70 space-y-1 border-t border-[#1e7f5c] pt-4">
              <p>✅ This item qualifies for free shipping</p>
              <p>🔁 Free returns on all qualifying orders within 10 days</p>
              {product.customerCareEmail && (
                <p>
                  For queries, contact{" "}
                  <a
                    href={`mailto:${product.customerCareEmail}`}
                    className="underline text-[#a6d98f]"
                  >
                    {product.customerCareEmail}
                  </a>
                  {product.customerCareWhatsapp &&
                    ` or WhatsApp us at ${product.customerCareWhatsapp}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ SINGLE RELATED ROW — See Similar OR Others Also Bought */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-bold text-xl mb-4 text-[#e6f4e8]">{relatedTitle}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {relatedProducts.map((p) => (
                <div key={p.id} className="min-w-[240px] max-w-[240px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT STORY + FEATURES + DETAILS + MATERIAL + MANUFACTURER + ORIGIN + IMPORTER */}
        <div className="mt-16 bg-[#14503c] rounded-2xl p-8 space-y-10">
          {product.description && (
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#e6f4e8]">Product Story</h3>
              <p className="text-sm text-[#b9d9c4] leading-relaxed max-w-3xl">
                {product.description}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10">
            {product.features?.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-[#e6f4e8]">
                  Features & Benefits
                </h3>
                <ul className="text-sm text-[#b9d9c4] list-disc list-inside space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {detailRows.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-[#e6f4e8]">Details</h3>
                <ul className="text-sm text-[#b9d9c4] space-y-2">
                  {detailRows.map((row) => (
                    <li
                      key={row.label}
                      className="flex justify-between border-b border-[#1e7f5c] pb-2"
                    >
                      <span className="text-[#b9d9c4]/70">{row.label}</span>
                      <span className="font-medium text-right text-[#e6f4e8]">
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {product.material && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-[#e6f4e8]">
                  Material Information
                </h3>
                <p className="text-sm text-[#b9d9c4] leading-relaxed">
                  {product.material}
                </p>
                {product.styleCode && (
                  <p className="text-sm text-[#b9d9c4]/70 mt-4">
                    <span className="font-medium text-[#e6f4e8]">Style Code:</span>{" "}
                    {product.styleCode}
                  </p>
                )}
                {product.netQuantity && (
                  <p className="text-sm text-[#b9d9c4]/70 mt-1">
                    <span className="font-medium text-[#e6f4e8]">Net Quantity:</span>{" "}
                    {product.netQuantity}
                  </p>
                )}
              </div>
            )}

            {product.manufacturerAddress && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-[#e6f4e8]">
                  Manufacturer's Address
                </h3>
                <p className="text-sm text-[#b9d9c4] leading-relaxed">
                  {product.manufacturerAddress}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {product.countryOfOrigin && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-[#e6f4e8]">
                  Country of Origin
                </h3>
                <p className="text-sm text-[#b9d9c4]">{product.countryOfOrigin}</p>
              </div>
            )}

            {product.importerAddress && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-[#e6f4e8]">
                  Importer Name and Address
                </h3>
                <p className="text-sm text-[#b9d9c4] leading-relaxed">
                  {product.importerAddress}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RECENTLY VIEWED */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 mb-8">
            <h3 className="font-bold text-xl mb-4 text-[#e6f4e8]">
              Recently Viewed By You
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentlyViewed.map((p) => (
                <div key={p.id} className="min-w-[240px] max-w-[240px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img
            src={lightboxImage}
            alt="Zoomed product"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}

      <Footer />

      {/* Shake keyframes for size error */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

export default ProductDetails;