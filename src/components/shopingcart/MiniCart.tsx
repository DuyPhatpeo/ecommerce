import { useState, useEffect, useRef } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../stores/cartStore";

interface MiniCartProps {
  onClose?: () => void;
}

const MiniCart = ({ onClose }: MiniCartProps) => {
  const { cartItems, cartCount, loading } = useCartStore();
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose?.(), 300);
  };

  // Close when clicking overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("cart-overlay")) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const formatPrice = (n: number) =>
    `${new Intl.NumberFormat("vi-VN").format(n)} đ`;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay fixed inset-0 bg-black transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-50"
        }`}
        style={{ zIndex: 9998 }}
      />

      {/* Side Drawer */}
      <div
        ref={ref}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ zIndex: 9999 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-orange-600 w-5 h-5" />
            <h3 className="font-bold text-lg text-gray-900">
              Your Cart ({cartCount})
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-gray-800 text-lg font-semibold mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-500 text-sm">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-orange-50">
              {cartItems.map((item) => {
                const imageSrc =
                  item.product?.images?.[0] || "/placeholder.jpg";
                const regularPrice = item.product?.regularPrice ?? 0;
                const salePrice = item.product?.salePrice ?? regularPrice;
                const hasDiscount = salePrice < regularPrice;
                const productId = item.product?.id;

                return (
                  <a
                    key={item.id}
                    href={`/product/${productId}`}
                    className="py-4 first:pt-0 flex items-center gap-3 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                      <img
                        src={imageSrc}
                        alt={item.product?.title || "Product"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {item.product?.title || "Unknown Product"}
                      </h4>

                      <p className="text-orange-600 font-semibold text-sm">
                        {item.quantity} × {formatPrice(salePrice)}
                      </p>

                      {hasDiscount && (
                        <p className="text-gray-400 text-xs line-through">
                          {formatPrice(regularPrice)}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-orange-100 p-4 bg-white">
            <button
              onClick={() => (window.location.href = "/cart")}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm"
            >
              View All Items in Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
