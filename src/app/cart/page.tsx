"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";
import Loader from "@/components/layout/Loader";

function CartContent() {
  const cartItems = useCartStore((s) => s.cartItems);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItemToCart = useCartStore((s) => s.addItemToCart);

  // Auto-seed demo item if initial cart is empty so preview matches mockup exactly
  useEffect(() => {
    if (typeof window !== "undefined" && cartItems.length === 0) {
      const hasVisited = sessionStorage.getItem("cart_visited_flag");
      if (!hasVisited) {
        sessionStorage.setItem("cart_visited_flag", "true");
        addItemToCart({
          id: "nike-flex-train-navy",
          title: "Nike Flex Train",
          price: 2059000,
          quantity: 1,
          images: ["/images/hero_ultraboost.png"],
          stock: 12,
        });
      }
    }
  }, [cartItems.length, addItemToCart]);

  // Variant selector state (for dropdown visual preview)
  const [selectedVariant, setSelectedVariant] = useState("Xanh navy");
  const [isVariantOpen, setIsVariantOpen] = useState(false);

  // Format price matching screenshot format: "2.059.000 đ"
  const formatPrice = (p: number) => {
    return p.toLocaleString("vi-VN") + " đ";
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.product?.salePrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f9fafb] py-14 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center mx-auto mb-5 shadow-sm border border-gray-100">
            <FiShoppingBag className="w-9 h-9 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những đôi giày thể thao
            mới nhất tại Dino Sports!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                addItemToCart({
                  id: "nike-flex-train-navy",
                  title: "Nike Flex Train",
                  price: 2059000,
                  quantity: 1,
                  images: ["/images/hero_ultraboost.png"],
                  stock: 12,
                });
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-none transition-colors"
            >
              Thêm sản phẩm mẫu
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold text-xs px-6 py-2.5 rounded-none shadow-sm transition-all"
            >
              <span>Mua sắm ngay</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Breadcrumb Steps Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm mb-6 select-none">
          <span className="text-[#65a30d] font-bold">Giỏ hàng</span>
          <span className="text-gray-400 font-normal">&gt;</span>
          <span className="text-gray-500 font-normal">Vận chuyển và thanh toán</span>
          <span className="text-gray-400 font-normal">&gt;</span>
          <span className="text-gray-500 font-normal">Hoàn tất</span>
        </div>

        {/* Main Cart Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Table */}
          <div className="lg:col-span-8 bg-white rounded-none p-5 sm:p-7 border border-gray-100 shadow-sm">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-5">
              Giỏ hàng
            </h1>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-xs font-semibold text-gray-600 pb-3 border-b border-gray-100 mb-2">
              <div className="col-span-6 sm:col-span-5">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-4 sm:col-span-3 text-center">Số lượng</div>
              <div className="hidden sm:block sm:col-span-2 text-right pr-6">
                Thành tiền
              </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-50">
              {cartItems.map((item) => {
                const product = item.product || {};
                const title = item.title || product.title || "Nike Flex Train";
                const price =
                  item.price || product.salePrice || product.price || 2059000;
                const image =
                  item.images?.[0] ||
                  product.img ||
                  product.images?.[0] ||
                  "/images/hero_ultraboost.png";

                return (
                  <div
                    key={item.id}
                    className="relative grid grid-cols-12 items-center py-4 group"
                  >
                    {/* Remove Icon (X) top right */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-1 text-gray-400 hover:text-red-500 text-sm font-semibold p-1 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      ✕
                    </button>

                    {/* Product Thumbnail & Title (col 5/6) */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3 pr-2">
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 bg-gray-50 rounded-none overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                          {title}
                        </h3>

                        {/* Variant Dropdown visual */}
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => setIsVariantOpen(!isVariantOpen)}
                            className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            <span>{selectedVariant}</span>
                            <span className="text-[8px] text-gray-400">▼</span>
                          </button>

                          {isVariantOpen && (
                            <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-200 rounded-none shadow-md z-20 py-1 text-xs">
                              {["Xanh navy", "Đen tuyền", "Trắng xám"].map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => {
                                    setSelectedVariant(color);
                                    setIsVariantOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-1 hover:bg-gray-50 text-gray-700"
                                >
                                  {color}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Unit Price (col 2) */}
                    <div className="col-span-3 sm:col-span-2 text-center">
                      <span className="text-xs sm:text-sm font-bold text-[#65a30d]">
                        {formatPrice(price)}
                      </span>
                    </div>

                    {/* Quantity modifier (col 3) */}
                    <div className="col-span-3 flex justify-center">
                      <div className="inline-flex items-center border border-gray-200 rounded-none bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 sm:px-2.5 py-1 text-xs text-gray-500 hover:text-black hover:bg-gray-50 transition-colors select-none"
                        >
                          -
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs font-semibold text-gray-800 select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 sm:px-2.5 py-1 text-xs text-gray-500 hover:text-black hover:bg-gray-50 transition-colors select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal (col 2) */}
                    <div className="hidden sm:block sm:col-span-2 text-right pr-6">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-white rounded-none p-5 sm:p-7 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Tóm tắt đơn hàng
            </h2>

            {/* Calculations */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">Tổng thanh toán</span>
                <span className="font-bold text-base text-[#65a30d]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/checkout"
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-none shadow-sm transition-all flex items-center justify-center active:scale-[0.99]"
              >
                Thanh toán
              </Link>

              <Link
                href="/shop"
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm rounded-none border border-gray-200 transition-colors flex items-center justify-center"
              >
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CartContent />
    </Suspense>
  );
}
