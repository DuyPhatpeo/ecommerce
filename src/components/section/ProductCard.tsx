import React, { useState, useCallback, useEffect } from "react";
import { Heart, ShoppingBag, Share2, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const { id, title, img, salePrice, regularPrice, stock = 0 } = data;

  // ✅ Ưu tiên salePrice nếu có, ngược lại dùng regularPrice
  const price = salePrice ?? regularPrice ?? 0;

  // ✅ Chỉ hiển thị oldPrice nếu có giảm thật
  const oldPrice =
    salePrice && regularPrice && regularPrice > salePrice
      ? regularPrice
      : undefined;

  const isOutOfStock = stock === 0;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // 💰 Format tiền VNĐ
  const formatVND = useCallback(
    (value: number) =>
      value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check wishlist
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = stored.some((item: any) => item.id === id);
      setIsWishlisted(exists);
    } catch (error) {
      console.error("Error reading wishlist:", error);
    }
  }, [id]);

  // 🛒 Custom toast
  const showCartToast = useCallback(
    (imageUrl: string, productTitle: string, productPrice: number) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 p-3 w-full max-w-sm bg-white shadow-lg rounded-xl transition-all duration-300 ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            <img
              src={imageUrl}
              alt={productTitle}
              className="w-14 h-14 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                {productTitle}
              </p>
              <p className="text-xs text-gray-600">
                Added <span className="font-semibold text-orange-500">1</span>{" "}
                item
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {productPrice > 0 ? formatVND(productPrice) : "Liên hệ"}
              </p>
              <Button
                label="View Cart"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/cart");
                }}
                className="mt-2 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg transition"
              />
            </div>
            <Button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              icon={<X size={16} />}
              aria-label="Close"
            />
          </div>
        ),
        { duration: 3000, position: "top-right" }
      );
    },
    [navigate, formatVND]
  );

  // 🧡 Add to cart
  const handleAddToCart = useCallback(async () => {
    if (loading || isOutOfStock) return;
    setLoading(true);
    try {
      await addToCart(id, 1);
      showCartToast(img, title, price);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, img, title, price, loading, isOutOfStock, showCartToast]);

  // ❤️ Wishlist
  const handleToggleWishlist = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = stored.find((item: any) => item.id === id);
      if (exists) {
        const updated = stored.filter((item: any) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(false);
        toast("Removed from wishlist 💔", {
          icon: "💔",
          style: { background: "#fee", color: "#333" },
        });
      } else {
        const updated = [...stored, { id, title, img, price }];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsWishlisted(true);
        toast.success("Added to wishlist 💕", { icon: "💕" });
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist.");
    }
  }, [id, title, img, price]);

  // 🔗 Share
  const handleShare = useCallback(async () => {
    const productUrl = `${window.location.origin}/product/${id}`;
    const shareData = {
      title,
      text: `Check out this product: ${title}`,
      url: productUrl,
    };
    try {
      if (navigator.share && isMobile) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(productUrl);
        toast.success("Product link copied to clipboard!", { icon: "📋" });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Share error:", error);
        toast.error("Failed to share. Please try again.");
      }
    }
  }, [id, title, isMobile]);

  // 🎯 Icons
  const icons = [
    {
      id: "cart",
      icon: <ShoppingBag size={16} />,
      label: "Add to cart",
      action: handleAddToCart,
      disabled: isOutOfStock || loading,
    },
    {
      id: "wishlist",
      icon: isWishlisted ? (
        <Heart className="text-red-500 fill-red-500" size={16} />
      ) : (
        <Heart size={16} />
      ),
      label: isWishlisted ? "Remove from wishlist" : "Add to wishlist",
      action: handleToggleWishlist,
      disabled: false,
    },
    {
      id: "share",
      icon: <Share2 size={16} />,
      label: "Share",
      action: handleShare,
      disabled: false,
    },
  ];

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 overflow-hidden ${
        isOutOfStock ? "opacity-90" : ""
      }`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Product image */}
      <NavLink to={`/product/${id}`} className="block relative overflow-hidden">
        <div className="relative w-full aspect-[3/4] bg-gray-50">
          <img
            src={img}
            alt={title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered && !isMobile ? "scale-110" : "scale-100"
            } ${isOutOfStock ? "grayscale-[30%]" : ""}`}
          />

          {/* Out of stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <p className="text-gray-800 font-bold text-xs sm:text-sm">
                  OUT OF STOCK
                </p>
              </div>
            </div>
          )}

          {/* Discount badge */}
          {discountPercent > 0 && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              -{discountPercent}%
            </div>
          )}

          {/* Action buttons - Desktop */}
          {!isMobile && (
            <div
              className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-500 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-6"
              }`}
            >
              {icons.map((item, idx) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredIcon(item.id)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <Button
                    icon={item.icon}
                    aria-label={item.label}
                    disabled={item.disabled}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.disabled) {
                        if (isOutOfStock) {
                          toast.error("This product is out of stock!");
                        }
                        return;
                      }
                      item.action?.();
                    }}
                    className={`w-8 h-8 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                      item.disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                        : hoveredIcon === item.id
                        ? "bg-orange-500 text-white scale-110 shadow-lg"
                        : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-orange-500 hover:text-white"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action buttons - Mobile */}
          {isMobile && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-3 pt-8">
              <div className="flex items-center justify-center gap-3">
                {icons.map((item) => (
                  <Button
                    key={item.id}
                    icon={item.icon}
                    aria-label={item.label}
                    disabled={item.disabled}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.disabled) {
                        if (isOutOfStock) {
                          toast.error("This product is out of stock!");
                        }
                        return;
                      }
                      item.action?.();
                    }}
                    className={`w-10 h-10 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
                      item.disabled
                        ? "bg-gray-400/80 text-gray-200 cursor-not-allowed"
                        : item.id === "cart"
                        ? "bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-orange-500/50"
                        : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white active:scale-95"
                    } ${item.id === "cart" ? "scale-110" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </NavLink>

      {/* Product info */}
      <div className="p-4 flex flex-col">
        <h3
          title={title}
          className={`font-semibold text-sm sm:text-base leading-tight line-clamp-2 min-h-[38px] mb-2 transition-colors ${
            isOutOfStock
              ? "text-gray-500"
              : "text-gray-800 group-hover:text-orange-600"
          }`}
        >
          <NavLink to={`/product/${id}`}>{title}</NavLink>
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {price > 0 ? (
            <span
              className={`font-bold text-lg sm:text-xl ${
                isOutOfStock ? "text-gray-400" : "text-orange-600"
              }`}
            >
              {formatVND(price)}
            </span>
          ) : (
            <span className="text-gray-500 italic text-sm">Liên hệ</span>
          )}
          {oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {formatVND(oldPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="text-xs font-medium">
          {isOutOfStock ? (
            <span className="text-red-500 flex items-center gap-1">
              <span>⚠️</span> Out of stock
            </span>
          ) : stock <= 5 ? (
            <span className="text-yellow-600 flex items-center gap-1">
              <span>⚡</span> Only {stock} left
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              <span>✓</span> In stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
