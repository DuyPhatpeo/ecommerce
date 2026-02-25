import React from "react";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface Props {
  status: string;
  orderId?: string;
}

const OrderTimeline: React.FC<Props> = ({ status, orderId }) => {
  const steps = [
    { id: "pending", label: "Ordered", icon: FiPackage },
    { id: "processing", label: "Confirmed", icon: FiPackage },
    { id: "shipping", label: "Shipping", icon: FiTruck },
    { id: "completed", label: "Completed", icon: FiCheckCircle },
  ];

  const statusIndex = steps.findIndex((s) => s.id === status);
  const currentIndex = statusIndex >= 0 ? statusIndex : 0;
  const isCancelled = status === "cancelled";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Tracking
        </h2>
        {orderId && (
          <p className="text-sm text-gray-500">Order ID: {orderId}</p>
        )}
      </div>

      {/* Cancelled */}
      {isCancelled ? (
        <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
          <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-red-600 mb-1">
            Order Cancelled
          </p>
          <p className="text-sm text-gray-600">
            Your order has been cancelled.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* DESKTOP/TABLET LINE */}
          <div className="hidden sm:block">
            <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200" />
            <div
              className="absolute top-6 left-6 h-1 bg-green-500 transition-all duration-500"
              style={{
                width: `calc(${
                  (currentIndex / (steps.length - 1)) * 100
                }% - 6px)`,
              }}
            />
          </div>

          {/* MOBILE LINE (Vertical) */}
          <div className="sm:hidden absolute left-6 top-0 bottom-0 w-1 bg-gray-200" />
          <div
            className="sm:hidden absolute left-6 top-0 w-1 bg-green-500 transition-all duration-500"
            style={{
              height: `${(currentIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div
            className="
              flex sm:flex-row flex-col
              sm:justify-between sm:space-y-0 space-y-6
            "
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentIndex;
              const isDone = index < currentIndex;

              return (
                <div
                  key={step.id}
                  className="flex sm:flex-col flex-row items-center sm:items-center gap-4"
                >
                  {/* Icon */}
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      transition-all z-10
                      ${
                        isDone
                          ? "bg-green-500 shadow-lg"
                          : isActive
                            ? "bg-orange-500 shadow-lg scale-110"
                            : "bg-gray-200"
                      }
                    `}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isDone || isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Text */}
                  <div
                    className={`
                      text-sm min-h-[40px]
                      ${isDone || isActive ? "text-gray-800" : "text-gray-400"}
                      sm:text-center text-left
                    `}
                  >
                    <p className="font-medium">{step.label}</p>

                    {isActive && (
                      <p className="text-xs text-blue-600 mt-1">Processing</p>
                    )}

                    {isDone && index !== currentIndex && (
                      <p className="text-xs text-green-600 mt-1">✓</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success message */}
      {status === "completed" && (
        <div className="mt-8 bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-green-700 font-medium">
            🎉 Your order has been delivered successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
