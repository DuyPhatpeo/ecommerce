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

  // ===== Filter valid & invalid products =====
  const validSelectedItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.product.stock > 0 &&
      item.quantity <= item.product.stock
  );

  const invalidSelectedItems = cartItems.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      (item.product.stock === 0 || item.quantity > item.product.stock)
  );

  // ===== Calculate totals =====
  const subtotal = validSelectedItems.reduce((sum, item) => {
    const unit = item.product.salePrice ?? item.product.regularPrice ?? 0;
    return sum + unit * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = validSelectedItems.length > 0 ? (subtotal >= 25 ? 0 : 1) : 0;
  const total = subtotal + tax + shipping;

  const formatPrice = (price: number) => `${price.toLocaleString("en-US")} ₫`;

  // ===== Handle checkout =====
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
    <>
      {/* ===== ORDER SUMMARY (VISIBLE ON ALL DEVICES) ===== */}
      <div
        className="
    w-full bg-white lg:shadow-2xl overflow-hidden 
    rounded-none lg:rounded-3xl
    lg:col-span-1 lg:sticky lg:top-20
  "
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-2xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Order Summary</h2>
              <p className="text-orange-100 text-sm">
                Review your items before checkout
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">
          {/* ⚠️ Invalid items */}
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

          {/* 💰 Price breakdown */}
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

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

            {/* 🧾 Total */}
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
                    Including all taxes & fees
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 🧡 Checkout button (only on desktop) */}
          <div className="hidden lg:block">
            <Button
              onClick={handleCheckout}
              disabled={validSelectedItems.length === 0}
              icon={<ShieldCheck className="w-6 h-6" />}
              label="Proceed to Checkout"
              className={`w-full font-bold text-lg py-5 rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 ${
                validSelectedItems.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ===== MOBILE/TABLET TASKBAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-5 py-4 flex justify-between items-center lg:hidden z-50">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-orange-600">
            {formatPrice(total)}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={validSelectedItems.length === 0}
          className={`px-5 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center gap-2 ${
            validSelectedItems.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          Checkout
        </button>
      </div>
    </>
  );
}
