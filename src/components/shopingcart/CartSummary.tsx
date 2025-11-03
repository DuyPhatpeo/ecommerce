import {
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
  regularPrice?: number;
  salePrice?: number;
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

  const validItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.product.stock > 0 &&
      item.quantity <= item.product.stock
  );

  const invalidItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      (item.product.stock === 0 || item.quantity > item.product.stock)
  );

  const subtotal = validItems.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.regularPrice ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = validItems.length > 0 ? (subtotal >= 25 ? 0 : 1) : 0;
  const total = subtotal + tax + shipping;

  const format = (num: number) => `${num.toLocaleString("en-US")}₫`;

  const handleCheckout = () => {
    if (!validItems.length) return;
    const checkoutItems = validItems.map((i) => ({
      id: i.id,
      quantity: i.quantity,
    }));
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    navigate("/checkout", { state: { subtotal, tax, shipping, total } });
  };

  return (
    <div className="sticky top-20 bg-white border border-orange-100 rounded-3xl p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-200 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="text-orange-600 w-6 h-6" />
          <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
        </div>
      </div>

      {/* Cảnh báo lỗi */}
      {invalidItems.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="text-red-600 w-5 h-5 mt-0.5" />
          <p className="text-sm text-red-700">
            {invalidItems.length} item
            {invalidItems.length !== 1 ? "s" : ""} cannot be checked out.
          </p>
        </div>
      )}

      {/* Price summary dạng bảng */}
      <div className="text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" /> Subtotal
          </span>
          <span className="font-semibold">{format(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
          </span>
          <span className="font-semibold">{format(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" /> Shipping
          </span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600 font-semibold">Free</span>
            ) : (
              format(shipping)
            )}
          </span>
        </div>
      </div>

      {/* Free shipping progress */}
      {subtotal > 0 && subtotal < 25 && (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
          <div className="flex items-start gap-2 mb-2 text-orange-700 text-sm">
            <ShoppingCart className="w-5 h-5 mt-0.5" />
            <span>
              Add <strong>{format(25 - subtotal)}</strong> more for{" "}
              <strong>FREE SHIPPING</strong>!
            </span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500"
              style={{ width: `${(subtotal / 25) * 100}%` }}
            />
          </div>
          <p className="text-xs text-orange-600 mt-1 text-right">
            {Math.round((subtotal / 25) * 100)}% to free shipping
          </p>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center border-t border-orange-200 pt-5">
        <span className="font-bold text-lg text-gray-800">Total</span>
        <span className="font-extrabold text-2xl text-orange-600">
          {format(total)}
        </span>
      </div>

      {/* Secure note */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
        <ShieldCheck className="text-green-500 w-5 h-5" />
        <span>Secure & encrypted payment</span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={!validItems.length}
        label="Proceed to Checkout"
        icon={<ShieldCheck className="w-6 h-6" />}
        className={`w-full py-5 font-semibold text-lg rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
          validItems.length
            ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:from-orange-600 hover:to-amber-600 text-white"
            : "bg-gray-100 text-gray-500 cursor-not-allowed"
        }`}
      />
    </div>
  );
}
