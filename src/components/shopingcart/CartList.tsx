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
  cartItems: (
    | CartItemType
    | { id: string; product?: ProductType; quantity: number }
  )[];
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
  // Map cartItems để đảm bảo có productid
  const formattedCartItems: CartItemType[] = cartItems.map((item) => ({
    ...item,
    productid: item.product?.id || "", // nếu không có product, để rỗng
    product: item.product || { id: "", title: "", image: "", stock: 0 },
  }));

  const validItems = formattedCartItems.filter(
    (item) => item.product.stock > 0 && item.quantity <= item.product.stock
  );
  const validIds = validItems.map((item) => item.id);

  const allValidSelected =
    validIds.length > 0 &&
    validIds.every((id) => selectedItems.includes(id)) &&
    selectedItems.length === validIds.length;

  const outOfStockItems = formattedCartItems.filter(
    (item) => item.product.stock === 0
  );

  const handleSelectAll = () => {
    if (allValidSelected) {
      toggleSelectAll([]);
    } else {
      toggleSelectAll(validIds);
      const invalidCount = formattedCartItems.length - validIds.length;
      if (invalidCount > 0) {
        toast.error(
          `${invalidCount} item(s) cannot be selected (out of stock or exceeds stock quantity)`
        );
      }
    }
  };

  const sortedCartItems = [...formattedCartItems].sort((a, b) => {
    const aOut = a.product.stock === 0 || a.quantity > a.product.stock;
    const bOut = b.product.stock === 0 || b.quantity > b.product.stock;
    return aOut === bOut ? 0 : aOut ? 1 : -1;
  });

  return (
    <div className="lg:col-span-2">
      <div className="bg-white border border-orange-100 rounded-3xl p-8 space-y-6 shadow-sm">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-orange-200 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-orange-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">Your Cart</h3>
          </div>
        </div>

        {/* CONTROL ROW */}
        {!loading && formattedCartItems.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-orange-100 pb-4">
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
              disabled={clearing || formattedCartItems.length === 0}
              icon={<Trash2 className="w-4 h-4" />}
              label={clearing ? "Clearing..." : "Clear all"}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 whitespace-nowrap ${
                clearing
                  ? "bg-gray-100 text-gray-400 cursor-wait"
                  : "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              }`}
            />
          </div>
        )}

        {/* BODY */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg font-medium">
                Loading cart...
              </p>
            </div>
          ) : formattedCartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShoppingBag className="w-14 h-14 text-orange-500" />
              </div>
              <p className="text-gray-800 text-xl font-semibold mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-500">
                Add some products to your cart to get started!
              </p>
            </div>
          ) : outOfStockItems.length === formattedCartItems.length ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
              </div>
              <p className="text-gray-800 text-lg font-semibold mb-2">
                All products are out of stock!
              </p>
              <p className="text-gray-500">
                Please remove or check back later.
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
