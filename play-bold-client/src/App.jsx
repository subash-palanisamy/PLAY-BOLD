import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProfileProvider } from "./context/ProfileContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import Home from "./pages/Home/Home";
import About from "./components/About";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import CategoryListing from "./pages/CategoryListing/CategoryListing";
import NewListing from "./pages/NewListing/NewListing";
import SaleListing from "./pages/SaleListing/SaleListing";
import CollectionListing from "./pages/CollectionListing/CollectionListing";
import ProductDetails from "./pages/Product/ProductDetails";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Profile/Profile";
import OrderDetails from "./pages/Profile/OrderDetails";
import LostTempleCollection from "./pages/LostTempleCollection/LostTempleCollection";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import Orders from "./pages/Orders/Orders";
import NotFound from "./pages/NotFound/NotFound";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ProfileProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              <BrowserRouter>
                <ScrollToTop>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />

                    {/* Navbar direct links */}
                    <Route path="/new" element={<NewListing />} />
                    <Route path="/sale" element={<SaleListing />} />
                    <Route path="/collections" element={<CollectionListing />} />
                    <Route path="/collections/:collection" element={<CollectionListing />} />

                    <Route path="/:gender/shoes" element={<CategoryPage />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/lost-temple-collection" element={<LostTempleCollection />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/orders" element={<Orders />} />

                    <Route path="/:gender/:sport" element={<CategoryListing />} />
                    <Route path="/:gender/:sport/:collection/:slug" element={<ProductDetails />} />
                    <Route path="/:gender/:sport/:slug" element={<ProductDetails />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ScrollToTop>
              </BrowserRouter>
            </OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </ProfileProvider>
    </GoogleOAuthProvider>
  );
}

export default App;