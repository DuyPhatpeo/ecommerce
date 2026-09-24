"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: string;
  tag: string;
  title: string;
  image: string;
}

const newsList: NewsItem[] = [
  {
    id: "news-1",
    tag: "Tin tức mới",
    title: "Nike Cage Zoom 2 chinh phục mọi sân Tennis",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "news-2",
    tag: "Tin tức mới",
    title: "Gần 200 nhà máy của Nike ở Việt Nam sản xuất...",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "news-3",
    tag: "Tin tức mới",
    title: "Khám Phá Adidas Adizero 2026: Nhanh Hơn...",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80",
  },
];

export default function TrendNewsSection() {
  return (
    <section id="news-section" className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight mb-10">
        TIN TỨC XU HƯỚNG THỜI TRANG MỚI NHẤT
      </h2>

      {/* Featured Big Article */}
      <div className="bg-[#f8f9fa] rounded-none overflow-hidden border border-gray-100 shadow-md grid grid-cols-1 lg:grid-cols-12 mb-10 group">
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] overflow-hidden">
          <Image
            src="/images/banners/news-athleisure.png"
            alt="Phong cách athleisure lên ngôi trong giới trẻ"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            <span className="inline-block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Tin tức nổi bật
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug group-hover:text-[#78e000] transition-colors">
              Phong cách athleisure lên ngôi trong giới trẻ
            </h3>
          </div>

          <div className="pt-6">
            <Link
              href="/about-us"
              className="inline-block text-xs font-black text-gray-900 uppercase tracking-widest border-b-2 border-black hover:border-[#78e000] hover:text-[#78e000] transition-all pb-1"
            >
              XEM THÊM
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsList.map((item) => (
          <div
            key={item.id}
            className="bg-[#f8f9fa] rounded-none overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-300"
          >
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 bg-white">
              <div>
                <span className="inline-block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {item.tag}
                </span>
                <h4 className="font-black text-base text-gray-900 line-clamp-2 leading-snug group-hover:text-[#78e000] transition-colors">
                  {item.title}
                </h4>
              </div>

              <div className="pt-4 mt-2">
                <Link
                  href="/about-us"
                  className="inline-block text-xs font-black text-gray-900 uppercase tracking-widest border-b border-black hover:border-[#78e000] hover:text-[#78e000] transition-all pb-0.5"
                >
                  XEM THÊM
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
