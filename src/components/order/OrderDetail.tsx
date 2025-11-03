import React, { useEffect, useState } from "react";
import {
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  Package,
  ClipboardList,
  Check,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrderDetail: React.FC = () => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: OrderDetail = {
      id: "ORD-123456",
      status: "In Transit",
      createdAt: "2025-10-30T12:35:00Z",
      total: 1_250_000,
      paymentMethod: "Cash on Delivery",
      shippingAddress: "123 Nguyen Hue, District 1, Ho Chi Minh City",
      trackingNumber: "VN1234567890",
      estimatedDelivery: "2025-11-05",
      items: [
        {
          id: "1",
          name: "Men's White Shirt",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          price: 350_000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Blue Jeans",
          image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
          price: 450_000,
          quantity: 2,
        },
      ],
    };
    setTimeout(() => {
      setOrder(mockData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );

  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 0;
  const discount = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info + Progress Combined Card */}
            <div className="bg-white rounded-3xl shadow-none lg:shadow-xl p-8 border-2 border-orange-100 space-y-8">
              {/* Order ID */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-200 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-2xl font-bold text-gray-900">{order.id}</p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-semibold text-sm">
                  {order.status}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-orange-600" />
                  Order Progress
                </h2>
                {order.trackingNumber && (
                  <p className="text-sm text-gray-500 mb-4">
                    Tracking:{" "}
                    <span className="font-semibold text-gray-700">
                      {order.trackingNumber}
                    </span>
                  </p>
                )}
                <OrderTimeline status={order.status} />
                {order.estimatedDelivery && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-green-700">
                        Estimated Delivery:
                      </span>{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Info */}
              <div>
                <h2 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-orange-600" />
                  Order Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Calendar className="text-orange-500 w-5 h-5" />}
                    label="Order Date"
                    value={new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  <InfoItem
                    icon={<CreditCard className="text-blue-500 w-5 h-5" />}
                    label="Payment Method"
                    value={order.paymentMethod}
                  />
                  <InfoItem
                    icon={<MapPin className="text-red-500 w-5 h-5" />}
                    label="Shipping Address"
                    value={order.shippingAddress}
                  />
                  <InfoItem
                    icon={<Truck className="text-emerald-500 w-5 h-5" />}
                    label="Delivery Type"
                    value="Standard Shipping (3–5 days)"
                  />
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-3xl shadow-none lg:shadow-xl p-8 border-2 border-orange-100 space-y-8">
              <h2 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-orange-600" />
                Items in this Order ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-2 border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-orange-200 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white">
                          {item.quantity}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-1">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString("en-US")}₫ ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600 text-xl">
                        {(item.price * item.quantity).toLocaleString("en-US")}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-none lg:shadow-xl p-8 border-2 border-orange-100 space-y-8">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-200">
                <ClipboardList className="w-6 h-6 text-orange-600" />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <Row
                  label="Subtotal"
                  value={`${subtotal.toLocaleString("en-US")}₫`}
                />
                <Row label="Shipping Fee" value="Free" />
                <Row
                  label="Discount"
                  value={`-${discount.toLocaleString("en-US")}₫`}
                />

                <div className="border-t-2 border-orange-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-xl text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-orange-600">
                    {order.total.toLocaleString("en-US")}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group bg-gradient-to-br from-white to-gray-50">
    <div className="mt-1 p-2.5 bg-gradient-to-br from-orange-50 to-white rounded-lg group-hover:scale-110 transition-transform duration-300 border border-orange-100">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
        {label}
      </p>
      <p className="font-semibold text-gray-900 text-sm leading-snug break-words">
        {value}
      </p>
    </div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-gray-700">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const OrderTimeline = ({ status }: { status: string }) => {
  const steps = [
    { label: "Order Placed", icon: <Package className="w-5 h-5" /> },
    { label: "Confirmed", icon: <Check className="w-5 h-5" /> },
    { label: "In Transit", icon: <Truck className="w-5 h-5" /> },
    { label: "Delivered", icon: <CheckCircle className="w-5 h-5" /> },
  ];
  const activeIndex = steps.findIndex((s) => s.label === status);

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="flex flex-col items-center text-center flex-1 relative"
          >
            {i < steps.length - 1 && (
              <div className="absolute top-6 left-1/2 w-full h-1 -z-10">
                <div className="h-full bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      i < activeIndex
                        ? "bg-gradient-to-r from-green-400 to-green-600 w-full"
                        : "w-0"
                    }`}
                  />
                </div>
              </div>
            )}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full border-4 transition-all duration-500 shadow-lg relative z-10 ${
                i <= activeIndex
                  ? "border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white scale-110"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {step.icon}
              {i < activeIndex && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center border-2 border-white">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p
              className={`text-xs sm:text-sm mt-3 font-semibold ${
                i <= activeIndex ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
