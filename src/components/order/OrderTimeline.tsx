import React from "react";
import { Package, CheckCircle, Truck, Check } from "lucide-react";

interface Props {
  status: string;
}

const OrderTimeline: React.FC<Props> = ({ status }) => {
  const steps = [
    { label: "Order Placed", icon: Package },
    { label: "Confirmed", icon: Check },
    { label: "In Transit", icon: Truck },
    { label: "Delivered", icon: CheckCircle },
  ];

  const activeIndex = steps.findIndex((s) => s.label === status);
  const progressPercent = Math.max(
    0,
    Math.min((activeIndex / (steps.length - 1)) * 100, 100)
  );

  return (
    <div className="relative w-full px-4 sm:px-8 py-8">
      <div className="relative">
        {/* Thanh nền */}
        <div className="absolute top-9 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />

        {/* Thanh tiến trình */}
        <div
          className="absolute top-9 left-0 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Các bước */}
        <div className="relative flex justify-between items-start">
          {steps.map(({ label, icon: Icon }, i) => {
            const isActive = i === activeIndex;
            const isCompleted = i < activeIndex;

            return (
              <div
                key={label}
                className="flex flex-col items-center flex-1 text-center relative"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md"
                      : isActive
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md"
                      : "bg-white text-gray-400 border-2 border-gray-200 shadow-sm"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <p
                  className={`text-xs sm:text-sm font-semibold mt-2 ${
                    isActive
                      ? "text-orange-600"
                      : isCompleted
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
