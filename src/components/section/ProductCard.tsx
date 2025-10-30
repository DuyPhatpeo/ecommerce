import React, { useState, useCallback, useEffect, memo } from "react";
import { Heart, ShoppingBag, Share2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useWishlist } from "../../hooks/useWishlist";

interface Product {
  id: string;
  title: string;
  img: string;
  images?: string[];
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
}

/* ===============================
   🔹 Nút Desktop (hover hiện)
=============================== */
const DesktopButtons = memo(
  ({
    handleAddToCart,
    handleShare,
    loading,
    isOutOfStock,
  }: {
    handleAddToCart: (e?: React.MouseEvent) => void;
    handleShare: () => void;
    loading: boolean;
    isOutOfStock: boolean;
  }) => (
    <div className="absolute top-16 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
      {[
        {
          icon: <ShoppingBag size={18} />,
          onClick: handleAddToCart,
          label: "Add to cart",
          disabled: isOutOfStock || loading,
        },
        {
          icon: <Share2 size={18} />,
          onClick: handleShare,
          label: "Share",
        },
      ].map((btn, idx) => (
        <div key={idx} className="relative group/btn">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              btn.onClick(e);
            }}
            disabled={(btn as any).disabled}
            className="w-10 h-10 flex items-center justify-center rounded-full
              bg-black/30 text-white border border-white/40 backdrop-blur-md
              hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500
              transition-all hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {btn.icon}
          </button>
          <span
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100
              bg-black text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap
              shadow-lg transition-all duration-200 scale-95 group-hover/btn:scale-100"
          >
            {btn.label}
          </span>
        </div>
      ))}
    </div>
  )
);

/* ===============================
   🔹 Wishlist Button
=============================== */
const WishlistButton = memo(
  ({
    isWishlisted,
    handleToggleWishlist,
    isMobile,
  }: {
    isWishlisted: boolean;
    handleToggleWishlist: () => void;
    isMobile: boolean;
  }) => (
    <div
      className={`absolute top-3 right-3 transition-all duration-300 ${
        isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <div className="relative group/wish">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleWishlist();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-full border backdrop-blur-md shadow-md transition-all
            ${
              isWishlisted
                ? "text-red-500 bg-white/40 border-white/70"
                : "text-white bg-black/30 border-white/40 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500"
            }`}
        >
          <Heart size={18} className={isWishlisted ? "fill-red-500" : ""} />
        </button>
        <span
          className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/wish:opacity-100
            bg-black text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap
            shadow-lg transition-all duration-200 scale-95 group-hover/wish:scale-100"
        >
          {isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
        </span>
      </div>
    </div>
  )
);

/* ===============================
   🔹 Product Card chính
=============================== */
const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleAddToCart } = useAddToCart();
  const { id, title, img, images, salePrice, regularPrice, stock = 0 } = data;

  const price = salePrice ?? regularPrice ?? 0;
  const oldPrice =
    salePrice && regularPrice && regularPrice > salePrice
      ? regularPrice
      : undefined;
  const isOutOfStock = stock === 0;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const { isWishlisted, handleToggleWishlist } = useWishlist({
    id,
    title,
    img,
    price,
  });

  const formatVND = useCallback(
    (value: number) =>
      value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAdd = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
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

  const handleShare = useCallback(() => {
    const productUrl = `${window.location.origin}/product/${id}`;
    navigator.clipboard
      .writeText(productUrl)
      .then(() => toast.success("Product link copied 📋"))
      .catch(() => toast.error("Failed to copy link."));
  }, [id]);

  return (
    <div
      className="group flex flex-col h-full bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="relative block aspect-[3/4] overflow-hidden bg-gray-50">
        <NavLink to={`/product/${id}`}>
          <img
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-105" : "scale-100"
            } ${isOutOfStock ? "grayscale-[40%]" : ""}`}
          />

          {/* 🔹 Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
              -{discountPercent}%
            </span>
          )}

          {/* 🔹 Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm shadow">
                OUT OF STOCK
              </span>
            </div>
          )}

          <WishlistButton
            isWishlisted={isWishlisted}
            handleToggleWishlist={handleToggleWishlist}
            isMobile={isMobile}
          />

          {!isMobile && (
            <DesktopButtons
              handleAddToCart={handleAdd}
              handleShare={handleShare}
              loading={loading}
              isOutOfStock={isOutOfStock}
            />
          )}
        </NavLink>
      </div>

      {/* 🔹 Info section */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <NavLink to={`/product/${id}`}>
          <h3
            title={title}
            className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 leading-snug line-clamp-2 transition-all duration-300 min-h-[48px]"
          >
            {title}
          </h3>
        </NavLink>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-bold text-base sm:text-lg text-orange-600">
            {formatVND(price)}
          </span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {formatVND(oldPrice)}
            </span>
          )}
        </div>

        <div className="min-h-[20px] mb-4">
          {isOutOfStock ? (
            <span className="text-red-500 text-xs font-bold">Out of stock</span>
          ) : stock <= 5 ? (
            <span className="text-yellow-600 text-xs font-bold">
              Only {stock} left
            </span>
          ) : (
            <span className="text-green-600 text-xs font-bold">In stock</span>
          )}
        </div>

        {isMobile && (
          <Button
            onClick={handleAdd}
            disabled={isOutOfStock || loading}
            icon={<ShoppingBag size={18} />}
            label={loading ? "Adding..." : "Add to cart"}
            className={`mt-auto w-full py-3 sm:py-3.5 rounded-xl font-semibold shadow transition
              ${
                isOutOfStock || loading
                  ? "bg-gray-200 text-gray-400"
                  : "bg-gradient-to-br from-orange-500 to-red-500 text-white hover:opacity-90"
              }`}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
