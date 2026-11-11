import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import SearchOverlay from "./SearchOverlay";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";

/* ─────────────────────────────────────────────
   NAV DATA
   - `to`    : the page the top-level link opens
   - `items` : dropdown options (omit for direct links)
   Every item has an explicit route, so nothing is
   auto-generated from text any more.
───────────────────────────────────────────── */
const navLinks = [
  { label: "NEW", to: "/new" },
  {
    label: "MEN",
    to: "/men/shoes",
    items: [
      { label: "Running", to: "/men/running" },
      { label: "Walking & Lifestyle", to: "/men/walking-lifestyle" },
      { label: "Football", to: "/men/football" },
      { label: "Cricket", to: "/men/cricket" },
      { label: "Court Sports", to: "/men/court-sports" },
      { label: "Training & Outdoor", to: "/men/training-outdoor" },
    ],
  },
  {
    label: "WOMEN",
    to: "/women/shoes",
    items: [
      { label: "Sneakers", to: "/women/sneakers" },
      { label: "Running", to: "/women/running" },
      { label: "Walking", to: "/women/walking" },
      { label: "Training & Gym", to: "/women/training-gym" },
      { label: "Basketball", to: "/women/basketball" },
      { label: "Slip-ons & Sandals", to: "/women/slip-ons-sandals" },
    ],
  },
  {
    label: "KIDS",
    to: "/kids/shoes",
    items: [
      { label: "Sneakers", to: "/kids/sneakers" },
      { label: "Running", to: "/kids/running" },
      { label: "Football", to: "/kids/football" },
      { label: "Cricket", to: "/kids/cricket" },
      { label: "Basketball & Indoor", to: "/kids/basketball-indoor" },
    ],
  },
  {
    label: "COLLECTIONS",
    to: "/collections",
    items: [
      { label: "Lost Temple Collection", to: "/collections/lost-temple-collection" },
      { label: "Nitro Collection", to: "/collections/nitro-collection" },
      { label: "RCB Collection", to: "/collections/rcb-collection" },
      { label: "Minecraft Collection", to: "/collections/minecraft-collection" },
      { label: "Pixar Collection", to: "/collections/pixar-collection" },
    ],
  },
  { label: "SALE", to: "/sale" },
  { label: "ABOUT", to: "/about" },
];

