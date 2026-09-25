"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import Loader from "@/components/layout/Loader";

interface OrderInfo {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  orderCode: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    variant?: string;
    images?: string[];
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
}

const defaultOrder: OrderInfo = {
  fullName: "Nguyễn Văn An",
  phone: "0900 123 456",
  address: "Số 120 Đường Thể Thao Mẫu, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh",
  paymentMethod: "Thanh toán khi nhận hàng",
  orderCode: "DINO-26090002",
  items: [
    {
      id: "nike-flex-train-navy",
      title: "Nike Flex Train",
      price: 2059000,
      quantity: 1,
      variant: "Xanh navy",
      images: ["/images/hero_ultraboost.png"],
    },
  ],
  subtotal: 2059000,
  shippingFee: 30000,
  total: 2089000,
};

function OrderSuccessContent() {
  const [order, setOrder] = useState<OrderInfo>(defaultOrder);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("latest_order");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrder({
            ...defaultOrder,
            ...parsed,
          });
        } catch {
          // Keep defaultOrder
        }
      }
    }
  }, []);

  const formatPrice = (p: number) => {
    return p.toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Breadcrumb Steps Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm mb-6 select-none">
          <span className="text-gray-500 font-normal">Giỏ hàng</span>
          <span className="text-gray-400 font-normal">&gt;</span>
          <span className="text-gray-500 font-normal">Vận chuyển và thanh toán</span>
          <span className="text-gray-400 font-normal">&gt;</span>
          <span className="text-[#65a30d] font-bold">Hoàn tất</span>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-none p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm text-center">
          {/* Green Check Icon */}
          <div className="w-12 h-12 rounded-none bg-[#65a30d] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <FiCheck className="w-6 h-6 stroke-[3]" />
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2.5">
            Đặt hàng thành công!
          </h1>

          {/* Messages */}
          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto space-y-1 mb-8">
            <p>
              Trên thị trường có quá nhiều sự lựa chọn, cám ơn bạn đã lựa chọn mua sắm tại
              Shop
            </p>
            <p>
              Đơn hàng của bạn đã được chuyển tới hệ thống xử lý đơn hàng của chúng tôi.
              Trong quá trình xử lý, chúng tôi sẽ liên hệ lại nếu như cần thêm thông tin
              từ bạn.
            </p>
            <p>
              Khi cần hỗ trợ nhanh, hãy gọi hotline:{" "}
              <span className="font-semibold text-gray-800">1900 6868</span> hoặc{" "}
              <span className="font-semibold text-gray-800">028 7777 0001</span>
            </p>
          </div>

          {/* 2-Column Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-gray-100 pt-8 mb-8">
            {/* Left Column: Thông tin nhận hàng */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Thông tin nhận hàng
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start">
                  <span className="font-bold text-gray-900 w-36 sm:w-40 flex-shrink-0">
                    Tên người nhận
                  </span>
                  <span className="text-gray-700 font-medium">{order.fullName}</span>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-gray-900 w-36 sm:w-40 flex-shrink-0">
                    Số điện thoại
                  </span>
                  <span className="text-gray-700 font-medium">{order.phone}</span>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-gray-900 w-36 sm:w-40 flex-shrink-0">
                    Địa chỉ nhận hàng
                  </span>
                  <span className="text-gray-700 font-medium leading-relaxed">
                    {order.address}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-gray-900 w-36 sm:w-40 flex-shrink-0">
                    Hình thức thanh toán
                  </span>
                  <span className="text-gray-700 font-medium">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Thông tin đơn hàng */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Thông tin đơn hàng{" "}
                <span className="text-[#65a30d] font-bold">{order.orderCode}</span>
              </h2>

              {/* Items List */}
              <div className="space-y-2.5 mb-4">
                {order.items.map((item, idx) => {
                  const image =
                    item.images?.[0] || "/images/hero_ultraboost.png";
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-none p-3 flex items-center justify-between bg-white shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-gray-50 rounded-none overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                          <Image
                            src={image}
                            alt={item.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {item.variant || "Xanh navy"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-none mt-1">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(order.shippingFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">
                    Tổng thanh toán
                  </span>
                  <span className="font-bold text-sm sm:text-base text-[#65a30d]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action button: Tiếp tục mua sắm */}
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-none shadow-sm transition-all active:scale-[0.99]"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
