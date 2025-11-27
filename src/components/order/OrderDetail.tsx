import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiCreditCard,
  FiMapPin,
  FiCalendar,
  FiClipboard,
  FiUser,
  FiPhone,
  FiTag,
  FiDollarSign,
  FiTruck,
} from "react-icons/fi";

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

  const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200 space-y-6">
        {/* Timeline - Standalone */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <OrderTimeline status={order.status ?? ""} orderId={id} />
        </div>

        {/* Customer Info */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiClipboard className="text-orange-600" /> Customer Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem
              icon={<FiUser className="text-blue-500 w-5 h-5" />}
              label="Full Name"
              value={order.customer.recipientName ?? "N/A"}
            />
            <InfoItem
              icon={<FiPhone className="text-green-500 w-5 h-5" />}
              label="Phone"
              value={order.customer.phone ?? "N/A"}
            />
            <InfoItem
              icon={<FiMapPin className="text-red-500 w-5 h-5" />}
              label="Address"
              value={order.customer.address ?? "N/A"}
            />
            <InfoItem
              icon={<FiCreditCard className="text-purple-500 w-5 h-5" />}
              label="Payment Method"
              value={getPaymentMethodName(order.customer.paymentMethod)}
            />
            <InfoItem
              icon={<FiCalendar className="text-orange-500 w-5 h-5" />}
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

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <FiTag className="w-4 h-4 text-orange-500" /> Subtotal
              </span>
              <span className="font-medium">
                {formatVND(order.subtotal ?? 0)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-green-500" /> Tax (10%)
              </span>
              <span className="font-medium">{formatVND(order.tax ?? 0)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-blue-500" /> Shipping
              </span>
              <span className="font-medium text-green-600 font-semibold">
                Free
              </span>
            </div>
            <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-3xl font-bold text-orange-600">
                {formatVND(order.total ?? 0)}
              </span>
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
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-orange-100 transition hover:shadow-sm">
    {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

export default OrderDetail;
