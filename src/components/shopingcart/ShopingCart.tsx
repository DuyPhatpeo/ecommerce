import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data: cart } = await getCart();
      const products = await Promise.all(
        cart.map((item: any) => getProductById(item.productId))
      );
      const merged = cart.map((item: any, i: number) => ({
        ...item,
        product: products[i],
      }));
      setCartItems(merged);
      setSelectedItems([]);
    } catch {
      toast.error("Failed to load cart!");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, change: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + change);
    if (newQty === item.quantity) return;

    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
    setUpdating(id);

    try {
      await updateCartItem(id, newQty);
      toast.success("Quantity updated!");
    } catch {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
      );
      toast.error("Error updating quantity!");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (id: number) => {
    const prev = [...cartItems];
    setCartItems((c) => c.filter((i) => i.id !== id));
    setSelectedItems((s) => s.filter((sid) => sid !== id));

    try {
      await deleteCartItem(id);
      toast.success("Item removed!");
    } catch {
      setCartItems(prev);
      toast.error("Error removing item!");
    }
  };

  const removeAll = async () => {
    if (cartItems.length === 0) return;
    setClearing(true);
    const prev = [...cartItems];
    setCartItems([]);
    setSelectedItems([]);
    try {
      await clearCart();
      toast.success("Cart cleared!");
    } catch {
      setCartItems(prev);
      toast.error("Error clearing cart!");
    } finally {
      setClearing(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    // ✅ Chỉ chọn sản phẩm còn hàng và quantity <= stock
    const validIds = cartItems
      .filter((i) => i.product.stock > 0 && i.quantity <= i.product.stock)
      .map((i) => i.id);

    if (validIds.every((id) => selectedItems.includes(id))) {
      setSelectedItems([]); // bỏ chọn tất cả
    } else {
      setSelectedItems(validIds); // chọn tất cả hợp lệ
    }
  };

  // ✅ Lọc các sản phẩm hợp lệ đã chọn để tính subtotal
  const validSelectedItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.product.stock > 0 &&
      item.quantity <= item.product.stock
  );

  const subtotal = validSelectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
                <ShoppingBag className="w-10 h-10 text-black" />
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
        <div className="grid lg:grid-cols-3 gap-6">
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
