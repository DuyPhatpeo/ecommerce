"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiClock, FiArrowRight, FiTag, FiSearch } from "react-icons/fi";
import ServicesBanner from "@/components/home/ServicesBanner";

export interface Article {
  id: string;
  title: string;
  tag: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    id: "athleisure-trend-2026",
    title: "Phong cách Athleisure lên ngôi: Xu hướng thời trang thể thao đường phố",
    tag: "XU HƯỚNG",
    category: "Thời trang Athleisure",
    date: "24/09/2026",
    readTime: "5 phút đọc",
    excerpt:
      "Sự kết hợp giữa hiệu năng vận động chuyên nghiệp và phong cách thời trang đường phố đương đại đang định hình lại toàn bộ tủ đồ của giới trẻ năng động.",
    image: "/images/banners/news-athleisure.png",
    featured: true,
  },
  {
    id: "marathon-training-guide",
    title: "Cẩm nang chạy bộ 42KM: Bí quyết chọn giày và phân phối thể lực cho giải Marathon",
    tag: "CHẠY BỘ",
    category: "Cẩm nang chạy bộ",
    date: "22/09/2026",
    readTime: "8 phút đọc",
    excerpt:
      "Tất tần tật những kinh nghiệm vàng từ vận động viên chuyên nghiệp giúp bạn chinh phục cự ly marathon đầu tiên mà không gặp chấn thương cơ bắp.",
    image: "/images/news_marathon.jpg",
  },
  {
    id: "sneaker-carbon-tech",
    title: "Công nghệ đĩa đệm Carbon: Bước đột phá giúp phá vỡ mọi kỷ lục tốc độ",
    tag: "CÔNG NGHỆ",
    category: "Công nghệ đệm",
    date: "19/09/2026",
    readTime: "6 phút đọc",
    excerpt:
      "Giải mã chi tiết cấu trúc đĩa đệm carbon plate kết hợp bọt khí siêu nhẹ và cách chúng biến từng bước chạy thành động lực đẩy phản hồi cực đại.",
    image: "/images/news_sneaker_tech.jpg",
  },
  {
    id: "nike-zoom-fly-6-review",
    title: "Đánh giá chi tiết Nike Zoom Fly 6: Tối ưu nhịp chuyển động và bền bỉ thi đấu",
    tag: "ĐÁNH GIÁ",
    category: "Xu hướng Sneaker",
    date: "16/09/2026",
    readTime: "4 phút đọc",
    excerpt:
      "Trải nghiệm thực tế sau 100km chạy thử: Form dáng, độ thoáng khí, độ bám trên đường ướt và sự cải tiến so với người tiền nhiệm Zoom Fly 5.",
    image: "/images/banners/nike-tennis-zoomfly.png",
  },
  {
    id: "sneaker-care-tips",
    title: "5 Mẹo vệ sinh và bảo quản giày thể thao chính hãng luôn như mới",
    tag: "MẸO HAY",
    category: "Cẩm nang chạy bộ",
    date: "12/09/2026",
    readTime: "3 phút đọc",
    excerpt:
      "Hướng dẫn giặt giày đúng cách cho chất liệu vải Primeknit, da lộn suede và đế bọt EVA giúp giữ form dáng chuẩn và kéo dài tuổi thọ đế giày.",
    image: "/images/lebron_tr1.jpg",
  },
  {
    id: "asics-gel-technology",
    title: "ASICS GEL & PureGEL: Triết lý chuyển động êm ái cho tâm trí thư thái",
    tag: "THƯƠNG HIỆU",
    category: "Xu hướng Sneaker",
    date: "08/09/2026",
    readTime: "5 phút đọc",
    excerpt:
      "Hành trình hơn 30 năm cải tiến công nghệ giảm chấn GEL kinh điển của thương hiệu Nhật Bản, hướng đến trải nghiệm thể thao lành mạnh toàn diện.",
    image: "/images/banners/asics-comfort.png",
  },
];

const categories = [
  "Tất cả",
  "Xu hướng Sneaker",
  "Cẩm nang chạy bộ",
  "Thời trang Athleisure",
  "Công nghệ đệm",
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((a) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || a.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = articles.find((a) => a.featured) || articles[0];

  return (
    <div className="w-full bg-white">
      {/* 1. Header Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          <span>&gt;</span>
          <span className="text-[#78e000] font-semibold">Tin tức thể thao</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-16">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
          <div>
            <span className="text-xs font-black text-[#78e000] uppercase tracking-widest block mb-1">
              DINOSPORTS BLOG & NEWS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
              TIN TỨC & XU HƯỚNG THỂ THAO
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full bg-gray-50 border border-gray-200 rounded-none pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78e000]"
            />
          </div>
        </div>

        {/* 2. Featured Big Article */}
        {selectedCategory === "Tất cả" && !searchQuery && (
          <div className="mt-8 mb-12">
            <Link
              href={`/news/${featured.id}`}
              className="group block bg-[#06101e] rounded-none overflow-hidden shadow-xl border border-gray-800"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </div>
                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-[#78e000] text-black text-[11px] font-black uppercase px-3 py-1 rounded-none tracking-wider">
                        {featured.tag}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {featured.date}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black leading-snug group-hover:text-[#78e000] transition-colors mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-800 flex items-center justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 text-[#78e000]" />
                      {featured.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-white group-hover:text-[#78e000] transition-colors">
                      <span>Đọc tiếp</span>
                      <FiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 3. Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-none text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#06101e] text-[#78e000] shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="bg-white rounded-none overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-none">
                    {item.tag}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-2.5">
                    <span className="text-[#78e000] font-bold uppercase tracking-wider flex items-center gap-1">
                      <FiTag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-gray-900 leading-snug group-hover:text-[#78e000] transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-gray-500 font-bold border-t border-gray-50">
                <span className="flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5 text-gray-400" />
                  {item.readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-black group-hover:text-[#78e000] transition-colors">
                  <span>Chi tiết</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-none">
            <p className="text-gray-500 text-sm font-bold">
              Không tìm thấy bài viết nào phù hợp với từ khóa của bạn.
            </p>
          </div>
        )}
      </div>

      {/* 5. Commitments Services Banner */}
      <ServicesBanner />
    </div>
  );
}
