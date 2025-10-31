import {
  Package,
  CreditCard,
  Tag,
  AlertCircle,
  ShoppingCart,
  Truck,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

interface ProductType {
  id: string;
  title: string;
  regularPrice?: number; // Giá gốc
  salePrice?: number; // Giá giảm (nếu có)
  stock: number;
}

interface CartItemType {
  id: string;
  productid: string;
  quantity: number;
  product: ProductType;
}

interface CartSummaryProps {
  cartItems: CartItemType[];
  selectedItems: string[];
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

  // Tính subtotal — ưu tiên salePrice, nếu không có thì dùng regularPrice
  const subtotal = validSelectedItems.reduce((sum, item) => {
    const unit = item.product.salePrice ?? item.product.regularPrice ?? 0;
    return sum + unit * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = validSelectedItems.length > 0 ? (subtotal >= 25 ? 0 : 1) : 0;
  const total = subtotal + tax + shipping;

  const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")} đ`;

  // Checkout
  const handleCheckout = () => {
    if (validSelectedItems.length === 0) return;

    const checkoutItems = validSelectedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

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

        {/* Invalid items alert */}
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

        {/* Price breakdown */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" /> Subtotal
            </span>
            <span className="font-semibold text-gray-800">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
            </span>
            <span className="font-semibold text-gray-800">
              {formatPrice(tax)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" /> Shipping Fee
            </span>
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
            <span className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <CreditCard className="w-5 h-5 text-orange-600" />
              Total
            </span>
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
        <Button
          onClick={handleCheckout}
          disabled={validSelectedItems.length === 0}
          icon={
            <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
          }
          label={"Proceed to Checkout"}
          className={`w-full font-bold text-lg py-5 rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 group ${
            validSelectedItems.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          }`}
        />

        {/* Empty message */}
        {validSelectedItems.length === 0 && selectedItems.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Select items to proceed to checkout
          </p>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>Secure checkout guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
