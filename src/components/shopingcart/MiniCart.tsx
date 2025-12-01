import { FiShoppingBag } from "react-icons/fi";
import { useCartStore } from "../../stores/cartStore";

const MiniCart = () => {
  const { cartItems, loading } = useCartStore();

  const formatPrice = (n: number) =>
    `${new Intl.NumberFormat("vi-VN").format(n)} đ`;

  const extraItems = cartItems.length > 5 ? cartItems.length - 5 : 0;

  return (
    <div
      className="w-96 bg-white rounded-xl shadow-2xl border border-gray-200 absolute -right-10 top-full mt-0"
      style={{ zIndex: 9999 }}
    >
      {/* Arrow */}
      <div className="absolute -top-2.5 right-11 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white rounded-t-xl">
        <h3 className="font-bold text-base text-gray-900">Recently Added</h3>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 text-center px-4">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <FiShoppingBag className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-gray-800 text-base font-semibold mb-1">
              No products yet
            </p>
            <p className="text-gray-500 text-sm">
              Add some products to get started!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cartItems.slice(0, 5).map((item) => {
              const product = item.product;
              const imageSrc = product?.images?.[0] || "/placeholder.jpg";
              const regularPrice = product?.regularPrice ?? 0;
              const salePrice = product?.salePrice ?? regularPrice;
              const hasDiscount = salePrice < regularPrice;

              return (
                <a
                  key={item.id}
                  href={`/product/${product?.id}`}
                  className="p-4 flex items-start gap-3 hover:bg-orange-50 transition-colors"
                >
                  {/* Image */}
                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-200">
                    <img
                      src={imageSrc}
                      alt={product?.title || "Product"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 text-sm line-clamp-2 mb-1">
                      {product?.title || "Unknown Product"}
                    </h4>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-gray-500 text-xs">x{item.quantity}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-medium text-sm">
                          {formatPrice(salePrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-gray-400 text-xs line-through">
                            {formatPrice(regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between gap-3">
            {extraItems > 0 ? (
              <p className="text-orange-600 text-sm font-medium">
                +{extraItems} item{extraItems > 1 ? "s" : ""} not shown
              </p>
            ) : (
              <span></span>
            )}

            <button
              onClick={() => (window.location.href = "/cart")}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm whitespace-nowrap"
            >
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
