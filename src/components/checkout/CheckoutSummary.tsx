import React from "react";
import {
  ShoppingCart,
  Receipt,
  Truck,
  DollarSign,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: string;
}

interface Props {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerInfo: CustomerInfo;
  onPlaceOrder: () => void;
}

const CheckoutSummary: React.FC<Props> = ({
  subtotal,
  tax,
  shipping,
  total,
  onPlaceOrder,
}) => {
  const formatVND = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <>
      {/* ===== DESKTOP SUMMARY ===== */}
      <div className="w-full bg-white lg:shadow-2xl overflow-hidden rounded-none lg:rounded-3xl lg:col-span-1 lg:sticky lg:top-20">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-2xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Order Summary</h2>
              <p className="text-orange-100 text-sm">
                Review and confirm your order
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <SummaryRow
            icon={<Receipt className="w-5 h-5 text-orange-500" />}
            label="Subtotal"
            value={formatVND(subtotal)}
          />
          <SummaryRow
            icon={<DollarSign className="w-5 h-5 text-green-500" />}
            label="Tax (10%)"
            value={formatVND(tax)}
          />
          <SummaryRow
            icon={<Truck className="w-5 h-5 text-blue-500" />}
            label="Shipping Fee"
            value={shipping === 0 ? "Free" : formatVND(shipping)}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <CreditCard className="w-5 h-5 text-orange-600" />
              Total
            </span>
            <div className="text-right">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {formatVND(total)}
              </div>
              {subtotal > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Including all taxes & fees
                </p>
              )}
            </div>
          </div>

          {/* 🧡 BUTTON (desktop only) */}
          <div className="hidden lg:block">
            <button
              onClick={onPlaceOrder}
              className="w-full font-bold text-lg py-5 mt-5 rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl"
            >
              <ShieldCheck className="w-6 h-6" />
              Place Order Now
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-5 pt-5 border-t border-gray-100">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>Secure and encrypted payment</span>
          </div>
        </div>
      </div>

      {/* ===== MOBILE/TABLET TASKBAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-5 py-4 flex justify-between items-center lg:hidden z-50">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-orange-600">
            {formatVND(total)}
          </p>
        </div>
        <button
          onClick={onPlaceOrder}
          className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <ShieldCheck className="w-5 h-5" />
          Checkout
        </button>
      </div>
    </>
  );
};

export default CheckoutSummary;

// 🔹 SummaryRow component
const SummaryRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2 text-gray-700">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);
