"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiMapPin, FiPhone } from "react-icons/fi";

const showrooms = [
  {
    address: "120 Đường Thể Thao Mẫu, Phường An Phú, TP. Thủ Đức, TP. HCM",
    phone: "028 7777 0001",
  },
  {
    address: "450 Đại Lộ Tân Phong Mẫu, Phường Tân Phú, Quận 7, TP. HCM",
    phone: "028 7777 0002",
  },
  {
    address: "88 Phố Tràng Thi Mẫu, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội",
    phone: "024 7777 0001",
  },
];

export default function StoreNewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section id="showroom-section" className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      <div className="bg-dark rounded-none p-8 sm:p-12 lg:p-14 text-white border border-dark-border shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Form: Ưu Đãi Đặc Biệt (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              ƯU ĐÃI ĐẶC BIỆT
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              Luôn cập nhật mọi thông tin về <strong className="text-white">DINOSPORTS</strong> bạn sẽ là người đầu tiên biết về các sản phẩm mới ra mắt, sự kiện đặc biệt và hơn thế nữa.
            </p>

            {subscribed ? (
              <div className="bg-primary/20 border border-primary text-primary p-4 rounded-none text-sm font-bold">
                ✓ Cảm ơn bạn đã đăng ký nhận bản tin của DINOSPORTS!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                  className="flex-1 bg-dark-card text-white text-xs sm:text-sm px-5 py-3.5 rounded-none border border-dark-borderHover focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-black font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-none shadow transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </form>
            )}

            <p className="text-[11px] text-gray-500">
              Bằng cách nhấn nút Đăng ký, bạn đồng ý với chính sách bảo mật và điều khoản của chúng tôi.
            </p>
          </div>

          {/* Right Showrooms: Hệ thống cửa hàng (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-20 rounded-none overflow-hidden bg-gray-800 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80"
                  alt="DINOSPORTS Showroom"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Hãy đến thăm chúng tôi ngoài đời thực:
                </p>
                <h4 className="text-base sm:text-lg font-black text-white">
                  Cửa hàng gần nhất của bạn
                </h4>
              </div>
            </div>

            {/* 3 Showroom locations */}
            <div className="space-y-4 pt-2 border-t border-gray-800/80">
              {showrooms.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FiMapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-gray-200 font-bold">{s.address}</p>
                    <p className="text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <FiPhone className="w-3 h-3" />
                      <span>Liên hệ: {s.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
