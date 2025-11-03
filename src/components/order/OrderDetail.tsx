import React, { useEffect, useState } from "react";
import {
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  ClipboardList,
} from "lucide-react";
import OrderTimeline from "./OrderTimeline";
import OrderProductList from "./OrderProductList";

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
      status: "Confirmed",
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
  const discount = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-none lg:shadow-xl p-8 border-2 border-orange-100 space-y-8">
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

            <OrderProductList items={order.items} />
          </div>

          {/* RIGHT SIDE: Summary */}
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

// ✅ Gộp các helper component ngay trong file
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-gray-700">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 bg-orange-50/30 hover:bg-orange-50 rounded-xl p-3 transition">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default OrderDetail;
