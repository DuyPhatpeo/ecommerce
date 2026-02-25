import React from "react";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};

  return (
    <main className="min-h-screen bg-[#f8f6f3] flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 p-10 max-w-2xl w-full text-center">
        {/* ✅ Icon */}
        <div className="flex justify-center mb-6">
          <FiCheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
        </div>

        {/* ✅ Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is now
          being processed.
        </p>

        {/* ✅ Order summary (nếu có dữ liệu từ state) */}
        {orderData.total && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Order Summary
            </h2>
            <p className="text-gray-700">
              <strong>Customer:</strong> {orderData.customerInfo?.fullName}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {orderData.customerInfo?.email}
            </p>
            <p className="text-gray-700">
              <strong>Total:</strong>{" "}
              <span className="text-orange-600 font-semibold">
                {orderData.total.toLocaleString("vi-VN")} đ
              </span>
            </p>
            <p className="text-gray-700">
              <strong>Payment:</strong>{" "}
              {orderData.customerInfo?.paymentMethod?.toUpperCase()}
            </p>
          </div>
        )}

        {/* ✅ Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => navigate("/")}
            icon={<FiHome className="w-5 h-5" />}
            label={"Back to Home"}
            className="bg-gray-900 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-orange-500/30 transition-all duration-300"
          />
          <Button
            onClick={() => navigate("/cart")}
            icon={<FiShoppingBag className="w-5 h-5" />}
            label={"Continue Shopping"}
            className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
          />
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
