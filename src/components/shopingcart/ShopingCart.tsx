import { useEffect, useState, useCallback } from "react";
import { ShoppingBag } from "lucide-react";
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
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
  const updateQuantity = async (id: number, change: number) => {
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
      // rollback
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
      );
      toast.error("❌ Error updating quantity!");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Remove item
  const removeItem = async (id: number) => {
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
  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Select all (only valid items)
  const toggleSelectAll = () => {
    const validIds = cartItems
      .filter((i) => i.product?.stock > 0 && i.quantity <= i.product.stock)
      .map((i) => i.id);

    setSelectedItems((prev) =>
      validIds.every((id) => prev.includes(id)) ? [] : validIds
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  Shopping Cart
                </h1>
                <p className="text-orange-100 text-sm">
                  Manage your selected items
                </p>
              </div>
            </div>

            <div className="bg-white text-orange-600 px-5 py-2.5 rounded-full font-bold shadow-lg whitespace-nowrap">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
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

          <CartSummary cartItems={cartItems} selectedItems={selectedItems} />
        </div>
      </div>
    </div>
  );
}
