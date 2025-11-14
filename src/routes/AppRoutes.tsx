import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Loader from "../components/general/Loader";

// ✅ Lazy load pages
const HomePage = lazy(() => import("../pages/HomePage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const ShoppingCartPage = lazy(() => import("../pages/ShoppingCartPage"));
const CheckOutPage = lazy(() => import("../pages/CheckOutPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const ShopPage = lazy(() => import("../pages/ShopPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const AccountPage = lazy(() => import("../pages/AccountPage"));
const OrderDetailPage = lazy(() => import("../pages/OrderDetailPage"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// ✅ Auto scroll to top when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<Loader />}>
      <ScrollToTop />
      <Routes location={location}>
        {/* Main pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Account */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/:tab" element={<AccountPage />} />
        <Route path="/account/order/:id" element={<OrderDetailPage />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
