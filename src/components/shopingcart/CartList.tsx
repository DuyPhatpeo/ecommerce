import { ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import CartItem from "./CartItem";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import Checkbox from "../ui/Checkbox";

interface ProductType {
  id: number;
  title: string;
  image: string;
  price?: number;
  salePrice?: number;
  stock: number;
}

interface CartItemType {
  id: number; // cart item id
  productId: number; // product id
  quantity: number;
  product: ProductType; // full product info
}

interface CartListProps {
  cartItems: CartItemType[];
  selectedItems: number[];
  loading: boolean;
  updating: number | null;
  updateQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: (validIds: number[]) => void;
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
  // ✅ Filter valid items (in stock and within stock limit)
  const validItems = cartItems.filter(
    (item) => item.product?.stock > 0 && item.quantity <= item.product?.stock
  );
  const validIds = validItems.map((item) => item.id);

  // ✅ "Select all" state
  const allValidSelected =
    validIds.length > 0 &&
    validIds.every((id) => selectedItems.includes(id)) &&
    selectedItems.length === validIds.length;

  // ✅ Out of stock items
  const outOfStockItems = cartItems.filter((item) => item.product?.stock === 0);

  // ✅ Handle select all valid items
  const handleSelectAll = () => {
    if (allValidSelected) {
      toggleSelectAll([]); // Deselect all
    } else {
      toggleSelectAll(validIds); // Select valid items
      const invalidCount = cartItems.length - validIds.length;
      if (invalidCount > 0) {
        toast.error(
          `${invalidCount} items cannot be selected (out of stock or exceed available quantity)`
        );
      }
    }
  };

  // ✅ Sort: in-stock items first
  const sortedCartItems = [...cartItems].sort((a, b) => {
    const aOut = a.product?.stock === 0 || a.quantity > a.product?.stock;
    const bOut = b.product?.stock === 0 || b.quantity > b.product?.stock;
    return aOut === bOut ? 0 : aOut ? 1 : -1;
  });

  // ✅ Valid selected items
  const selectedValidItems = validItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  // ✅ Calculate total
  const totalSelected = selectedValidItems.reduce((sum, item) => {
    const unit = item.product?.salePrice ?? item.product?.price ?? 0;
    return sum + unit * item.quantity;
  }, 0);

  // ✅ Format price
  const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")} đ`;

  return (
    <div className="lg:col-span-2">
      {/* ===== HEADER ===== */}
      {!loading && cartItems.length > 0 && (
        <div className="bg-white px-6 py-4 flex flex-wrap items-center justify-between border-b-2 border-orange-200 gap-3">
          <div className="flex items-center gap-3">
            <Checkbox
              label="Select All"
              checked={allValidSelected}
              onChange={handleSelectAll}
              disabled={validIds.length === 0}
            />
            <span className="text-gray-800 font-semibold select-none">
              Select all valid items
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
              {selectedItems.length} selected
            </span>

            <Button
              onClick={clearAll}
              disabled={clearing || cartItems.length === 0}
              icon={<Trash2 className="w-4 h-4" />}
              label={clearing ? "Clearing..." : "Clear All"}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                clearing
                  ? "bg-gray-200 text-gray-500 cursor-wait"
                  : "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              }`}
            />
          </div>
        </div>
      )}

      {/* ===== BODY ===== */}
      <div className="bg-white shadow-2xl rounded-b-3xl overflow-hidden">
        {/* 🌀 Loading */}
        {loading && (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg font-medium">
              Loading your cart...
            </p>
          </div>
        )}

        {/* 🛒 Empty */}
        {!loading && cartItems.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag className="w-16 h-16 text-orange-400" />
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">
              Your cart is empty
            </p>
            <p className="text-gray-500">Start adding items to your cart!</p>
          </div>
        )}

        {/* ⚠️ All out of stock */}
        {!loading &&
          cartItems.length > 0 &&
          outOfStockItems.length === cartItems.length && (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-2">
                All items in your cart are out of stock!
              </p>
              <p className="text-gray-500">
                Please remove them or check again later.
              </p>
            </div>
          )}

        {/* 🧾 Product list */}
        {!loading && cartItems.length > 0 && (
          <div className="divide-y divide-gray-100">
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

      {/* ✅ Total */}
      {selectedValidItems.length > 0 && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow flex justify-between items-center border border-orange-200">
          <p className="text-gray-700 font-medium">
            Selected:{" "}
            <span className="font-semibold text-orange-600">
              {selectedValidItems.length} item(s)
            </span>
          </p>
          <p className="text-gray-800 text-lg font-bold">
            Total:{" "}
            <span className="text-orange-600">
              {formatPrice(totalSelected)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
