import React, { useState, useMemo } from "react";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: number;
}

interface OrdersTabProps {
  onViewDetails?: (orderId: string) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ onViewDetails }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  // ✅ Sample data tự tạo
  const orders: Order[] = useMemo(() => {
    const statuses = ["Shipping", "Completed", "Cancelled", "Processing"];
    return Array.from({ length: 10 }).map((_, i) => ({
      id: `ORD-${String(i + 1).padStart(3, "0")}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // cách nhau 1 ngày
      status: statuses[i % statuses.length],
      total: Math.floor(Math.random() * 2_000_000 + 500_000),
      items: Math.floor(Math.random() * 5) + 1,
    }));
  }, []);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const visibleOrders = sortedOrders.slice(0, visibleCount);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 5);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Shipping":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
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
      <div className="max-w-6xl p-6 mx-auto bg-white">
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            My Orders
          </h2>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            You haven’t placed any orders yet 🛒
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {visibleOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 transition-shadow duration-200 bg-white border border-gray-200 rounded-2xl hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items} items
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <button
                      onClick={() => onViewDetails?.(order.id)}
                      className="px-4 py-2 text-orange-600 transition-colors duration-200 border border-orange-500 rounded-lg hover:bg-orange-50"
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
                  className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition"
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
