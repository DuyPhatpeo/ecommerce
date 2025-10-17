import React, { useState, useCallback } from "react";
import { Heart, ShoppingBag, Share2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { addToCart } from "../../api/cartApi";

interface Product {
  id: number;
  title: string;
  img: string;
  price: number;
  oldPrice?: number;
}

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id, title, img, price, oldPrice } = data;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  /** ✅ Toast khi thêm sản phẩm */
  const showCartToast = useCallback(
    (imageUrl: string, title: string, price: number) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-4 p-4 max-w-sm w-full bg-white shadow-lg rounded-xl border relative transition-all duration-300 ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-16 h-16 rounded-lg border object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                No image
              </div>
            )}

            <div className="flex-1">
              <p className="font-semibold text-gray-800 line-clamp-1">
                {title}
              </p>
              <p className="text-sm text-gray-600">
                Đã thêm <span className="font-semibold text-orange-500">1</span>{" "}
                sản phẩm vào giỏ hàng
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {price.toFixed(2)} $
              </p>

              <Button
                type="button"
                label="Xem giỏ hàng"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/cart");
                }}
                className="mt-2 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-1 px-3 rounded-lg transition"
              />
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
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

  /** ✅ Hàm thêm vào giỏ hàng */
  const handleAddToCart = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await addToCart(id, 1);
      showCartToast(img, title, price);
    } catch {
      toast.error("❌ Không thể thêm sản phẩm vào giỏ hàng!");
    } finally {
      setLoading(false);
    }
  }, [id, img, title, price, loading, showCartToast]);

  const icons = [
    {
      id: "cart",
      icon: <ShoppingBag size={16} />,
      label: "Add to Bag",
      action: handleAddToCart,
    },
    { id: "wishlist", icon: <Heart size={16} />, label: "Add to Wishlist" },
    { id: "share", icon: <Share2 size={16} />, label: "Share" },
  ];

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 
                 w-full overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hình ảnh */}
      <Link to={`/product/${id}`} className="block">
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-t-2xl bg-gray-50">
          <img
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? "scale-110 rotate-1" : "scale-100 rotate-0"
            }`}
          />

          {/* Badge giảm giá */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
              -{discountPercent}%
            </div>
          )}

          {/* Icon hành động */}
          <div
            className={`absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 transition-all duration-500 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
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
                  onClick={(e) => {
                    e.preventDefault();
                    item.id === "cart" && item.action && item.action();
                  }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 shadow-md ${
                    hoveredIcon === item.id
                      ? "bg-orange-500 text-white scale-110 shadow-orange-500/50"
                      : "bg-white/90 text-gray-700 hover:bg-orange-500 hover:text-white"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* Thông tin */}
      <div className="p-4 sm:p-5">
        <h3
          className="text-gray-800 font-semibold text-base sm:text-lg md:text-xl leading-tight line-clamp-2 
                     min-h-[38px] sm:min-h-[44px] mb-2 sm:mb-3 group-hover:text-orange-600 
                     transition-colors duration-300 text-left"
          title={title}
        >
          {title || "Untitled Product"}
        </h3>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-orange-600 font-bold text-base sm:text-lg">
            ${price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              ${oldPrice.toFixed(2)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="ml-auto text-green-600 text-[11px] sm:text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
              Save ${(oldPrice! - price!).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
