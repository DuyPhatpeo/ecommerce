import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const ShoppingCartPage = lazy(() => import("../pages/ShopingCartPage"));
const CheckOutPage = lazy(() => import("../pages/CheckOutPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const ShopPage = lazy(() => import("../pages/ShopPage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/shop" element={<ShopPage />} />

        {/* Bắt route không tồn tại */}
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
