import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes, FaHistory } from "react-icons/fa";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "../utils/recentSearches";
import {
  getRecentlyViewed,
  clearRecentlyViewed,
} from "../utils/recentlyViewed";

const trendingSearches = [
  "Sneakers",
  "Running Shoes",
  "Walking Shoes",
  "Football",
  "Cricket",
  "Basketball",
];

// Backend serves images from another origin (localhost:5000) in dev.
const resolveImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `http://localhost:5000${path}`;
};

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const getProductUrl = (p) => {
  const collectionSlug = p.collection
    ? p.collection.toLowerCase().replace(/\s+/g, "-")
    : null;
  return collectionSlug
    ? `/${p.gender}/${p.sport}/${collectionSlug}/${p.slug}`
    : `/${p.gender}/${p.sport}/${p.slug}`;
};

/* One product row: thumbnail left, name + price right (PUMA style).
   Works for both API products (images[]) and saved recently-viewed items (image). */
function ProductRow({ p, onClick }) {
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;
  const image = p.image ?? p.images?.[0];

  return (
    <Link
      to={getProductUrl(p)}
      onClick={onClick}
      className="group flex items-center gap-4"
    >
      <div className="h-[100px] w-[100px] shrink-0 overflow-hidden bg-[#f4f4f4]">
        <img
          src={resolveImageUrl(image)}
          alt={p.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0">
        <p className="line-clamp-2 text-[15px] font-bold leading-snug text-black">
          {p.name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-sm font-bold">
          {hasDiscount ? (
            <>
              <span className="text-[#c8102e]">{formatPrice(p.discountPrice)}</span>
              <span className="text-black line-through">{formatPrice(p.price)}</span>
            </>
          ) : (
            <span className="text-black">{formatPrice(p.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function SearchOverlay({ open, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // On open: load both histories + lock page scroll. On close: reset.
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setRecentlyViewed(getRecentlyViewed());
      document.body.style.overflow = "hidden";
    } else {
      setSearchQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const q = searchQuery.toLowerCase();

        const matches = data.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );

        setSearchResults(matches.slice(0, 8));
      } catch (err) {
        console.error("Search error:", err.message);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  // Enter / search icon: remember this search
  const handleSubmit = (e) => {
    e.preventDefault();
    addRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
  };

  // Clicking a product result also counts as a real search
  const handleResultClick = () => {
    addRecentSearch(searchQuery);
    handleClose();
  };

  const handleRemoveRecentSearch = (query) => {
    removeRecentSearch(query);
    setRecentSearches(getRecentSearches());
  };

  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleClearRecentlyViewed = () => {
    clearRecentlyViewed();
    setRecentlyViewed([]);
  };

  if (!open) return null;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-white">
      {/* ───── Search bar ───── */}
      <div className="bg-[#f4f4f4] px-4 py-8 sm:px-10">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-[1280px] items-center gap-5"
        >
          <div className="flex flex-1 items-center border-2 border-black bg-white px-4 py-3 shadow-[0_0_0_2px_rgba(0,0,0,0.08)]">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PLAYBOLD"
              className="flex-1 bg-transparent text-base tracking-wide text-black outline-none placeholder:text-black/40"
            />
            <button type="submit" aria-label="Search">
              <FaSearch className="text-lg text-black" />
            </button>
          </div>

          <button type="button" onClick={handleClose} aria-label="Close search">
            <FaTimes className="text-2xl text-black" />
          </button>
        </form>
      </div>

      {/* ───── Body ───── */}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 py-10 sm:px-10 md:flex-row md:gap-16">
        {/* LEFT: Recent Searches + Trending Searches */}
        <div className="md:w-[260px] md:shrink-0">
          {recentSearches.length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-black">
                  Recent Searches
                </h3>
                <button
                  onClick={handleClearRecentSearches}
                  className="text-xs font-semibold uppercase tracking-wide text-black/50 underline hover:text-black"
                >
                  Clear
                </button>
              </div>

              <ul className="divide-y divide-black/10">
                {recentSearches.map((item) => (
                  <li key={item} className="flex items-center justify-between py-3">
                    <button
                      onClick={() => setSearchQuery(item)}
                      className="flex items-center gap-3 text-left text-[15px] font-bold text-black/70 hover:text-black"
                    >
                      <FaHistory className="text-sm text-black/40" />
                      {item}
                    </button>
                    <button
                      onClick={() => handleRemoveRecentSearch(item)}
                      aria-label={`Remove ${item}`}
                      className="p-1 text-black/40 hover:text-black"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="mb-6 text-xl font-extrabold uppercase tracking-wide text-black">
            Trending Searches
          </h3>
          <ul className="space-y-4">
            {trendingSearches.map((item) => (
              <li key={item}>
                <button
                  onClick={() => setSearchQuery(item)}
                  className="text-left text-[15px] font-bold text-black/60 transition-colors duration-200 hover:text-black"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Recently Viewed (or live results while typing) */}
        <div className="flex-1">
          {isSearching ? (
            <>
              <h3 className="mb-6 text-xl font-extrabold uppercase tracking-wide text-black">
                {searchLoading ? "Searching..." : `Results for "${searchQuery}"`}
              </h3>

              {!searchLoading && searchResults.length === 0 && (
                <p className="text-black/50">No products found.</p>
              )}

              <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-2">
                {searchResults.map((p) => (
                  <ProductRow key={p.id} p={p} onClick={handleResultClick} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-black">
                  Recently Viewed
                </h3>
                {recentlyViewed.length > 0 && (
                  <button
                    onClick={handleClearRecentlyViewed}
                    className="text-xs font-semibold uppercase tracking-wide text-black/50 underline hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              {recentlyViewed.length === 0 ? (
                <p className="text-black/50">
                  Products you view will show up here.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-2">
                  {recentlyViewed.map((p) => (
                    <ProductRow key={p.id} p={p} onClick={handleClose} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}