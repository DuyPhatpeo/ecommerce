import React from "react";
import { Package, CheckCircle, Truck, Check } from "lucide-react";

interface Props {
  status: string;
}

const OrderTimeline: React.FC<Props> = ({ status }) => {
  const steps = [
    {
      label: "Order Placed",
      icon: <Package className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      label: "Confirmed",
      icon: <Check className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      label: "In Transit",
      icon: <Truck className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      label: "Delivered",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
  ];

  const activeIndex = steps.findIndex((s) => s.label === status);
  const progressPercent = (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full px-4 sm:px-8 py-8">
      <div className="relative">
        {/* Đường nền */}
        <div className="absolute top-9 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />

        {/* Thanh tiến trình */}
        <div
          className="absolute top-9 left-0 h-1.5 rounded-full transition-all duration-700 bg-gradient-to-r from-orange-400 to-orange-600"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Các bước */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            const isCompleted = i < activeIndex;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center flex-1 relative"
              >
                <div
                  className={`relative mb-4 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg"
                      : isActive
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg scale-110"
                      : "bg-white text-gray-400 shadow-md border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center px-2">
                  <p
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-orange-600"
                        : isCompleted
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
