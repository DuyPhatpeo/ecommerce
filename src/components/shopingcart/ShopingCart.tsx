import { useCartStore } from "../../stores/cartStore";
import { useEffect } from "react";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import Loader from "../general/Loader";

export default function ShoppingCart() {
  const cartItems = useCartStore((s) => s.cartItems);
  const selectedItems = useCartStore((s) => s.selectedItems);
  const loading = useCartStore((s) => s.loading);
  const updating = useCartStore((s) => s.updating);
  const clearing = useCartStore((s) => s.clearing);

  const fetchCart = useCartStore((s) => s.fetchCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const toggleSelect = useCartStore((s) => s.toggleSelect);
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);
  const removeAll = useCartStore((s) => s.removeAll);

  const userId = useCartStore((s) => s.userId);

  // Fetch khi vào trang
  useEffect(() => {
    if (userId) fetchCart();
  }, [userId, fetchCart]);

  // --- Full-screen loader khi lần đầu fetch ---
  if (loading && cartItems.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 relative">
      {/* --- Overlay loader khi updating hoặc clearing --- */}
      {(updating || clearing) && (
        <div className="absolute inset-0 bg-white/60 flex justify-center items-center z-10">
          <Loader />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          <div className="w-full lg:col-span-2">
            <CartList
              cartItems={cartItems}
              selectedItems={selectedItems}
              loading={loading}
              updating={updating}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              toggleSelect={toggleSelect}
              toggleSelectAll={toggleSelectAll}
              clearAll={removeAll}
              clearing={clearing}
            />
          </div>

          <div className="w-full">
            <CartSummary cartItems={cartItems} selectedItems={selectedItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
