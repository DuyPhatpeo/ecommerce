import React, { useState, useCallback } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { id, title, img, salePrice, regularPrice, stock = 0 } = data;

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

  const handleToggleWishlist = () => setIsWishlisted(!isWishlisted);

  const handleAdd = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (isOutOfStock || loading) return;

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(`Added "${title}" to cart!`);
      }, 1000);
    },
    [title, loading, isOutOfStock]
  );

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="group relative w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[280px] mx-auto cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-[24px] p-3 sm:p-4 shadow-xl border border-white/50 overflow-hidden transition-all duration-500 hover:shadow-2xl">
        {hasDiscount && discountPercent > 0 && (
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            -{discountPercent}%
          </div>
        )}

        <div className="relative w-full aspect-[3/4] mb-3 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
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

        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-bold text-gray-800 leading-tight truncate">
            {title}
          </h3>

          <div className="flex flex-col gap-1">
            <span className="text-lg md:text-xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {formatVND(price)}
            </span>

            {/* Giữ chiều cao cố định để không lệch layout */}
            <span
              className={`text-xs text-gray-400 line-through transition-opacity duration-200 ${
                oldPrice ? "opacity-100" : "opacity-0"
              }`}
            >
              {oldPrice ? formatVND(oldPrice) : "placeholder"}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={handleAdd}
              disabled={isOutOfStock || loading}
              icon={<ShoppingBag size={14} className="w-4 h-4" />}
              label={loading ? "Adding..." : "Add to Cart"}
              className={`flex-1 gap-2 px-4 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300
                ${
                  isOutOfStock || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95"
                }`}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleWishlist();
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-md transition-all duration-300 hover:scale-110 active:scale-95 ${
                isWishlisted ? "bg-red-100" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <Heart
                size={20}
                strokeWidth={2.5}
                className={
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
