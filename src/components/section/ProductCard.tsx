import React, { useState, useCallback, useEffect } from "react";
import { Heart, ShoppingBag, Share2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { addToCart } from "../../api/cartApi";

interface Product {
  id: number;
  title: string;
  img: string;
  salePrice?: number;
  regularPrice?: number;
  stock?: number;
}

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id, title, img, salePrice, regularPrice, stock = 0 } = data;

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

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = stored.some((item: any) => item.id === id);
      setIsWishlisted(exists);
    } catch {}
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (loading || isOutOfStock) return;
    setLoading(true);
    try {
      await addToCart(id, 1);
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  }, [id, loading, isOutOfStock]);

  const handleToggleWishlist = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = stored.find((item: any) => item.id === id);
      if (exists) {
        const updated = stored.filter((item: any) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(false);
        toast("Removed from wishlist 💔");
      } else {
        const updated = [...stored, { id, title, img, price }];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(true);
        toast.success("Added to wishlist 💕");
      }
    } catch {
      toast.error("Wishlist update failed.");
    }
  }, [id, title, img, price]);

  const handleShare = useCallback(() => {
    const productUrl = `${window.location.origin}/product/${id}`;
    navigator.clipboard
      .writeText(productUrl)
      .then(() => toast.success("Product link copied 📋"))
      .catch(() => toast.error("Failed to copy link."));
  }, [id]);

  return (
    <div
      className={`group flex flex-col h-full bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* IMAGE */}
      <NavLink
        to={`/product/${id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-gray-50"
      >
        <img
          src={img}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          } ${isOutOfStock ? "grayscale-[40%]" : ""}`}
        />

        {/* DISCOUNT BADGE */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
            -{discountPercent}%
          </span>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* ❤️ WISHLIST */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleWishlist();
          }}
          className={`absolute top-3 right-3 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border backdrop-blur-md shadow-md transition-all cursor-pointer
            ${
              isWishlisted
                ? "text-red-500 bg-white/40 border-white/70"
                : "text-white bg-black/30 border-white/40 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500"
            }
            ${
              isMobile ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
            }
          `}
        >
          <Heart size={18} className={isWishlisted ? "fill-red-500" : ""} />
        </button>

        {/* 🛒 + 🔗 Buttons */}
        {!isMobile && (
          <div
            className={`absolute top-16 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            {[
              { icon: <ShoppingBag size={18} />, onClick: handleAddToCart },
              { icon: <Share2 size={18} />, onClick: handleShare },
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  btn.onClick(e);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full
                  bg-black/30 text-white border border-white/40 backdrop-blur-md
                  hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500
                  transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                {btn.icon}
              </button>
            ))}
          </div>
        )}
      </NavLink>

      {/* INFO */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <NavLink to={`/product/${id}`}>
          <h3
            title={title}
            className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 
    group-hover:text-orange-600 mb-2 leading-snug 
    line-clamp-2 overflow-hidden break-normal whitespace-normal min-h-[3.2rem]"
          >
            {title}
          </h3>
        </NavLink>

        {/* PRICE — responsive and non-breaking */}
        <div className="flex flex-wrap sm:flex-nowrap items-baseline gap-2 mb-2 text-center sm:text-left">
          <span className="font-bold text-base sm:text-lg text-orange-600 whitespace-nowrap">
            {formatVND(price)}
          </span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-xs sm:text-sm whitespace-nowrap">
              {formatVND(oldPrice)}
            </span>
          )}
        </div>

        {/* STOCK */}
        <div className="min-h-[20px] mb-3 sm:mb-4">
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

        {/* Mobile Add to Cart */}
        {isMobile && (
          <Button
            onClick={handleAddToCart}
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
