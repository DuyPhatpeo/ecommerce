import { ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import CartItem from "./CartItem";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import Checkbox from "../ui/Checkbox";

interface ProductType {
  id: string;
  title: string;
  image: string;
  price?: number;
  salePrice?: number;
  stock: number;
}

interface CartItemType {
  id: string;
  productid: string;
  quantity: number;
  product: ProductType;
}

interface CartListProps {
  cartItems: CartItemType[];
  selectedItems: string[];
  loading: boolean;
  updating: string | null;
  updateQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (validIds: string[]) => void;
  clearAll: () => void;
  clearing: boolean;
}

export default function CartList({
  cartItems,
  selectedItems,
  loading,
  updating,
  updateQuantity,
  removeItem,
  toggleSelect,
  toggleSelectAll,
  clearAll,
  clearing,
}: CartListProps) {
  const validItems = cartItems.filter(
    (item) => item.product?.stock > 0 && item.quantity <= item.product?.stock
  );
  const validIds = validItems.map((item) => item.id);

  const allValidSelected =
    validIds.length > 0 &&
    validIds.every((id) => selectedItems.includes(id)) &&
    selectedItems.length === validIds.length;

  const outOfStockItems = cartItems.filter((item) => item.product?.stock === 0);

  const handleSelectAll = () => {
    if (allValidSelected) {
      toggleSelectAll([]);
    } else {
      toggleSelectAll(validIds);
      const invalidCount = cartItems.length - validIds.length;
      if (invalidCount > 0) {
        toast.error(
          `${invalidCount} item(s) cannot be selected (out of stock or exceeds stock quantity)`
        );
      }
    }
  };

  const sortedCartItems = [...cartItems].sort((a, b) => {
    const aOut = a.product?.stock === 0 || a.quantity > a.product?.stock;
    const bOut = b.product?.stock === 0 || b.quantity > b.product?.stock;
    return aOut === bOut ? 0 : aOut ? 1 : -1;
  });

  return (
    <div className="lg:col-span-2">
      <div className="bg-white border border-orange-100 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between border-b border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-6 pb-5 relative text-white rounded-t-3xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
          <div className="relative flex items-center gap-3">
            <div className="bg-white/25 p-2.5 rounded-2xl shadow-inner">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Cart</h2>
              <p className="text-orange-50/80 text-sm">
                Manage your products and quantities
              </p>
            </div>
          </div>
        </div>

        {/* ===== CONTROL BAR ===== */}
        {!loading && cartItems.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50/30">
            <div className="flex items-center gap-2">
              <Checkbox
                label="Select all"
                checked={allValidSelected}
                onChange={handleSelectAll}
                disabled={validIds.length === 0}
              />
            </div>
            <Button
              onClick={clearAll}
              disabled={clearing || cartItems.length === 0}
              icon={<Trash2 className="w-4 h-4" />}
              label={clearing ? "Clearing..." : "Clear all"}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                clearing
                  ? "bg-gray-100 text-gray-500 cursor-wait"
                  : "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:shadow-md hover:text-red-700"
              }`}
            />
          </div>
        )}

        {/* ===== BODY ===== */}
        <div className="bg-white">
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg font-medium">
                Loading your cart...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="p-20 text-center">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShoppingBag className="w-16 h-16 text-orange-400" />
              </div>
              <p className="text-gray-700 text-xl font-semibold mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-500">
                Add some items to your cart to get started.
              </p>
            </div>
          ) : outOfStockItems.length === cartItems.length ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-yellow-50 border border-yellow-200 rounded-full flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-2">
                All products are out of stock!
              </p>
              <p className="text-gray-500">
                Please remove them or check back later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-orange-50">
              {sortedCartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  updating={updating}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  toggleSelect={toggleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
