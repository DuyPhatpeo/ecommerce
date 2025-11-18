import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  ClipboardList,
  User,
  Phone,
} from "lucide-react";
import { useOrderStore } from "../../stores/orderStore";
import OrderTimeline from "./OrderTimeline";
import OrderProductList from "./OrderProductList";
import Loader from "../general/Loader";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const fetchOrderDetail = useOrderStore((state) => state.fetchOrderDetail);
  const orders = useOrderStore((state) => state.orders);
  const products = useOrderStore((state) => state.products);
  const loadingStates = useOrderStore((state) => state.loading);

  const order = id ? orders[id] : null;
  const productList = id ? products[id] || [] : [];
  const loading = id ? loadingStates[id] || false : false;

  useEffect(() => {
    if (id) fetchOrderDetail(id);
  }, [id, fetchOrderDetail]);

  if (loading) return <Loader />;
  if (!order) return null;

  const getPaymentMethodName = (method?: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "banking":
        return "Bank Transfer";
      case "momo":
        return "MoMo Wallet";
      default:
        return "Other Payment Method";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <CreditCard className="text-orange-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Order Detail
          </h2>
          <p className="text-gray-600">Review your order information</p>
        </div>

        {/* Timeline */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Truck className="text-orange-600" /> Order Progress
          </h3>
          <OrderTimeline status={order.status ?? ""} />
        </div>

        {/* Customer Info */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList className="text-orange-600" /> Customer Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem
              icon={<User className="text-blue-500 w-5 h-5" />}
              label="Full Name"
              value={order.customer.recipientName ?? "N/A"}
            />
            <InfoItem
              icon={<Phone className="text-green-500 w-5 h-5" />}
              label="Phone"
              value={order.customer.phone ?? "N/A"}
            />
            <InfoItem
              icon={<MapPin className="text-red-500 w-5 h-5" />}
              label="Address"
              value={order.customer.address ?? "N/A"}
            />
            <InfoItem
              icon={<CreditCard className="text-purple-500 w-5 h-5" />}
              label="Payment Method"
              value={getPaymentMethodName(order.customer.paymentMethod)}
            />
            <InfoItem
              icon={<Calendar className="text-orange-500 w-5 h-5" />}
              label="Order Date"
              value={
                order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* Product List */}
        <OrderProductList items={productList} />

        {/* Payment Info */}
        <div className="border border-gray-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CreditCard className="text-orange-600 w-5 h-5" /> Payment
          </h3>
          <p className="text-gray-700">
            {getPaymentMethodName(order.customer.paymentMethod)}
          </p>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
          <Row label="Subtotal" value={order.subtotal ?? 0} />
          <Row label="Tax (10%)" value={order.tax ?? 0} />
          <Row label="Shipping" value={0} free />
          <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-3xl font-bold text-orange-600">
              {(order.total ?? 0).toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  free,
}: {
  label: string;
  value: number;
  free?: boolean;
}) => (
  <div className="flex justify-between text-gray-700">
    <span>{label}</span>
    <span className={`font-medium ${free ? "text-green-600" : ""}`}>
      {free ? "Free" : value.toLocaleString("vi-VN") + "₫"}
    </span>
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-3 transition">
    {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

export default OrderDetail;
