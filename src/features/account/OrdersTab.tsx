import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiChevronRight,
  FiLogIn,
} from "react-icons/fi";
import { useOrderStore } from "../../stores/orderStore";

const OrdersTab: React.FC = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const userId = localStorage.getItem("userId") || "";

  // FIX: Lấy actions và data riêng biệt, KHÔNG dùng inline function
  const fetchUserOrders = useOrderStore((state) => state.fetchUserOrders);
  const userOrders = useOrderStore((state) => state.userOrders);
  const loadingStates = useOrderStore((state) => state.loading);

  // Tính toán orders và loading từ state đã subscribe
  const orders = userOrders[userId] || [];
  const loading = loadingStates[`user_${userId}`] || false;

  useEffect(() => {
    if (!userId) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    fetchUserOrders(userId);
  }, [userId, fetchUserOrders]); // Có thể giữ fetchUserOrders vì nó stable

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const visibleOrders = sortedOrders.slice(0, visibleCount);

  const handleSeeMore = () => {
    const currentCount = visibleCount;
    setVisibleCount((prev) => prev + 5);

    setTimeout(() => {
      const orderElements = document.querySelectorAll("[data-order-index]");
      const firstNewItem = orderElements[currentCount];
      if (firstNewItem) {
        firstNewItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-300";
      case "shipping":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "completed":
        return "bg-green-50 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-300";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleViewDetails = (orderId: string) => {
    navigate(`/account/order/${orderId}`);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[#f8f6f3] opacity-50" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 shadow-md shadow-orange-100">
            <FiPackage className="text-orange-500" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
            <p className="text-sm text-gray-600">
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Nếu chưa đăng nhập */}
        {!isLoggedIn ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-100">
              <FiLogIn className="text-orange-500" size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              Please log in to view your orders
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Log in to see your order history and track your purchases.
            </p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-md bg-gray-900 rounded-xl hover:bg-orange-500 hover:shadow-orange-500/30"
            >
              Log In
            </button>
          </div>
        ) : loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 rounded-xl animate-spin border-t-orange-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your orders...
            </p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-100">
              <FiShoppingBag className="text-orange-500" size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              No Orders Yet
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              You haven't placed any orders yet.
              <br />
              Start shopping now! 🛍️
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {visibleOrders.map((order, index) => (
                <div
                  key={order.id}
                  data-order-index={index}
                  className="relative p-5 transition-all duration-300 border border-gray-200 rounded-2xl hover:border-orange-300 hover:shadow-lg group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0">
                        <FiPackage className="text-gray-500" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 lg:block">
                          <h3 className="text-base font-bold text-gray-800 truncate">
                            Order #{order.id}
                          </h3>
                          {/* Status (mobile) */}
                          <span
                            className={`lg:hidden px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <FiCalendar size={14} className="flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status (desktop) */}
                    <span
                      className={`hidden lg:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiShoppingBag
                          size={16}
                          className="text-blue-500 flex-shrink-0"
                        />
                        <span className="font-medium">{order.items} items</span>
                      </div>
                      <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                        <FiDollarSign
                          size={16}
                          className="text-green-500 flex-shrink-0"
                        />
                        <span className="truncate">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-md bg-gray-900 rounded-xl hover:bg-orange-500 align-middle hover:shadow-orange-500/30 group-hover:gap-3 w-full sm:w-auto"
                    >
                      <span>View Details</span>
                      <FiChevronRight
                        size={18}
                        className="transition-transform duration-300"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            {visibleCount < sortedOrders.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleSeeMore}
                  className="px-6 py-3 font-semibold text-orange-600 transition-all duration-300 border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white"
                >
                  Load More Orders ({sortedOrders.length - visibleCount}{" "}
                  remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
