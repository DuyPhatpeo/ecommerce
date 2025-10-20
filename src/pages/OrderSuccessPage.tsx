import React from "react";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white shadow-2xl rounded-3xl border border-orange-100 p-10 max-w-2xl w-full text-center">
          {/* ✅ Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
          </div>

          {/* ✅ Title */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received and is now
            being processed.
          </p>

          {/* ✅ Order summary (nếu có dữ liệu từ state) */}
          {orderData.total && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-orange-700 mb-3">
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
                  ${orderData.total.toFixed(2)}
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
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-all"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 border-2 border-orange-400 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderSuccess;
