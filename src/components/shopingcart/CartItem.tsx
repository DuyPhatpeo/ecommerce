import { Plus, Minus, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  status?: string;
  category?: string;
  images?: string[];
}

interface CartItemData {
  id: number;
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  selected: boolean;
  updating: number | null;
  updateQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
  toggleSelect: (id: number) => void;
}

export default function CartItem({
  item,
  selected,
  updating,
  updateQuantity,
  removeItem,
  toggleSelect,
}: CartItemProps) {
  const imageSrc =
    item.product?.images?.[0] || "https://via.placeholder.com/150";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const isOutOfStock =
    item.product?.status?.toLowerCase() === "outofstock" ||
    item.product?.stock === 0;

  const maxStock = item.product?.stock || 0;

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (item.quantity < maxStock) {
      updateQuantity(item.id, 1);
    } else {
      toast.error("You have reached the maximum stock quantity!");
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (item.quantity > 1) {
      updateQuantity(item.id, -1);
    }
  };

  const handleToggleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      toggleSelect(item.id);
    } else {
      toast.error("This product is out of stock and cannot be selected!");
    }
  };

  return (
    <div
      className={`p-3 sm:p-4 md:p-6 flex flex-col transition-all duration-200 border-b border-gray-100
        ${
          updating === item.id
            ? "opacity-60 cursor-wait"
            : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50"
        }
        ${selected ? "bg-orange-50 bg-opacity-50" : ""}
        ${isOutOfStock ? "opacity-70 grayscale" : ""}
      `}
    >
      {/* Top Section */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={selected}
            onChange={handleToggleSelect}
            disabled={isOutOfStock}
          />
        </div>

        {/* Product Image (clickable) */}
        <Link
          to={`/product/${item.product?.id}`}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 shadow shrink-0 hover:opacity-90 transition"
        >
          <img
            src={imageSrc}
            alt={item.product?.title}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link
              to={`/product/${item.product?.id}`}
              className="text-sm sm:text-base md:text-lg font-bold text-gray-800 line-clamp-2 flex-1 hover:text-orange-400 transition"
            >
              {item.product?.title}
            </Link>

            {item.product?.category && (
              <span className="hidden sm:inline-block text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full whitespace-nowrap">
                {item.product.category}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-red-600 font-semibold text-xs sm:text-sm mt-1">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Out of stock
            </div>
          ) : (
            <p className="text-orange-600 font-bold text-lg sm:text-xl md:text-2xl">
              {formatPrice(item.product?.price || 0)}
            </p>
          )}

          {/* Category on mobile */}
          {item.product?.category && (
            <span className="inline-block sm:hidden text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1">
              {item.product.category}
            </span>
          )}
        </div>

        {/* Delete Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            removeItem(item.id);
          }}
          icon={<Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />}
          className="text-red-500 hover:bg-red-50 p-2 sm:p-3 rounded-xl transition shrink-0"
        />
      </div>

      {/* Bottom Section: Quantity + Subtotal */}
      <div className="flex items-center justify-between mt-3 sm:mt-4 pl-8 sm:pl-10 md:pl-0 md:ml-0">
        <div
          className={`flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md ${
            isOutOfStock
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-gradient-to-br from-gray-50 to-gray-100"
          }`}
        >
          <Button
            onClick={handleDecrease}
            disabled={
              updating === item.id || isOutOfStock || item.quantity <= 1
            }
            icon={<Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />}
            className="bg-white hover:bg-orange-100 p-1.5 sm:p-2.5 rounded-lg disabled:opacity-50"
          />

          <span className="font-bold text-gray-800 w-8 sm:w-10 text-center text-base sm:text-lg select-none">
            {item.quantity}
          </span>

          <Button
            onClick={handleIncrease}
            disabled={
              updating === item.id || isOutOfStock || item.quantity >= maxStock
            }
            icon={<Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />}
            className="bg-white hover:bg-orange-100 p-1.5 sm:p-2.5 rounded-lg disabled:opacity-50"
          />
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">
            Subtotal
          </p>
          <p
            title={formatPrice((item.product?.price || 0) * item.quantity)}
            className={`font-bold text-base sm:text-lg md:text-xl ${
              isOutOfStock ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {formatPrice((item.product?.price || 0) * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
