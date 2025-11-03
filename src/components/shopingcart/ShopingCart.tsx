import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../../api/cartApi";
import { getProductById } from "../../api/productApi";
import CartList from "./CartList";
import CartSummary from "./CartSummary";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  // ✅ Fetch cart
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data: cart } = await getCart();

      if (!cart || cart.length === 0) {
        setCartItems([]);
        return;
      }

      const products = await Promise.allSettled(
        cart.map((item: any) => getProductById(item.productId))
      );

      const merged = cart.map((item: any, i: number) => ({
        ...item,
        id: String(item.id),
        product:
          products[i].status === "fulfilled"
            ? products[i].value
            : { name: "Unknown", price: 0, stock: 0 },
      }));

      setCartItems(merged);
      setSelectedItems([]);
    } catch (error) {
      toast.error("⚠️ Failed to load cart!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ Update quantity
  const updateQuantity = async (id: string, change: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);
    if (newQty === item.quantity) return;

    setUpdating(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );

    try {
      await updateCartItem(id, newQty);
      toast.success("✅ Quantity updated!");
    } catch {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
      );
      toast.error("❌ Error updating quantity!");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Remove item
  const removeItem = async (id: string) => {
    const prev = [...cartItems];
    setCartItems((c) => c.filter((i) => i.id !== id));
    setSelectedItems((s) => s.filter((sid) => sid !== id));

    try {
      await deleteCartItem(id);
      toast.success("🗑️ Item removed!");
    } catch {
      setCartItems(prev);
      toast.error("❌ Error removing item!");
    }
  };

  // ✅ Clear all
  const removeAll = async () => {
    if (cartItems.length === 0) return;
    setClearing(true);
    const prev = [...cartItems];
    setCartItems([]);
    setSelectedItems([]);

    try {
      await clearCart();
      toast.success("🧹 Cart cleared!");
    } catch {
      setCartItems(prev);
      toast.error("❌ Error clearing cart!");
    } finally {
      setClearing(false);
    }
  };

  // ✅ Select toggle
  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Select all
  const toggleSelectAll = () => {
    const validIds = cartItems
      .filter((i) => i.product?.stock > 0 && i.quantity <= i.product.stock)
      .map((i) => String(i.id));

    setSelectedItems((prev) =>
      validIds.every((id) => prev.includes(id)) ? [] : validIds
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* 🧱 Layout:
            - Mobile/Tablet: hiển thị liền khối (1 cột)
            - Desktop (≥lg): chia 2 khối (CartList + CartSummary) */}
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
