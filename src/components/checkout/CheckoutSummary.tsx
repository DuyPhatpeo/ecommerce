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
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
  paymentMethod: string;
}

interface Props {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerInfo: CustomerInfo;
  onPlaceOrder: (info: CustomerInfo) => void;
}

const CheckoutSummary: React.FC<Props> = ({
  subtotal,
  tax,
  shipping,
  total,
  customerInfo,
  onPlaceOrder,
}) => {
  const handlePlaceOrder = () => {
    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city
    ) {
      alert("⚠️ Please fill in all required fields before placing your order!");
      return;
    }
    onPlaceOrder(customerInfo);
  };

  return (
    <div className="sticky top-24 bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 transition-all duration-300 hover:shadow-orange-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
      </div>

      {/* Body */}
      <div className="p-8 space-y-5">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-700">
            <Receipt className="w-5 h-5 text-orange-500 group-hover:scale-105 transition-transform" />
            <span>Subtotal</span>
          </div>
          <span className="font-semibold text-gray-800">
            ${subtotal.toLocaleString()}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-5 h-5 text-green-500 group-hover:scale-105 transition-transform" />
            <span>Tax (10%)</span>
          </div>
          <span className="font-semibold text-gray-800">
            ${tax.toLocaleString()}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-700">
            <Truck className="w-5 h-5 text-blue-500 group-hover:scale-105 transition-transform" />
            <span>Shipping</span>
          </div>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              `$${shipping.toLocaleString()}`
            )}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 font-bold text-lg">
          <div className="flex items-center gap-2 text-gray-800">
            <DollarSign className="w-6 h-6 text-orange-600" />
            <span>Total</span>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            ${total.toLocaleString()}
          </span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <CreditCard className="w-5 h-5" />
          Place Order
        </button>

        {/* Secure badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-5 pt-5 border-t border-gray-100">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span>Secure checkout guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
