import React, { useState, useCallback } from "react";
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
  const navigate = useNavigate();

  const { id, title, img, price, oldPrice, stock = 0 } = data;
  const isOutOfStock = stock === 0;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // 🛒 Hiển thị thông báo khi thêm vào giỏ
  const showCartToast = useCallback(
    (imageUrl: string, title: string, price: number) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 max-w-xs sm:max-w-sm w-full bg-white shadow-lg rounded-xl relative transition-all duration-300 ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                No image
              </div>
            )}

            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                {title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Added <span className="font-semibold text-orange-500">1</span>{" "}
                item
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                ${price.toFixed(2)}
              </p>

              <Button
                type="button"
                label="View Cart"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/cart");
                }}
                className="mt-2 text-xs sm:text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg transition"
              />
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        ),
        { duration: 3000 }
      );
    },
    [navigate]
  );

  // 🧩 Xử lý thêm vào giỏ
  const handleAddToCart = useCallback(async () => {
    if (loading || isOutOfStock) return;
    setLoading(true);
    try {
      await addToCart(id, 1);
      showCartToast(img, title, price);
    } catch {
      toast.error("Failed to add item to cart!");
    } finally {
      setLoading(false);
    }
  }, [id, img, title, price, loading, isOutOfStock, showCartToast]);

  const icons = [
    {
      id: "cart",
      icon: <ShoppingBag size={16} />,
      label: isOutOfStock ? "Out of Stock" : "Add to Cart",
      action: handleAddToCart,
      disabled: isOutOfStock,
    },
    {
      id: "wishlist",
      icon: <Heart size={16} />,
      label: "Add to Wishlist",
      disabled: false,
    },
    {
      id: "share",
      icon: <Share2 size={16} />,
      label: "Share",
      disabled: false,
    },
  ];

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden ${
        isOutOfStock ? "opacity-90" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🖼 Ảnh sản phẩm */}
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

          {/* Overlay hết hàng */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <p className="text-gray-800 font-bold text-xs sm:text-sm">
                  OUT OF STOCK
                </p>
              </div>
            </div>
          )}

          {/* Giảm giá */}
          {!isOutOfStock && discountPercent > 0 && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
              -{discountPercent}%
            </div>
          )}

          {/* Gần hết hàng */}
          {!isOutOfStock && stock > 0 && stock <= 5 && (
            <div className="absolute top-8 left-2 sm:top-10 sm:left-3 bg-yellow-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
              Only {stock} left
            </div>
          )}

          {/* Nút hành động */}
          <div
            className={`absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-2 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-6"
            }`}
          >
            {icons.map((item, idx) => (
              <div
                key={item.id}
                className="relative"
                style={{ transitionDelay: `${idx * 50}ms` }}
                onMouseEnter={() => setHoveredIcon(item.id)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <Button
                  icon={item.icon}
                  aria-label={item.label}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.disabled) {
                      if (item.id === "cart")
                        toast.error("This product is currently out of stock!");
                      return;
                    }
                    if (item.id === "cart" && item.action) item.action();
                  }}
                  disabled={item.disabled}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md transition-all duration-300 ${
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

      {/* 🧾 Thông tin sản phẩm */}
      <div className="p-3 sm:p-4 flex flex-col">
        <h3
          title={title}
          className={`font-semibold text-sm sm:text-base leading-tight line-clamp-2 min-h-[38px] mb-1 transition-colors ${
            isOutOfStock
              ? "text-gray-500"
              : "text-gray-800 group-hover:text-orange-600"
          }`}
        >
          <NavLink to={`/product/${id}`}>{title || "Untitled Product"}</NavLink>
        </h3>

        {/* Giá */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`font-bold text-sm sm:text-lg ${
              isOutOfStock ? "text-gray-400" : "text-orange-600"
            }`}
          >
            ${price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Save phía dưới giá */}
        {!isOutOfStock && discountPercent > 0 && (
          <div className="mb-2">
            <span className="inline-block text-green-600 text-[10px] sm:text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              Save ${(oldPrice! - price!).toFixed(2)}
            </span>
          </div>
        )}

        {/* Tình trạng kho */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs mb-3">
          {isOutOfStock ? (
            <span className="text-red-500 font-semibold">⚠️ Out of stock</span>
          ) : stock <= 5 ? (
            <span className="text-yellow-600 font-semibold">
              ⚡ Almost sold out – {stock} left
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
