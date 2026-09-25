import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/register logic
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200 mt-8 sm:mt-0">

        {/* Modal Inner Content */}
        <div className="relative bg-white w-full shadow-2xl rounded-sm overflow-hidden flex flex-col">
          
          {/* Dedicated Close Icon Bar Above Tabs */}
          <div className="flex justify-end p-2 bg-white">
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              title="Đóng"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Header Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-4 text-sm font-black tracking-wider uppercase transition-colors ${
                activeTab === "login"
                ? "text-[#001a2c] border-b-2 border-[#78e000] bg-gray-50/50"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </button>
          <button
            className={`relative flex-1 py-4 text-sm font-black tracking-wider uppercase transition-colors ${
              activeTab === "register"
                ? "text-[#001a2c] border-b-2 border-[#78e000] bg-gray-50/50"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Đăng ký
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-black text-center mb-6 text-[#001a2c]">
            {activeTab === "login" ? "CHÀO MỪNG TRỞ LẠI!" : "TẠO TÀI KHOẢN MỚI"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "register" && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#001a2c] focus:ring-1 focus:ring-[#001a2c] transition-all rounded-none"
                  placeholder="Nhập họ và tên"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#001a2c] focus:ring-1 focus:ring-[#001a2c] transition-all rounded-none"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#001a2c] focus:ring-1 focus:ring-[#001a2c] transition-all rounded-none"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {activeTab === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#78e000] hover:bg-[#84cc16] text-black font-black uppercase tracking-widest text-sm py-3.5 mt-2 transition-transform active:scale-[0.98]"
            >
              {activeTab === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400 font-medium">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6">
              <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                <span className="text-sm font-semibold text-gray-700">Đăng nhập bằng Google</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar for Close Button */}
        <div 
          onClick={onClose}
          className="flex justify-center items-center px-4 py-4 bg-gray-50 border-t border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-center w-full text-gray-800">
            <span className="text-xs font-bold tracking-widest uppercase hover:text-black">Đóng</span>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
