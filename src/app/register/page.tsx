"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLock, FiMail, FiUser, FiPhone, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đăng ký thành viên DINOSPORTS thành công!");
      router.push("/account");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#001a2c] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#78e000]/10 rounded-none blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#00223a] border border-[#002b47] p-8 sm:p-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 bg-[#78e000] flex items-center justify-center shadow-lg shadow-[#78e000]/20">
              <span className="text-black font-extrabold text-xl leading-none">D</span>
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              DINO<span className="text-[#78e000]">SPORTS</span>
            </span>
          </Link>
          <h2 className="text-xl font-black text-white uppercase tracking-wide">
            Đăng Ký Thành Viên
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Nhận ngay voucher 150.000₫ cho đơn hàng đầu tiên
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
              Họ và tên *
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full bg-[#001a2c] text-white border border-[#003554] pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#78e000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
              Số điện thoại *
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0900 123 456"
                className="w-full bg-[#001a2c] text-white border border-[#003554] pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#78e000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
              Địa chỉ Email *
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="runner@gmail.com"
                className="w-full bg-[#001a2c] text-white border border-[#003554] pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#78e000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
              Mật khẩu *
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#001a2c] text-white border border-[#003554] pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#78e000]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#78e000] hover:bg-[#84cc16] disabled:opacity-50 text-black font-extrabold text-sm py-3.5 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-6"
          >
            <span>{loading ? "Đang tạo tài khoản..." : "Đăng Ký Ngay"}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-[#002b47] text-xs text-gray-400">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-[#78e000] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
