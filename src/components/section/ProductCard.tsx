import React, { useState, useCallback } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useWishlist } from "../../hooks/useWishlist";
import Button from "../ui/Button";

interface Product {
  id: string;
  title: string;
  img: string;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
}

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const { handleAddToCart } = useAddToCart();
  const { id, title, img, images, salePrice, regularPrice, stock = 0 } = data;
  const { isWishlisted, handleToggleWishlist } = useWishlist(id);

  const hasDiscount = salePrice && regularPrice && salePrice < regularPrice;
  const price = hasDiscount ? salePrice! : regularPrice ?? 0;
  const oldPrice = hasDiscount ? regularPrice : undefined;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice! - price) / oldPrice!) * 100)
    : 0;
  const isOutOfStock = stock === 0;

  const formatVND = useCallback(
    (value: number) =>
      value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );

  const handleAdd = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (isOutOfStock || loading) return;

      const firstImage = images?.[0] || img;

      handleAddToCart({
        id,
        title,
        stock,
        quantity: 1,
        price,
        images: [firstImage],
        setLoading,
      });
    },
    [
      id,
      title,
      stock,
      price,
      images,
      img,
      handleAddToCart,
      loading,
      isOutOfStock,
    ]
  );

  return (
    <div className="group relative w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[280px] mx-auto">
      <NavLink to={`/product/${id}`}>
        <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-[24px] p-3 sm:p-4 shadow-xl border border-white/50 overflow-hidden transition-all duration-500 hover:shadow-2xl">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist();
            }}
            className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Heart
              size={18}
              className={`transition-all ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-400"
              }`}
            />
          </button>

          {/* Discount Badge */}
          {hasDiscount && discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{discountPercent}%
            </div>
          )}

          {/* Product Image */}
          <div className="relative w-full aspect-[3/4] mb-3 sm:mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={img}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isOutOfStock ? "grayscale opacity-60" : ""
              }`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-xl text-sm shadow-xl">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2 sm:space-y-2.5">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-tight line-clamp-2 min-h-[40px] sm:min-h-[44px] overflow-hidden">
              {title}
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pt-1">
              <div className="flex flex-col min-h-[48px] justify-center">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatVND(price)}
                </span>
                {oldPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatVND(oldPrice)}
                  </span>
                )}
              </div>

              {/* ✅ Custom Button */}
              <Button
                onClick={handleAdd}
                disabled={isOutOfStock || loading}
                icon={<ShoppingBag size={14} className="sm:w-4 sm:h-4" />}
                label={loading ? "Adding..." : "Cart"}
                className={`flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-lg w-full sm:w-auto
                  ${
                    isOutOfStock || loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                  }`}
              />
            </div>

            <div className="pt-0.5">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-red-500 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Out of stock
                </span>
              ) : stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                  Only {stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  In stock
                </span>
              )}
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default React.memo(ProductCard);
