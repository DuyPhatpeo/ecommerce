import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Loader from "../components/layout/Loader";
import MainLayout from "../components/layout/MainLayout";

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
const ConfirmPaymentPage = lazy(() => import("../pages/ConfirmPaymentPage"));
const AboutUsPage = lazy(() => import("../pages/AboutUsPage"));
const FAQPage = lazy(() => import("../pages/FAQPage"));

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
        {/* Pages with Header + Footer layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/confirm-payment" element={<ConfirmPaymentPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Account */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/:tab" element={<AccountPage />} />
          <Route path="/account/order/:id" element={<OrderDetailPage />} />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth pages — no Header/Footer */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
