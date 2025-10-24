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
  price: number;
  oldPrice?: number;
  stock?: number;
}

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  const { id, title, img, price, oldPrice, stock = 0 } = data;
  const isOutOfStock = stock === 0;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // 💰 Format to VNĐ
  const formatVND = (value: number) =>
    value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });

  // Check wishlist on load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = stored.some((item: any) => item.id === id);
    setIsWishlisted(exists);
  }, [id]);

  // 🛒 Custom toast for "added to cart"
  const showCartToast = useCallback(
    (imageUrl: string, title: string, price: number) => {
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
              alt={title}
              className="w-14 h-14 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                {title}
              </p>
              <p className="text-xs text-gray-600">
                Added <span className="font-semibold text-orange-500">1</span>{" "}
                item
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {formatVND(price)}
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
        { duration: 3000 }
      );
    },
    [navigate]
  );

  // 🧡 Add to cart
  const handleAddToCart = useCallback(async () => {
    if (loading || isOutOfStock) return;
    setLoading(true);
    try {
      await addToCart(id, 1);
      showCartToast(img, title, price);
    } catch {
      toast.error("Failed to add to cart!");
    } finally {
      setLoading(false);
    }
  }, [id, img, title, price, loading, isOutOfStock, showCartToast]);

  // ❤️ Wishlist
  const handleToggleWishlist = useCallback(() => {
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
  }, [id, title, img, price]);

  // 🔗 Share
  const handleShare = useCallback(async () => {
    const productUrl = `${window.location.origin}/product/${id}`;
    const shareData = {
      title,
      text: `Check out this product: ${title}`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch {
        toast.error("Share failed.");
      }
    } else {
      navigator.clipboard.writeText(productUrl);
      toast.success("Link copied!");
    }
  }, [id, title]);

  const icons = [
    {
      id: "cart",
      icon: <ShoppingBag size={16} />,
      label: "Add to cart",
      action: handleAddToCart,
      disabled: isOutOfStock,
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image */}
      <NavLink to={`/product/${id}`} className="block relative overflow-hidden">
        <div className="relative w-full aspect-[3/4] bg-gray-50">
          <img
            src={img}
            alt={title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
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

          {/* Discount tag */}
          {discountPercent > 0 && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              -{discountPercent}%
            </div>
          )}

          {/* Action buttons */}
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.disabled) {
                      toast.error("This product is out of stock!");
                      return;
                    }
                    item.action?.();
                  }}
                  className={`w-8 h-8 rounded-full shadow-md transition-all duration-300 ${
                    item.disabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : hoveredIcon === item.id
                      ? "bg-orange-500 text-white scale-110"
                      : "bg-white/90 text-gray-700 hover:bg-orange-500 hover:text-white"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </NavLink>

      {/* Product info */}
      <div className="p-4 flex flex-col">
        <h3
          title={title}
          className={`font-semibold text-sm sm:text-base leading-tight line-clamp-2 min-h-[38px] mb-1 transition-colors ${
            isOutOfStock
              ? "text-gray-500"
              : "text-gray-800 group-hover:text-orange-600"
          }`}
        >
          <NavLink to={`/product/${id}`}>{title}</NavLink>
        </h3>

        {/* 💸 Price (discounted on top, old below) */}
        <div className="flex flex-col items-start mb-2">
          <span
            className={`font-bold text-lg ${
              isOutOfStock ? "text-gray-400" : "text-orange-600"
            }`}
          >
            {formatVND(price)}
          </span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {formatVND(oldPrice)}
            </span>
          )}
        </div>

        {/* Stock status */}
        <div className="text-xs mb-2">
          {isOutOfStock ? (
            <span className="text-red-500 font-semibold">⚠️ Out of stock</span>
          ) : stock <= 5 ? (
            <span className="text-yellow-600 font-semibold">
              ⚡ Only {stock} left
            </span>
          ) : (
            <span className="text-green-600 font-semibold">✓ In stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
