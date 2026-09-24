"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiPackage, FiHeart, FiLogOut, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
import SectionBanner from "@/components/shared/SectionBanner";
import Loader from "@/components/layout/Loader";

function AccountContent() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist">("profile");

  const [profile, setProfile] = useState({
    name: "Nguyễn Văn An",
    email: "khachhang.demo@dinosports.vn",
    phone: "0900 123 456",
    address: "Số 120 Đường Thể Thao Mẫu, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh",
    memberTier: "Gold Member (Thành Viên Vàng)",
  });

  const orders = [
    {
      id: "DINO-982145",
      date: "20/02/2026",
      item: "Adidas Ultraboost Solar Yellow (Size 42)",
      total: 2400000,
      status: "Đang giao hàng",
      statusColor: "bg-blue-100 text-blue-800",
      image: "/images/hero_ultraboost.png",
    },
    {
      id: "DINO-671239",
      date: "14/01/2026",
      item: "Nike Air Force 1 Retro (Size 41)",
      total: 5279000,
      status: "Giao thành công",
      statusColor: "bg-green-100 text-green-800",
      image: "/images/hero_ultraboost.png",
    },
  ];

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "₫";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SectionBanner
        title="Tài Khoản Thể Thao"
        subtitle={`Xin chào, ${profile.name} • ${profile.memberTier}`}
        category="TÀI KHOẢN"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sidebar navigation (4 cols on lg) */}
          <div className="lg:col-span-4 bg-white rounded-none p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-none bg-[#060b11] border-2 border-[#78e000] flex items-center justify-center text-[#78e000] font-black text-xl shadow">
                DN
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900">{profile.name}</h3>
                <span className="text-[11px] font-extrabold uppercase text-[#78e000] bg-black px-2.5 py-0.5 rounded-none inline-block mt-1">
                  VIP RUNNER
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1.5">
              {[
                { id: "profile", label: "Thông Tin Cá Nhân", icon: <FiUser className="w-4 h-4" /> },
                { id: "orders", label: "Lịch Sử Đơn Hàng", icon: <FiPackage className="w-4 h-4" /> },
                { id: "wishlist", label: "Danh Sách Yêu Thích", icon: <FiHeart className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs sm:text-sm font-bold transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-[#78e000] text-black shadow-sm font-black"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}

              <Link
                href="/login"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs sm:text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Đăng Xuất</span>
              </Link>
            </nav>
          </div>

          {/* Right Column: Active Tab Content (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-none p-6 sm:p-10 border border-gray-100 shadow-sm">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight pb-4 border-b border-gray-100">
                  THÔNG TIN CÁ NHÂN
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Họ và tên
                    </label>
                    <p className="text-sm font-black text-gray-900 bg-gray-50 p-3.5 rounded-none border border-gray-200">
                      {profile.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Số điện thoại
                    </label>
                    <p className="text-sm font-black text-gray-900 bg-gray-50 p-3.5 rounded-none border border-gray-200">
                      {profile.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Email
                    </label>
                    <p className="text-sm font-black text-gray-900 bg-gray-50 p-3.5 rounded-none border border-gray-200">
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Hạng thành viên
                    </label>
                    <p className="text-sm font-black text-[#78e000] bg-black p-3.5 rounded-none">
                      {profile.memberTier}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Địa chỉ mặc định
                    </label>
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3.5 rounded-none border border-gray-200 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-black flex-shrink-0" />
                      {profile.address}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => alert("Chức năng cập nhật thông tin đã sẵn sàng!")}
                    className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-6 py-3 rounded-none transition-colors"
                  >
                    Chỉnh Sửa Thông Tin
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight pb-4 border-b border-gray-100">
                  LỊCH SỬ ĐƠN HÀNG ({orders.length})
                </h3>

                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-5 rounded-none border border-gray-200 hover:border-gray-300 transition-all flex flex-col sm:flex-row items-center gap-5 justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-none overflow-hidden p-1 flex-shrink-0">
                          <Image src={o.image} alt={o.item} fill className="object-contain p-1" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-sm text-gray-900">{o.id}</span>
                            <span className="text-xs text-gray-400">• {o.date}</span>
                          </div>
                          <p className="font-bold text-xs text-gray-700">{o.item}</p>
                          <p className="font-black text-sm text-gray-900 mt-1">{formatPrice(o.total)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black px-3 py-1 rounded-none ${o.statusColor}`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight pb-4 border-b border-gray-100">
                  DANH SÁCH YÊU THÍCH
                </h3>
                <div className="text-center py-12">
                  <FiHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-600 mb-4">
                    Bạn chưa lưu sản phẩm nào vào mục yêu thích.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#78e000] text-black font-extrabold text-xs px-6 py-2.5 rounded-none shadow hover:scale-105 transition-transform"
                  >
                    Khám phá sản phẩm ngay
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AccountContent />
    </Suspense>
  );
}
