import React, { useCallback, useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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
}

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { id, title, img, images, salePrice, regularPrice, stock = 0 } = data;

  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const checkWishlistStatus = useWishlistStore(
    (state) => state.checkWishlistStatus,
  );
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
    [
      id,
      title,
      stock,
      price,
      images,
      img,
      addItemToCart,
      loading,
      isOutOfStock,
      navigate,
    ],
  );

  const handleToggleWishlist = useCallback(() => {
    toggleWishlist(id);
  }, [id, toggleWishlist]);

  return (
    <div
      className="group relative w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[280px] mx-auto cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200">
        {/* Discount Badge */}
        {hasDiscount && discountPercent > 0 && (
          <div className="absolute top-4 left-4 z-5 bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button — top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleWishlist();
          }}
          disabled={wishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-4 right-4 z-5 w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200
            ${isWishlisted ? "bg-red-50 text-red-500" : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-red-50"}
            ${wishlistLoading ? "opacity-50 cursor-wait" : ""}
            shadow-sm`}
        >
          <FiHeart
            size={16}
            strokeWidth={2.5}
            className={isWishlisted ? "fill-red-500" : ""}
          />
        </button>

        {/* Product Image */}
        <div className="relative w-full aspect-[3/4] mb-3 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? "grayscale opacity-60" : ""
            }`}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-4 py-1.5 bg-gray-900/80 text-white font-semibold text-xs rounded-lg uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Title & Price */}
        <div className="space-y-1.5 px-0.5">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
            {title}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-orange-500">
              {formatVND(price)}
            </span>

            {oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatVND(oldPrice)}
              </span>
            )}
          </div>

          {/* Add To Cart Button */}
          <Button
            onClick={handleAdd}
            disabled={isOutOfStock || loading}
            icon={<FiShoppingBag size={14} />}
            label={loading ? "Adding..." : "Add to Cart"}
            className={`w-full h-11 gap-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer
              ${
                isOutOfStock || loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-orange-500 active:scale-[0.98]"
              }`}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
