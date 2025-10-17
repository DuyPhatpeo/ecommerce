import {
  Package,
  CreditCard,
  Tag,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductType {
  id: number;
  title: string;
  price: number;
  stock: number;
}

interface CartItemType {
  id: number; // cart item id
  productId: number;
  quantity: number;
  product: ProductType;
}

interface CartSummaryProps {
  cartItems: CartItemType[];
  selectedItems: number[];
}

export default function CartSummary({
  cartItems,
  selectedItems,
}: CartSummaryProps) {
  const navigate = useNavigate();

  // Lọc sản phẩm hợp lệ
  const validSelectedItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.product.stock > 0 &&
      item.quantity <= item.product.stock
  );

  // Lọc sản phẩm không hợp lệ (để hiển thị cảnh báo)
  const invalidSelectedItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      (item.product.stock === 0 || item.quantity > item.product.stock)
  );

  // Tính subtotal
  const subtotal = validSelectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = validSelectedItems.length > 0 ? (subtotal >= 25 ? 0 : 1) : 0;
  const total = subtotal + tax + shipping;

  // Tính số tiền tiết kiệm nếu có giảm giá (có thể mở rộng sau)
  const originalTotal = total; // Placeholder cho tính năng discount sau này

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Checkout
  const handleCheckout = () => {
    if (validSelectedItems.length === 0) return;

    const checkoutItems = validSelectedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    // Lưu vào localStorage để backup (phòng trường hợp navigate lỗi)
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));

    navigate("/checkout", {
      state: {
        subtotal,
        tax,
        shipping,
        total,
        selectedItems: checkoutItems,
      },
    });
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-b-3xl shadow-2xl p-6 sticky top-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-2 rounded-xl">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            <p className="text-sm text-gray-500 mt-1">
              {validSelectedItems.length} item
              {validSelectedItems.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        {/* Warning for invalid items */}
        {invalidSelectedItems.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-800 mb-1">
                  Some items cannot be checked out
                </p>
                <p className="text-red-600">
                  {invalidSelectedItems.length} item
                  {invalidSelectedItems.length !== 1 ? "s are" : " is"} out of
                  stock or exceed available quantity
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Subtotal
            </span>
            <span className="font-semibold text-gray-800">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-semibold text-gray-800">
              {formatPrice(tax)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-semibold">
              {shipping === 0 ? (
                <span className="text-green-600 font-bold">FREE</span>
              ) : (
                <span className="text-gray-800">{formatPrice(shipping)}</span>
              )}
            </span>
          </div>

          {/* Free shipping progress */}
          {subtotal > 0 && subtotal < 25 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-start gap-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Add{" "}
                  <strong className="font-bold">
                    {formatPrice(25 - subtotal)}
                  </strong>{" "}
                  more to get{" "}
                  <strong className="font-bold">FREE SHIPPING</strong>!
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(subtotal / 25) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-1 text-right">
                {Math.round((subtotal / 25) * 100)}% to free shipping
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <div className="text-right">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {formatPrice(total)}
              </div>
              {subtotal > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Incl. all taxes & fees
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={validSelectedItems.length === 0}
          className={`w-full font-bold text-lg py-5 rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 group ${
            validSelectedItems.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span>Proceed to Checkout</span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Empty state message */}
        {validSelectedItems.length === 0 && selectedItems.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Select items to proceed to checkout
          </p>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure checkout guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
