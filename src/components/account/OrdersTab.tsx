import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../api/orderApi";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        const formattedOrders = data.map((order: any) => ({
          id: order.id,
          createdAt: order.createdAt,
          status: order.status || "pending",
          total: order.total,
          items: order.items?.length || 0,
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
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
  const handleSeeMore = () => setVisibleCount((prev) => prev + 5);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipping":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-6xl mx-auto 
                   bg-transparent lg:bg-white 
                   border-0 lg:border lg:border-orange-100 
                   rounded-none lg:rounded-3xl 
                   shadow-none lg:shadow-sm 
                   p-0 lg:p-6 space-y-6"
      >
        <div className="mb-5 text-center">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            My Orders
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading orders...
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border border-dashed border-orange-200 rounded-2xl">
            You haven’t placed any orders yet
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {visibleOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 transition-all duration-200 bg-white border border-gray-200 rounded-2xl hover:shadow-md lg:hover:shadow-md lg:border lg:bg-white lg:rounded-2xl"
                >
                  <div className="flex flex-row flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium text-center whitespace-nowrap ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center w-full sm:w-auto sm:gap-6">
                      <p className="text-sm text-gray-600">
                        {order.items} items
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/account/order/${order.id}`)}
                      className="px-5 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < sortedOrders.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleSeeMore}
                  className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-200 active:scale-95"
                >
                  See More
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
