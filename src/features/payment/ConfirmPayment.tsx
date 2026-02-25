import { useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiMapPin,
  FiTruck,
  FiTag,
  FiDollarSign,
  FiArrowLeft,
  FiCheck,
  FiUser,
  FiPhone,
  FiFileText,
} from "react-icons/fi";

import ConfirmPaymentProductList from "./ConfirmPaymentProductList";
import Button from "../../components/ui/Button";

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
        {/* Delivery Info - Đồng bộ với OrderDetail */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiMapPin size={20} className="text-orange-600" /> Delivery
            Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem
              icon={<FiUser className="text-blue-500 w-5 h-5" />}
              label="Full Name"
              value={customerInfo.recipientName}
            />
            <InfoItem
              icon={<FiPhone className="text-green-500 w-5 h-5" />}
              label="Phone Number"
              value={customerInfo.phone}
            />
            <InfoItem
              icon={<FiMapPin className="text-red-500 w-5 h-5" />}
              label="Address"
              value={customerInfo.address}
            />
            <InfoItem
              icon={<FiCreditCard className="text-purple-500 w-5 h-5" />}
              label="Payment Method"
              value={getPaymentMethodName(customerInfo.paymentMethod)}
            />
            {customerInfo.note && (
              <InfoItem
                icon={<FiFileText className="text-orange-500 w-5 h-5" />}
                label="Note"
                value={customerInfo.note}
              />
            )}
          </div>
        </div>

        {/* Order Items */}
        <ConfirmPaymentProductList products={products} />

        {/* Price Summary - Giữ nguyên (đã đồng bộ rồi) */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <FiTag className="w-4 h-4 text-orange-500" /> Subtotal
              </span>
              <span className="font-medium">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
              </span>
              <span className="font-medium">{formatVND(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-blue-500" /> Shipping
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
            icon={<FiArrowLeft size={16} />}
            iconPosition="left"
            className="flex-1 py-3 text-base border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
            justify="center"
          />
          <Button
            onClick={() => handlePlaceOrder(navigate)}
            label="Confirm Order"
            icon={<FiCheck size={16} />}
            iconPosition="right"
            className="flex-1 py-3 text-base bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow hover:shadow-lg"
            justify="center"
          />
        </div>
      </div>

      {/* Mobile Taskbar - Giữ nguyên */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-lg font-semibold text-orange-600">
              {formatVND(total)}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleBack}
              label="Back to Edit"
              icon={<FiArrowLeft size={16} />}
              iconPosition="left"
              className="flex-1 py-2.5 text-sm border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
              justify="center"
            />
            <Button
              onClick={() => handlePlaceOrder(navigate)}
              label="Confirm Order"
              icon={<FiCheck size={16} />}
              iconPosition="right"
              className="flex-1 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow hover:shadow-lg"
              justify="center"
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden h-28" />
    </div>
  );
};

// InfoItem component - Giống OrderDetail
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-orange-100 transition hover:shadow-sm">
    {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

export default ConfirmPayment;
