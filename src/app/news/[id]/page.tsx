"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiCalendar, FiClock, FiArrowLeft, FiTag, FiShare2 } from "react-icons/fi";
import Loader from "@/components/layout/Loader";
import ServicesBanner from "@/components/home/ServicesBanner";
import { articles, Article } from "../page";

function NewsDetailContent() {
  const params = useParams();
  const id = (params?.id as string) || articles[0].id;
  const article = articles.find((a) => a.id === id) || articles[0];
  const relatedArticles = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="w-full bg-white">
      {/* 1. Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          <span>&gt;</span>
          <Link href="/news" className="hover:text-black transition-colors">
            Tin tức
          </Link>
          <span>&gt;</span>
          <span className="text-primary font-semibold line-clamp-1">{article.title}</span>
        </div>
      </div>

      {/* 2. Article Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-dark text-primary text-xs font-black uppercase px-3.5 py-1 tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-primary pl-4">
              {article.excerpt}
            </p>
          </div>

          {/* Big Hero Banner Image */}
          <div className="relative w-full h-[320px] sm:h-[460px] overflow-hidden mb-10 shadow-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Article Body Content */}
          <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 text-sm sm:text-base">
            <p>
              Trong kỷ nguyên thể thao hiện đại, việc kết hợp giữa công nghệ vật liệu tiên tiến và tư duy thiết kế thẩm mỹ không chỉ dừng lại ở hiệu suất trên đường chạy, mà còn trở thành một phong cách sống truyền cảm hứng mạnh mẽ cho cộng đồng yêu vận động.
            </p>

            <h2 className="text-2xl font-black text-gray-900 pt-4">
              Sự phát triển vượt bậc của công nghệ đệm giày thể thao
            </h2>

            <p>
              Các thương hiệu thể thao hàng đầu như Nike, Adidas và ASICS liên tục nghiên cứu và ứng dụng những giải pháp giảm chấn tiên tiến nhất. Từ lớp bọt siêu nhẹ phản hồi năng lượng cao cho đến cấu trúc đĩa đệm carbon hỗ trợ bật nảy, mỗi đôi giày sinh ra đều là kết tinh của hàng ngàn giờ thử nghiệm trong phòng lab và trên thực tế đường chạy.
            </p>

            <blockquote className="bg-gray-50 border-l-4 border-primary p-6 my-6 text-gray-800 font-bold italic">
              “Một đôi giày thể thao tuyệt vời không chỉ giúp bạn chạy nhanh hơn mà còn bảo vệ từng khớp chân và duy trì cảm hứng vận động bất tận mỗi ngày.”
            </blockquote>

            <h2 className="text-2xl font-black text-gray-900 pt-4">
              Lời khuyên khi lựa chọn trang phục và giày tập
            </h2>

            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Ưu tiên form dáng ôm vừa vặn, có độ co giãn và thoáng khí tự nhiên.</li>
              <li>Chọn đế giày phù hợp với mặt sân (đường nhựa, sân đa năng hay phòng tập gym).</li>
              <li>Thường xuyên kiểm tra độ mòn của gai đế sau mỗi 500 – 800 km sử dụng.</li>
            </ul>

            <p>
              Hãy ghé thăm hệ thống showroom của DINOSPORTS để được đo form chân và trải nghiệm trực tiếp các mẫu giày thể thao chính hãng mới nhất mùa giải 2026.
            </p>
          </article>

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-black text-gray-900 hover:text-primary transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách tin tức</span>
            </Link>
          </div>
        </div>

        {/* Related Articles - aligned with full header width */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">
            Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="bg-gray-50 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                      {item.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ServicesBanner />
    </div>
  );
}

export default function NewsDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <NewsDetailContent />
    </Suspense>
  );
}
