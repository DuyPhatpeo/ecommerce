import { useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../stores/checkoutStore";
import type { Product } from "../../stores/checkoutStore";
import { useEffect, useState } from "react";
import {
  CreditCard,
  MapPin,
  Package,
  Truck,
  Tag,
  DollarSign,
} from "lucide-react";

const LOCAL_STORAGE_KEY = "checkoutData";

const ConfirmPayment = () => {
  const navigate = useNavigate();
  const {
    customerInfo,
    products,
    subtotal,
    tax,
    shipping,
    total,
    handlePlaceOrder,
    setCustomerInfo,
    setProducts,
  } = useCheckoutStore();

  const [loaded, setLoaded] = useState(false);

  // Load data from localStorage on page refresh
  useEffect(() => {
    if (!loaded && (!customerInfo || products.length === 0)) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setCustomerInfo(data.customerInfo || null);
        setProducts(data.products || []);
      }
      setLoaded(true);
    }
  }, [customerInfo, products, loaded, setCustomerInfo, setProducts]);

  if (!customerInfo || products.length === 0) return null;

  // Go back one page
  const handleBack = () => {
    navigate(-1);
  };

  const shippingFee = shipping;

  const getShippingMethodName = (method: string) => {
    switch (method) {
      case "cod":
        return "Standard Delivery";
      case "express":
        return "Express Delivery";
      default:
        return "Shipping";
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "banking":
        return "Bank Transfer";
      case "momo":
        return "MoMo Wallet";
      default:
        return "Other Payment Method";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <CreditCard className="text-orange-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Confirm Payment
          </h2>
          <p className="text-gray-600">Please review your order information</p>
        </div>

        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-orange-600" /> Delivery
              Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Full Name:</p>
                <p className="font-semibold text-gray-800">
                  {customerInfo.recipientName}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Phone Number:</p>
                <p className="font-semibold text-gray-800">
                  {customerInfo.phone}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Address:</p>
                <p className="font-semibold text-gray-800">
                  {customerInfo.address}
                </p>
              </div>
              {customerInfo.note && (
                <div>
                  <p className="text-gray-600 mb-1">Note:</p>
                  <p className="font-semibold text-gray-800">
                    {customerInfo.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-orange-600" /> Selected
              Products
            </h3>
            <div className="space-y-4">
              {products.map((item: Product & { quantity: number }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                >
                  <img
                    src={item.img || item.images?.[0]}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.price.toLocaleString("vi-VN")}₫/unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Truck size={20} className="text-orange-600" /> Shipping
              </h3>
              <p className="text-gray-700">
                {getShippingMethodName(customerInfo.paymentMethod)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Fee: {shippingFee.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-600" /> Payment
              </h3>
              <p className="text-gray-700">
                {getPaymentMethodName(customerInfo.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-500" /> Subtotal
                </span>
                <span className="font-medium">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
                </span>
                <span className="font-medium">
                  {tax.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" /> Shipping Fee
                </span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    `${shippingFee.toLocaleString("vi-VN")}₫`
                  )}
                </span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-orange-600">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop only */}
          <div className="hidden lg:flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 py-4 border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition"
            >
              Back to Edit
            </button>
            <button
              onClick={() => handlePlaceOrder(navigate)}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {/* ================== Mobile + Tablet Taskbar ================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
          {/* Total Price */}
          <div className="text-start">
            <div className="text-[11px] text-gray-500 leading-tight">
              Total Payment
            </div>
            <div className="text-base font-semibold text-orange-600">
              {total.toLocaleString("vi-VN")}₫
            </div>
          </div>

          {/* Action Buttons - Mobile & Tablet only */}
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              className="flex-1 py-2.5 border-2 border-orange-500 text-orange-600 font-semibold text-sm rounded-md hover:bg-orange-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => handlePlaceOrder(navigate)}
              className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm rounded-md hover:shadow-md hover:from-orange-600 hover:to-amber-600 transition flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {/* Spacer tránh che nội dung bởi taskbar */}
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default ConfirmPayment;
