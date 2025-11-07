import React from "react";
import {
  Package,
  Check,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface Props {
  status: string;
}

const OrderTimeline: React.FC<Props> = ({ status }) => {
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

  const calculateProgress = () => {
    if (isCancelled || isRefunded) return 0;
    if (activeIndex === -1) return 0;

    const totalSteps = steps.length;
    const stepWidth = 100 / (totalSteps - 1);
    return activeIndex * stepWidth;
  };

  const progressPercent = calculateProgress();

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Order Status
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm">
          Track your order journey from placement to delivery
        </p>
      </div>

      <div className="relative">
        {/* Thanh nền */}
        <div className="absolute top-4 sm:top-5 left-0 right-0 h-2 bg-gray-200 rounded-full" />

        {/* Thanh tiến trình */}
        {!isCancelled && !isRefunded && (
          <div
            className="absolute top-4 sm:top-5 left-0 h-2 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-1000 ease-out shadow-lg"
            style={{
              width: `${Math.max(progressPercent, 8)}%`,
              boxShadow: "0 0 20px rgba(251, 146, 60, 0.4)",
            }}
          />
        )}

        {/* Các bước */}
        <div className="relative flex justify-between items-start flex-wrap sm:flex-nowrap gap-y-6">
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
                className="flex flex-col items-center flex-1 text-center relative z-10 min-w-[70px] sm:min-w-[100px]"
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
                  className={`text-[10px] sm:text-xs md:text-sm mt-2 sm:mt-3 transition-all duration-300 px-1 sm:px-2 ${labelClasses}`}
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
        <div className="mt-8 text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-center items-center gap-3">
            {isCancelled ? (
              <>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="text-red-600 w-5 h-5" />
                </div>
                <div className="text-left">
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
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <RotateCcw className="text-blue-600 w-5 h-5" />
                </div>
                <div className="text-left">
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
    </div>
  );
};

export default OrderTimeline;
