import React from "react";
import {
  Package,
  Check,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Hash,
} from "lucide-react";

interface Props {
  status: string;
  orderId?: string;
}

const OrderTimeline: React.FC<Props> = ({ status, orderId }) => {
  const statusMap: Record<string, string> = {
    pending: "Order Placed",
    processing: "Confirmed",
    shipping: "In Transit",
    completed: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  const steps = [
    { label: "Order Placed", icon: Package },
    { label: "Confirmed", icon: Check },
    { label: "In Transit", icon: Truck },
    { label: "Delivered", icon: CheckCircle },
  ];

  const currentLabel = statusMap[status] || "Order Placed";
  const activeIndex = steps.findIndex((s) => s.label === currentLabel);

  const isCancelled = status === "cancelled";
  const isRefunded = status === "refunded";
  const isCompleted = status === "completed";

  // Tính phần trăm tiến trình
  const calculateProgress = () => {
    if (isCancelled || isRefunded || activeIndex <= 0) return 0;
    return (activeIndex * 100) / (steps.length - 1);
  };

  const progressPercent = calculateProgress();

  // Lấy badge status
  const getStatusBadge = () => {
    if (isCancelled)
      return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
    if (isRefunded)
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Refunded" };
    if (isCompleted)
      return { bg: "bg-green-100", text: "text-green-700", label: "Delivered" };
    return {
      bg: "bg-orange-100",
      text: "text-orange-700",
      label: currentLabel,
    };
  };

  const badge = getStatusBadge();

  return (
    <div className="w-full">
      {/* Header với Order ID và Status Badge */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Order Status
          </h3>
          <span
            className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}
          >
            {badge.label}
          </span>
        </div>

        {orderId && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Order ID: {orderId}</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Thanh nền */}
        <div
          className="absolute top-4 sm:top-5 left-0 right-0 h-2 bg-gray-200 rounded-full"
          style={{ marginLeft: "20px", marginRight: "20px" }}
        />

        {/* Thanh tiến trình */}
        {!isCancelled && !isRefunded && progressPercent > 0 && (
          <div
            className="absolute top-4 sm:top-5 h-2 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-1000 ease-out"
            style={{
              left: "20px",
              width: `calc((100% - 40px) * ${progressPercent / 100})`,
              boxShadow: "0 0 20px rgba(251, 146, 60, 0.4)",
            }}
          />
        )}

        {/* Các bước */}
        <div className="relative flex justify-between items-start">
          {steps.map(({ label, icon: Icon }, i) => {
            const isActive = i === activeIndex;
            const isCompleted = i < activeIndex;

            let circleClasses = "";
            let iconColor = "";
            let labelClasses = "";

            if (isCancelled || isRefunded) {
              circleClasses = "bg-gray-200 border-2 border-gray-300";
              iconColor = "text-gray-400";
              labelClasses = "text-gray-400";
            } else if (isCompleted) {
              circleClasses =
                "bg-gradient-to-br from-orange-400 to-orange-600 border-0 shadow-lg";
              iconColor = "text-white";
              labelClasses = "text-orange-600 font-semibold";
            } else if (isActive) {
              circleClasses =
                "bg-white border-4 border-orange-500 shadow-xl ring-4 ring-orange-100";
              iconColor = "text-orange-600";
              labelClasses = "text-orange-600 font-bold";
            } else {
              circleClasses = "bg-white border-2 border-gray-300";
              iconColor = "text-gray-400";
              labelClasses = "text-gray-500";
            }

            return (
              <div
                key={label}
                className="flex flex-col items-center flex-1 text-center relative z-10"
              >
                {/* Icon circle */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${circleClasses}`}
                >
                  <Icon
                    size={18}
                    className={`${iconColor} transition-colors duration-300 sm:w-5 sm:h-5`}
                  />
                </div>

                {/* Label */}
                <p
                  className={`text-xs sm:text-sm mt-2 sm:mt-3 transition-all duration-300 ${labelClasses}`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trạng thái đặc biệt */}
      {(isCancelled || isRefunded) && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            {isCancelled ? (
              <>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <XCircle className="text-red-600 w-5 h-5" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-red-600 text-sm">
                    Order Cancelled
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This order has been cancelled
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="text-blue-600 w-5 h-5" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-blue-600 text-sm">
                    Order Refunded
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your payment has been refunded
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Completed Status */}
      {isCompleted && (
        <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-green-600 w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-green-600 text-sm">
                Order Delivered Successfully! 🎉
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Thank you for your purchase
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
