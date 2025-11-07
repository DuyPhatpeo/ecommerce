import React from "react";
import {
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  ClipboardList,
  User,
  Phone,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import OrderTimeline from "./OrderTimeline";
import OrderProductList from "./OrderProductList";

/* ---------------- Component ---------------- */
const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { order, products, loading } = useOrderDetail(id);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-none lg:shadow-xl p-8 border-2 border-orange-100 space-y-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-200 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-2xl font-bold text-gray-900">
                    #{order.id}
                  </p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-semibold text-sm capitalize">
                  {order.status}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-orange-600" />
                  Order Progress
                </h2>
                <OrderTimeline status={order.status ?? ""} />
              </div>

              {/* Customer Info */}
              <div>
                <h2 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-orange-600" />
                  Customer Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<User className="text-blue-500 w-5 h-5" />}
                    label="Full Name"
                    value={order.customer.recipientName}
                  />
                  <InfoItem
                    icon={<Phone className="text-green-500 w-5 h-5" />}
                    label="Phone"
                    value={order.customer.phone}
                  />
                  <InfoItem
                    icon={<MapPin className="text-red-500 w-5 h-5" />}
                    label="Address"
                    value={order.customer.address}
                  />
                  <InfoItem
                    icon={<CreditCard className="text-purple-500 w-5 h-5" />}
                    label="Payment Method"
                    value={
                      order.customer.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.customer.paymentMethod
                    }
                  />
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h2 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  Order Details
                </h2>
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
              </div>
            </div>

            {/* Product List */}
            <OrderProductList items={products} />
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
                  value={`${order.subtotal.toLocaleString("en-US")}₫`}
                />
                <Row label="Shipping" value="Free" />
                <Row
                  label="Tax"
                  value={`${order.tax.toLocaleString("en-US")}₫`}
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

/* ---------------- Helper Components ---------------- */
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
  <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-3 transition">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default OrderDetail;
