import React from "react";
import {
  CreditCard,
  Tag,
  Truck,
  DollarSign,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import type { CustomerInfo } from "./CheckoutForm";

interface Props {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerInfo?: CustomerInfo;
  onPlaceOrder: () => void;
}

const CheckoutSummary: React.FC<Props> = ({
  subtotal,
  tax,
  shipping,
  total,
  onPlaceOrder,
}) => {
  const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

  return (
    <>
      {/* ================== Desktop Summary Card ================== */}
      <div className="sticky top-25 bg-white border border-orange-100 rounded-3xl p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-200 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="text-orange-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
          </div>
        </div>

        {/* Price summary */}
        <div className="text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" /> Subtotal
            </span>
            <span className="font-semibold">{formatVND(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
            </span>
            <span className="font-semibold">{formatVND(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" /> Shipping
            </span>
            <span className="font-semibold">
              {shipping === 0 ? (
                <span className="text-green-600 font-semibold">Free</span>
              ) : (
                formatVND(shipping)
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
                Add <strong>{formatVND(25 - subtotal)}</strong> more for{" "}
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
            {formatVND(total)}
          </span>
        </div>

        {/* Checkout Button - Desktop only */}
        <div className="hidden lg:block">
          <button
            onClick={onPlaceOrder}
            disabled={subtotal <= 0}
            className={`w-full py-5 font-semibold text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              subtotal > 0
                ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:from-orange-600 hover:to-amber-600 text-white"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
            Place Order
          </button>
        </div>

        {/* Secure note */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
          <ShieldCheck className="text-green-500 w-5 h-5" />
          <span>Secure & encrypted payment</span>
        </div>
      </div>

      {/* ================== Mobile + Tablet Taskbar ================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
          {/* Total Price */}
          <div className="text-start">
            <div className="text-[11px] text-gray-500 leading-tight">Total</div>
            <div className="text-base font-semibold text-orange-600">
              {formatVND(total)}
            </div>
          </div>

          {/* Checkout Button - Mobile & Tablet only */}
          <button
            onClick={onPlaceOrder}
            disabled={subtotal <= 0}
            className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
              subtotal > 0
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-md hover:from-orange-600 hover:to-amber-600"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Place Order
          </button>
        </div>
      </div>

      {/* Spacer tránh che nội dung bởi taskbar */}
      <div className="lg:hidden h-28" />
    </>
  );
};

export default CheckoutSummary;
