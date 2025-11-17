import { Plus, Minus, Trash2, AlertTriangle, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";

interface Product {
  id: string;
  title: string;
  regularPrice?: number;
  salePrice?: number;
  stock: number;
  status?: string;
  category?: string;
  images?: string[];
}

interface CartItemData {
  id: string;
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  selected: boolean;
  updateQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  toggleSelect: (id: string) => void;
}

export default function CartItem({
  item,
  selected,
  updateQuantity,
  removeItem,
  toggleSelect,
}: CartItemProps) {
  const { product, quantity, id } = item;

  const imageSrc = product?.images?.[0] || "/placeholder.jpg";

  const hasDiscount =
    product?.salePrice &&
    product?.regularPrice &&
    product.salePrice < product.regularPrice;

  const displayPrice = hasDiscount
    ? product.salePrice!
    : product?.regularPrice ?? 0;

  const isOutOfStock =
    product?.status?.toLowerCase() === "outofstock" || product?.stock === 0;

  const maxStock = product?.stock || 0;

  const formatPrice = (n: number) =>
    `${new Intl.NumberFormat("vi-VN").format(n)} đ`;

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Product is out of stock!");
    if (quantity >= maxStock)
      return toast.warning(`Maximum stock available: ${maxStock}`);
    updateQuantity(id, 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Product is out of stock!");
    if (quantity <= 1)
      return toast.info("Minimum quantity is 1. Use delete to remove.");
    updateQuantity(id, -1);
  };

  const handleToggleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Cannot select out of stock items!");
    toggleSelect(id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(id);
  };

  return (
    <div
      className={`relative p-3 sm:p-4 border-b transition-all duration-200 ${
        selected
          ? "bg-orange-50/70 border-orange-200"
          : "bg-white border-gray-200"
      } ${isOutOfStock ? "opacity-70" : "hover:bg-gray-50/80 hover:shadow-sm"}`}
    >
      {/* Top Right Buttons */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {isOutOfStock && (
          <div className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="hidden sm:inline">OUT OF STOCK</span>
            <span className="sm:hidden">OOS</span>
          </div>
        )}

        {!isOutOfStock && (
          <Button
            onClick={handleRemove}
            icon={<Trash2 className="w-4 h-4" />}
            className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-md"
          />
        )}
      </div>

      <div className="flex gap-3 sm:gap-4">
        {/* Checkbox */}
        <div className="flex items-center">
          <Checkbox
            checked={selected}
            onChange={handleToggleSelect}
            disabled={isOutOfStock}
          />
        </div>

        {/* Image */}
        <Link
          to={`/product/${product?.id}`}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-lg self-center bg-gray-100 border-2 transition-all duration-200 ${
            isOutOfStock
              ? "grayscale border-gray-300"
              : "border-gray-200 hover:border-orange-300 hover:shadow-md"
          }`}
        >
          <img
            src={imageSrc}
            alt={product?.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0">
          {/* Title */}
          <div className="flex-1 pr-12 sm:pr-16">
            <Link
              to={`/product/${product?.id}`}
              className="block font-semibold text-gray-900 hover:text-orange-600 transition-colors mb-1.5 text-sm sm:text-base line-clamp-2 leading-tight"
              title={product?.title}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product?.title}
            </Link>

            {product?.category && (
              <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          {/* Price + Quantity */}
          <div className="flex items-center justify-between gap-3">
            {/* Price */}
            <div className="space-y-1">
              {isOutOfStock ? (
                <div className="flex items-center gap-1.5 text-red-600 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Out of stock</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-0.5">
                    {/* SALE PRICE ON TOP */}
                    <span className="font-bold text-orange-600 text-base sm:text-lg">
                      {formatPrice(displayPrice)}
                    </span>

                    {/* ORIGINAL PRICE BELOW */}
                    {hasDiscount && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        {formatPrice(product.regularPrice!)}
                      </span>
                    )}
                  </div>

                  {maxStock <= 5 && maxStock > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Package className="w-3 h-3" />
                      <span className="font-medium">Only {maxStock} left</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm hover:border-orange-300">
              <Button
                onClick={handleDecrease}
                disabled={isOutOfStock || quantity <= 1}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 ${
                  quantity <= 1
                    ? "bg-gray-100 opacity-40 cursor-not-allowed"
                    : "hover:bg-orange-50 active:bg-orange-100 active:scale-95"
                }`}
                icon={<Minus className="w-4 h-4 text-gray-700" />}
              />

              <span className="px-3 py-1.5 sm:px-4 sm:py-2 font-bold text-gray-900 bg-white text-sm sm:text-base text-center select-none">
                {quantity}
              </span>

              <Button
                onClick={handleIncrease}
                disabled={isOutOfStock || quantity >= maxStock}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 ${
                  quantity >= maxStock
                    ? "bg-gray-100 opacity-40 cursor-not-allowed"
                    : "hover:bg-orange-50 active:bg-orange-100 active:scale-95"
                }`}
                icon={<Plus className="w-4 h-4 text-gray-700" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
