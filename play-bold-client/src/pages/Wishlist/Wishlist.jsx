import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";
import PlayboldNavbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function Wishlist() {
  // Same pattern ProfileContext uses to detect auth — no token = not logged in.
  const isLoggedIn = !!localStorage.getItem("token");
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();

  // 🔒 Not logged in — show login prompt (PUMA style)
  if (!isLoggedIn) {
    return (
      <div>
        <PlayboldNavbar />

        <div className="max-w-md mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold mb-8">My account</h1>

          <div className="border-b border-black pb-2 mb-8">
            <h2 className="text-lg font-bold">Login / Join Us</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Please login to view items in your wishlist.
          </p>

          <Link
            to="/login?from=wishlist"
            className="block w-full text-center bg-black text-white py-3 font-semibold uppercase tracking-wide hover:bg-gray-900 transition"
          >
            Login
          </Link>

          <p className="text-sm text-center mt-6">
            New here?{" "}
            <Link to="/register" className="underline font-medium">
              Create an account
            </Link>
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  if (loading) return <p className="text-center py-20">Loading...</p>;

  if (wishlistItems.length === 0) {
    return (
      <div>
        <PlayboldNavbar />

        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <Link to="/" className="text-black underline">
            Continue shopping
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div>
      <PlayboldNavbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 relative">
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 text-red-500 text-sm"
              >
                ✕
              </button>
              <Link to={`/${product.gender}/${product.sport}/${product.slug}`}>
                <img
                  src={
                    product.images[0]?.startsWith("http")
                      ? product.images[0]
                      : `http://localhost:5000${product.images[0]}`
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-sm mt-2 font-medium line-clamp-2">{product.name}</p>
                <p className="text-sm text-gray-600">₹{product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Wishlist;