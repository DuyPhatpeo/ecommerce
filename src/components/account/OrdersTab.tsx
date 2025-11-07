// src/components/account/OrdersTab.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  DollarSign,
  ShoppingBag,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { getOrdersByUser } from "../../api/orderApi";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: number;
}

const OrdersTab: React.FC = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(5);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // ✅ Lấy userId từ localStorage (đã lưu trực tiếp dạng chuỗi)
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.warn("⚠️ User chưa đăng nhập");
          setIsLoggedIn(false);
          setOrders([]);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        // ✅ Gọi đúng hàm lấy đơn của người dùng
        const data = await getOrdersByUser(userId);

        const formattedOrders = data.map((order: any) => ({
          id: order.id,
          createdAt: order.createdAt,
          status: order.status || "pending",
          total: order.total || 0,
          items: order.items?.length || 0,
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error("❌ Failed to fetch user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
            <Package className="text-white" size={20} />
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
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
              <LogIn className="text-orange-600" size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              Please log in to view your orders
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Log in to see your order history and track your purchases.
            </p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            >
              Log In
            </button>
          </div>
        ) : loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-12 h-12 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your orders...
            </p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
              <ShoppingBag className="text-orange-600" size={32} />
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
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0">
                        <Package className="text-orange-600" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 lg:block">
                          <h3 className="text-base font-bold text-gray-800 truncate">
                            Order #{order.id}
                          </h3>
                          {/* Status (mobile) */}
                          <span
                            className={`lg:hidden px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Calendar size={14} className="flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status (desktop) */}
                    <span
                      className={`hidden lg:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${getStatusColor(
                        order.status
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
                        <ShoppingBag
                          size={16}
                          className="text-blue-500 flex-shrink-0"
                        />
                        <span className="font-medium">{order.items} items</span>
                      </div>
                      <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                        <DollarSign
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
                      className="flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5 group-hover:gap-3 w-full sm:w-auto"
                    >
                      <span>View Details</span>
                      <ChevronRight
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
