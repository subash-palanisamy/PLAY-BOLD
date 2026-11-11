import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

// Works with full product objects (images[]) and with older saved
// recently-viewed entries (image). Relative paths get the backend prefix.
const getImageSrc = (product) => {
  const path = product.images?.[0] ?? product.image ?? "";
  if (!path) return "";
  return path.startsWith("http") ? path : `http://localhost:5000${path}`;
};

function ProductCard({ product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const collectionSlug = product.collection
    ? product.collection.toLowerCase().replace(/\s+/g, "-")
    : null;

  const productUrl = collectionSlug
    ? `/${product.gender}/${product.sport}/${collectionSlug}/${product.slug}`
    : `/${product.gender}/${product.sport}/${product.slug}`;

  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault(); // stops Link navigation
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <Link to={productUrl}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={inWishlist ? "#ef4444" : "none"}
            stroke={inWishlist ? "#ef4444" : "#374151"}
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

        <img
          src={getImageSrc(product)}
          alt={product.name}
          className="h-[260px] w-full object-cover"
        />
        <div className="p-4">
          <h2 className="font-semibold text-lg line-clamp-1">{product.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{product.brand}</p>

          {/* Color */}
          {product.color && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-1">{product.color}</p>
          )}

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-bold">
              ₹{product.discountPrice ?? product.price}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;