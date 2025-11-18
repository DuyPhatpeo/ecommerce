import { useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { useEffect, useState } from "react";
import {
  CreditCard,
  MapPin,
  Truck,
  Tag,
  DollarSign,
  ArrowLeft,
  Check,
} from "lucide-react";

import ConfirmPaymentProductList from "./ConfirmPaymentProductList";
import Button from "../ui/Button";

const LOCAL_STORAGE_KEY = "checkoutData";

const ConfirmPayment = () => {
  const navigate = useNavigate();
  const {
    customerInfo,
    products,
    subtotal,
    tax,
    total,
    shipping,
    handlePlaceOrder,
    setCustomerInfo,
    setProducts,
  } = useCheckoutStore();

  const [loaded, setLoaded] = useState(false);

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

  const handleBack = () => navigate(-1);

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

  const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <CreditCard className="text-orange-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Confirm Payment
          </h2>
          <p className="text-gray-600">Please review your order information</p>
        </div>

        {/* Delivery Info */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 mb-6">
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
        <ConfirmPaymentProductList products={products} />

        {/* Payment */}
        <div className="border border-gray-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CreditCard size={20} className="text-orange-600" /> Payment
          </h3>
          <p className="text-gray-700">
            {getPaymentMethodName(customerInfo.paymentMethod)}
          </p>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" /> Subtotal
              </span>
              <span className="font-medium">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
              </span>
              <span className="font-medium">{formatVND(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" /> Shipping
              </span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-green-600 font-semibold">Free</span>
                ) : (
                  formatVND(shipping)
                )}
              </span>
            </div>
            <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-3xl font-bold text-orange-600">
                {formatVND(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-3 mt-6">
          <Button
            onClick={handleBack}
            label="Back to Edit"
            icon={<ArrowLeft size={16} />}
            iconPosition="left"
            className="flex-1 py-3 text-base border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
            justify="center"
          />
          <Button
            onClick={() => handlePlaceOrder(navigate)}
            label="Confirm Order"
            icon={<Check size={16} />}
            iconPosition="right"
            className="flex-1 py-3 text-base bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow hover:shadow-lg"
            justify="center"
          />
        </div>
      </div>

      {/* ================== Mobile Taskbar ================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
          {/* Total Price */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-lg font-semibold text-orange-600">
              {formatVND(total)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Back Button */}
            <Button
              onClick={handleBack}
              label="Back to Edit"
              icon={<ArrowLeft size={16} />}
              iconPosition="left"
              className="flex-1 py-2.5 text-sm border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
              justify="center"
            />

            {/* Confirm Order Button */}
            <Button
              onClick={() => handlePlaceOrder(navigate)}
              label="Confirm Order"
              icon={<Check size={16} />}
              iconPosition="right"
              className="flex-1 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow hover:shadow-lg"
              justify="center"
            />
          </div>
        </div>
      </div>

      {/* Spacer tránh che nội dung bởi taskbar */}
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default ConfirmPayment;
