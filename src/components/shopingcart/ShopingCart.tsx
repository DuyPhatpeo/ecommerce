// src/pages/Cart/ShoppingCart.tsx
import { useCart } from "../../hooks/useCart";
import CartList from "./CartList";
import CartSummary from "./CartSummary";

export default function ShoppingCart() {
  const {
    cartItems,
    selectedItems,
    loading,
    updating,
    clearing,
    updateQuantity,
    removeItem,
    removeAll,
    toggleSelect,
    toggleSelectAll,
  } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Cart List */}
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

          {/* Cart Summary */}
          <div className="w-full">
            <CartSummary cartItems={cartItems} selectedItems={selectedItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
