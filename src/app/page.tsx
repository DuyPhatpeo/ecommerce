import React from "react";
import HeroSection from "@/components/home/HeroSection";
import SubBannerGrid from "@/components/home/SubBannerGrid";
import SaleTetSection from "@/components/home/SaleTetSection";
import BrandShowcase from "@/components/home/BrandShowcase";
import MiddleBanner from "@/components/home/MiddleBanner";
import FlashDealSection from "@/components/home/FlashDealSection";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import TrendNewsSection from "@/components/home/TrendNewsSection";
import FavoriteSportsSection from "@/components/home/FavoriteSportsSection";
import ServicesBanner from "@/components/home/ServicesBanner";

export default function HomePage() {
  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section (Solar Yellow Adidas Ultraboost) */}
      <HeroSection />

      {/* 2. Sub-Banners Grid (Nike Zoom Fly 6, Men/Women, Couple Sneaker) */}
      <SubBannerGrid />

      {/* 3. Giày Sale Tết – Ưu Đãi Bùng Nổ Đón Xuân (Red deal banner + 6 shoes) */}
      <SaleTetSection />

      {/* 4. Thương Hiệu Nổi Bật (12 Brand Cards) */}
      <BrandShowcase />

      {/* 5. Middle Banner (ASICS Thoải mái hơn) */}
      <MiddleBanner />

      {/* 6. Deal Khuyến Mãi Hôm Nay (Li-Ning + Live Countdown) */}
      <FlashDealSection />

      {/* 7. Ngay lúc này BẠN TÌM GÌ HÔM NAY? (Top Sneaker Watermark NIKE) */}
      <CategoryDiscovery />

      {/* 8. Tin Tức Xu Hướng Thời Trang Mới Nhất (Featured + 3 Cards) */}
      <TrendNewsSection />

      {/* 9. Môn Thể Thao Yêu Thích (Chạy bộ, Bóng rổ, Luyện tập, Tennis) */}
      <FavoriteSportsSection />

      {/* 10. 4 Cam Kết Dịch Vụ */}
      <ServicesBanner />
    </div>
  );
}
