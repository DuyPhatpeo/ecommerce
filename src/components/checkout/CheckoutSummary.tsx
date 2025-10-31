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
    <div className="sticky top-24 bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6 flex items-center gap-3">
        <ShoppingCart className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
      </div>

      <div className="p-8 space-y-5">
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

        <div className="h-px bg-gray-200 my-4" />
        <div className="flex justify-between items-center font-bold text-lg">
          <span className="text-gray-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-orange-600" /> Total
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {formatVND(total)}
          </span>
        </div>

        <button
          onClick={onPlaceOrder}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          <CreditCard className="inline w-5 h-5 mr-2" />
          Place Order Now
        </button>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-5 pt-5 border-t border-gray-100">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span>Secure and encrypted payment</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;

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
