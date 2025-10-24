import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const ShoppingCartPage = lazy(() => import("../pages/ShopingCartPage"));
const CheckOutPage = lazy(() => import("../pages/CheckOutPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const ShopPage = lazy(() => import("../pages/ShopPage"));
const SearchPage = lazy(() => import("../pages/SearchPage.tsx"));
const LoginPage = lazy(() => import("../pages/LoginPage.tsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.tsx"));
const ForgotPasswordPage = lazy(
  () => import("../pages/ForgotPasswordPage.tsx")
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
          Đang tải trang...
        </div>
      }
    >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl">
              404 - Trang không tồn tại 😢
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
