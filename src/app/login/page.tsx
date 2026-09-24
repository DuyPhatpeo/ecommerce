"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
      router.push("/account");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060b11] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#78e000]/10 rounded-none blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#0b141f] border border-gray-800 p-8 sm:p-10 shadow-2xl">
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
            Đăng Nhập Tài Khoản
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Chào mừng bạn đến với cộng đồng vận động viên DINOSPORTS
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="runner@gmail.com"
                className="w-full bg-[#111a24] text-white border border-gray-700 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#78e000]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-gray-300">
                Mật khẩu
              </label>
              <a href="#" className="text-xs text-[#78e000] hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111a24] text-white border border-gray-700 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#78e000]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#78e000] hover:bg-[#84cc16] disabled:opacity-50 text-black font-extrabold text-sm py-3.5 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-6"
          >
            <span>{loading ? "Đang xử lý..." : "Đăng Nhập"}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-800 text-xs text-gray-400">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-[#78e000] font-bold hover:underline">
            Đăng ký thành viên ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
