"use client";

import React, { useCallback, useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../stores/cartStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import Button from "../ui/Button";

interface Product {
  id: string;
  title: string;
  img: string;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
  category?: string;
  colors?: string[];
}

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [loading, setLoading] = useState(false);

  const { id, title, img, images, salePrice, regularPrice, stock = 0, category = "Giày Nam", colors } = data;

  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const checkWishlistStatus = useWishlistStore((state) => state.checkWishlistStatus);
  const wishlistLoading = useWishlistStore((state) => state.loading[id]);

  useEffect(() => {
    checkWishlistStatus(id);
  }, [id, checkWishlistStatus]);

  const hasDiscount = !!salePrice && !!regularPrice && salePrice < regularPrice;
  const price = hasDiscount ? salePrice! : (regularPrice ?? 0);
  const oldPrice = hasDiscount ? regularPrice : undefined;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice! - price) / oldPrice!) * 100)
    : 0;

  const isOutOfStock = stock === 0;

  const formatVND = useCallback(
    (v: number) =>
      v.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const handleAdd = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (isOutOfStock || loading) return;

      setLoading(true);
      const firstImage = images?.[0] || img;

      await addItemToCart({
        id,
        title,
        stock,
        quantity: 1,
        price,
        images: [firstImage],
        navigate,
      });

      setLoading(false);
    },
    [id, title, stock, price, images, img, addItemToCart, loading, isOutOfStock, navigate]
  );

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  }, [id, toggleWishlist]);

  return (
    <div
      className="group relative w-full flex flex-col cursor-pointer bg-white"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-[#f6f6f6] flex items-center justify-center p-6 overflow-hidden">
        {/* Discount Badge */}
        {hasDiscount && discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-white border border-gray-200 text-black text-xs font-bold px-2 py-1 shadow-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          aria-label="Thêm vào danh sách yêu thích"
          className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/0 hover:bg-white transition-colors duration-200 ${
            wishlistLoading ? "opacity-50 cursor-wait" : ""
          }`}
        >
          <FiHeart
            size={18}
            strokeWidth={2}
            className={`transition-colors ${isWishlisted ? "fill-black text-black" : "text-gray-900"}`}
          />
        </button>

        <img
          src={img}
          alt={title}
          className={`w-full h-full object-contain mix-blend-multiply ${
            isOutOfStock ? "grayscale opacity-60" : ""
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/40 backdrop-blur-[2px]">
            <span className="px-4 py-2 bg-black text-white font-bold text-xs uppercase tracking-widest">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-bold text-lg text-black line-clamp-1">{title}</h3>
          <p className="text-[15px] text-gray-500 mt-0.5">{category}</p>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-black">{formatVND(price)}</span>
          {oldPrice && (
            <span className="text-[13px] text-gray-400 line-through">{formatVND(oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