export default function PlayboldNavbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { wishlistItems } = useWishlist();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const timeoutRef = useRef(null);
  const profileTimeoutRef = useRef(null);

  const activeLink = navLinks.find((l) => l.label === activeMenu);

  // ─── Login state (token in localStorage) ──────────
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    window.addEventListener("authChanged", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  // ─── Shrink navbar on scroll ──────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Esc closes menus / search ──────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setSearchOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ─── Mega menu hover ──────────
  // Links with a dropdown open it; direct links (NEW, SALE, ABOUT) close it.
  const handleMouseEnter = (link) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(link.items ? link.label : null);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // ─── Profile dropdown hover ──────────
  const handleProfileMouseEnter = () => {
    clearTimeout(profileTimeoutRef.current);
    setProfileMenuOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimeoutRef.current = setTimeout(
      () => setProfileMenuOpen(false),
      150
    );
  };

  useEffect(() => {
    return () => clearTimeout(profileTimeoutRef.current);
  }, []);

  const handleProfileIconClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      setProfileMenuOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged")); // syncs Wishlist/Profile context instantly
    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    navigate("/");
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  const cartCount = getCartCount();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        @keyframes ticker {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 26s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes megaMenu {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes profileMenu {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>

      {/* ───────────────── TICKER ───────────────── */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-[210]
          overflow-hidden bg-black text-white
          transition-all duration-300
          ${scrolled ? "h-0 opacity-0" : "h-9 opacity-100"}
        `}
      >
        <div className="ticker-track h-full items-center">
          {[
            "⚡ Dare to be Different",
            "FREE RETURNS AND EXCHANGES",
            "⚡ EXTRA 5% OFF ON ONLINE PAYMENTS",
            "🚀 EXPRESS DELIVERY IN SELECT CITIES",
            "🎉 NEW DROPS EVERY FRIDAY",
            "FREE SHIPPING ON ORDERS ABOVE ₹999",
            "⚡ Dare to be Different",
            "FREE RETURNS AND EXCHANGES",
            "⚡ EXTRA 5% OFF ON ONLINE PAYMENTS",
            "🚀 EXPRESS DELIVERY IN SELECT CITIES",
            "🎉 NEW DROPS EVERY FRIDAY",
            "FREE SHIPPING ON ORDERS ABOVE ₹999",
          ].map((msg, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-10 text-[11px] font-semibold tracking-[0.16em] uppercase"
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* ───────────────── NAVBAR ───────────────── */}
      <nav
        className="
          fixed left-0 right-0 z-[200]
          bg-[#0b1f1a]
          border-b border-white/10
          transition-all duration-300
        "
        style={{ top: scrolled ? 0 : 36 }}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`
            relative mx-auto flex max-w-[1280px]
            items-center justify-between px-6
            transition-all duration-300
            ${scrolled ? "h-[58px]" : "h-[66px]"}
          `}
        >
          {/* LEFT: desktop links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.map((link) => {
              const isActive = activeMenu === link.label;
              return (
                <li
                  key={link.label}
                  className="group"
                  onMouseEnter={() => handleMouseEnter(link)}
                >
                  <Link
                    to={link.to}
                    onClick={() => setActiveMenu(null)}
                    className={`
                      relative block pb-1 text-[0.68rem] lg:text-[0.72rem]
                      font-bold tracking-[0.12em] whitespace-nowrap
                      transition-colors duration-200
                      focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-offset-4 focus-visible:outline-[#e63232]
                      ${isActive
                        ? "text-[#e63232]"
                        : "text-white hover:text-[#e63232]"
                      }
                    `}
                  >
                    {link.label}

                    <span
                      className={`
                        absolute left-0 bottom-0 h-[2px]
                        bg-[#e63232]
                        transition-all duration-300
                        ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CENTER LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <img
                src="/images/logo/Logo.png"
                alt="PLAYBOLD"
                className={`
                  object-contain transition-all duration-300
                  ${scrolled ? "h-[34px]" : "h-[40px]"}
                `}
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            {/* SEARCH */}
            <button
              onClick={() => setSearchOpen(true)}
              className="
                hidden sm:flex items-center gap-2
                border border-white/20
                bg-white/5
                px-4 py-2
                text-[0.7rem] font-semibold tracking-[0.12em]
                text-white
                transition-all duration-200
                hover:border-white/40
                hover:bg-white/10
              "
            >
              <FaSearch className="text-xs" />
              SEARCH
            </button>

            {/* SEARCH (icon only, mobile) */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="
                rounded-md p-2 text-white sm:hidden
                transition-all duration-200
                hover:bg-white/10 hover:text-[#e63232]
              "
            >
              <FaSearch />
            </button>

            {/* HEART */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="
                relative rounded-md p-2 text-white
                transition-all duration-200
                hover:bg-white/10 hover:text-[#e63232]
              "
            >
              <FaHeart />
              {wishlistItems.length > 0 && (
                <span className="absolute right-[2px] top-[2px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#e63232] text-[9px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="
                relative rounded-md p-2 text-white
                transition-all duration-200
                hover:bg-white/10 hover:text-[#e63232]
              "
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute right-[2px] top-[2px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#e63232] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE (hover dropdown) */}
            <div
              className="relative"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <button
                onClick={handleProfileIconClick}
                aria-label="Account"
                className="
                  rounded-md p-2 text-white
                  transition-all duration-200
                  hover:bg-white/10 hover:text-[#e63232]
                "
              >
                <FaUser />
              </button>

              {profileMenuOpen && (
                <div
                  className="
                    absolute right-0 top-full mt-1 w-56
                    bg-white text-black
                    shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                    z-[220] overflow-hidden
                  "
                  style={{ animation: "profileMenu 0.15s ease forwards" }}
                >
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-5 py-3 text-sm font-medium text-[#111] hover:bg-gray-50"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-5 py-3 text-sm font-medium text-[#111] hover:bg-gray-50"
                      >
                        Wishlist
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-5 py-3 text-sm font-medium text-[#111] hover:bg-gray-50"
                      >
                        My Cart
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-5 py-3 text-sm font-semibold text-white bg-black hover:bg-gray-800 text-center"
                      >
                        LOGIN
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-5 py-3 text-sm font-semibold text-[#111] border-t border-gray-200 hover:bg-gray-50 text-center"
                      >
                        JOIN US
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
              aria-label="Menu"
              className="
                ml-1 rounded-md p-2 text-white
                transition-all duration-200
                hover:bg-white/10
                md:hidden
              "
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* ───────────────── MOBILE MENU ───────────────── */}
        <div
          className={`
            overflow-y-auto bg-[#102823]
            transition-all duration-300 md:hidden
            ${mobileOpen ? "max-h-[calc(100vh-102px)]" : "max-h-0"}
          `}
        >
          {navLinks.map((link) => (
            <div key={link.label} className="border-b border-white/10">
              {link.items ? (
                <>
                  <button
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === link.label ? null : link.label
                      )
                    }
                    className="
                      flex w-full items-center justify-between
                      px-6 py-4
                      text-left text-[0.72rem]
                      font-bold tracking-[0.14em]
                      text-white
                    "
                  >
                    {link.label}
                    <span
                      className={`transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""
                        }`}
                    >
                      ▼
                    </span>
                  </button>

                  {mobileExpanded === link.label && (
                    <div className="space-y-3 px-6 pb-5">
                      <Link
                        to={link.to}
                        onClick={closeMobile}
                        className="block text-sm font-semibold text-white hover:text-[#e63232]"
                      >
                        View all
                      </Link>
                      {link.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={closeMobile}
                          className="
                            block text-sm text-white/70
                            transition-all duration-200
                            hover:translate-x-1
                            hover:text-[#e63232]
                          "
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.to}
                  onClick={closeMobile}
                  className="
                    block px-6 py-4
                    text-[0.72rem] font-bold tracking-[0.14em]
                    text-white hover:text-[#e63232]
                  "
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ───────────────── MEGA MENU (desktop) ───────────────── */}
      {activeLink && activeLink.items && (
        <div
          className="
            fixed left-0 right-0 z-[190] hidden md:block
            bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]
          "
          style={{
            top: scrolled ? 58 : 102,
            animation: "megaMenu 0.18s ease forwards",
          }}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mx-auto max-w-[1280px] px-10 py-9">
            <div className="mb-5 flex items-baseline justify-between border-b border-[#ddd] pb-3">
              <h4 className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#111]">
                {activeLink.label}
              </h4>
              <Link
                to={activeLink.to}
                onClick={() => setActiveMenu(null)}
                className="text-[0.75rem] font-semibold text-[#111] underline-offset-4 hover:text-[#e63232] hover:underline"
              >
                View all
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-x-10 gap-y-4 md:grid-cols-3">
              {activeLink.items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setActiveMenu(null)}
                    className="
                      group inline-flex items-center
                      text-[0.88rem] text-[#555]
                      transition-all duration-200
                      hover:translate-x-1
                      hover:text-[#e63232]
                    "
                  >
                    {item.label}
                    <span
                      className="
                        ml-1 -translate-x-1 opacity-0
                        transition-all duration-200
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ───────────────── SEARCH OVERLAY (own component) ───────────────── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* SPACER */}
      <div className={`${scrolled ? "h-[58px]" : "h-[102px]"}`} />
    </>
  );
}