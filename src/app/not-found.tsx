"use client";

import React from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center px-6 py-20">
      <h1 className="text-8xl sm:text-9xl font-black text-[#78e000] drop-shadow-md mb-4">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
        Không tìm thấy trang yêu cầu
      </h2>
      <p className="text-sm text-gray-500 mb-8 max-w-md">
        Trang bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#78e000] hover:bg-[#84cc16] text-black font-extrabold px-7 py-3.5 rounded-none shadow transition-all hover:scale-105"
      >
        <FiHome className="w-5 h-5" />
        <span>Về trang chủ</span>
      </Link>
    </div>
  );
}
