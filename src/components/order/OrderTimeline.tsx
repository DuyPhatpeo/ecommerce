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
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "In Transit",
      icon: <Truck className="w-5 h-5" />,
      color: "from-amber-400 to-amber-600",
    },
    {
      label: "Delivered",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "from-green-400 to-green-600",
    },
  ];

  const activeIndex = steps.findIndex((s) => s.label === status);
  const progressPercent = (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full px-4 sm:px-8 py-8">
      <div className="relative">
        <div className="absolute top-9 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute top-9 left-0 h-1.5 rounded-full transition-all duration-700 bg-gradient-to-r from-orange-400 via-amber-400 to-green-500"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="relative flex justify-between items-start">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            const isCompleted = i < activeIndex;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center flex-1 relative"
              >
                <div className="relative mb-4">
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg"
                        : isActive
                        ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110`
                        : "bg-white text-gray-400 shadow-md border-2 border-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                      isCompleted || isActive
                        ? "bg-white text-gray-700"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="text-center px-2">
                  <p
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-orange-600"
                        : isCompleted
                        ? "text-green-600"
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
