"use client";

import React, { useState } from "react";
import { FiChevronDown, FiHelpCircle, FiPhone, FiCheck } from "react-icons/fi";
import SectionBanner from "@/components/shared/SectionBanner";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Chính Hãng & Bảo Hành",
    q: "DINOSPORTS có cam kết 100% giày chính hãng không?",
    a: "Chúng tôi cam kết 100% sản phẩm bán ra đều là hàng chính hãng từ Nike, Adidas, Asics, Puma, v.v. Nếu khách hàng phát hiện hàng giả/nhái, DINOSPORTS cam kết hoàn tiền 200% giá trị đơn hàng và tặng ngay một đôi giày chính hãng miễn phí.",
  },
  {
    category: "Chính Hãng & Bảo Hành",
    q: "Giày mua tại DINOSPORTS được bảo hành trong bao lâu?",
    a: "Mọi sản phẩm giày thể thao tại DINOSPORTS được bảo hành chính hãng từ 6 đến 12 tháng đối với các lỗi kỹ thuật như bong keo, đứt chỉ, rạn nứt đế, xẹp túi khí không do tác động ngoại lực sắc nhọn.",
  },
  {
    category: "Vận Chuyển & Giao Hàng",
    q: "Thời gian giao hàng là bao lâu và có được đồng kiểm không?",
    a: "Tại khu vực nội thành TP. Hồ Chí Minh: Giao hàng hỏa tốc trong 2-4 tiếng hoặc trong ngày. Các tỉnh thành khác: Từ 1 - 3 ngày làm việc. Quý khách hoàn toàn được quyền mở hộp kiểm tra thử size trước khi thanh toán cho nhân viên giao hàng.",
  },
  {
    category: "Vận Chuyển & Giao Hàng",
    q: "Đơn hàng bao nhiêu thì được miễn phí vận chuyển?",
    a: "DINOSPORTS miễn phí vận chuyển toàn quốc cho mọi đơn hàng có giá trị từ 1.000.000₫ trở lên. Với đơn hàng dưới 1.000.000₫, phí vận chuyển đồng giá chỉ 35.000₫.",
  },
  {
    category: "Đổi Trả & Chọn Size",
    q: "Nếu mang không vừa size thì có được đổi không?",
    a: "Có! DINOSPORTS hỗ trợ đổi size miễn phí trong vòng 7 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tem mác, hộp giày và chưa qua sử dụng ngoài trời.",
  },
  {
    category: "Đổi Trả & Chọn Size",
    q: "Làm thế nào để chọn đúng size giày thể thao chuẩn nhất?",
    a: "Đối với giày chạy bộ hoặc thi đấu, chúng tôi khuyên bạn nên chọn tăng thêm 0.5 đến 1 size (EUR) so với giày đi làm hằng ngày để chân có khoảng trống khi vận động. Bạn cũng có thể liên hệ Hotline 1900 6868 để được chuyên viên đo chân tư vấn chính xác.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>("Tất cả");

  const categories = ["Tất cả", "Chính Hãng & Bảo Hành", "Vận Chuyển & Giao Hàng", "Đổi Trả & Chọn Size"];

  const filteredFaqs = faqs.filter(
    (f) => selectedCat === "Tất cả" || f.category === selectedCat
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SectionBanner
        title="Câu Hỏi Thường Gặp (FAQ)"
        subtitle="Giải đáp nhanh mọi thắc mắc về sản phẩm, chính sách bảo hành, đổi size và vận chuyển."
        category="HỖ TRỢ KHÁCH HÀNG"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === c
                  ? "bg-[#78e000] text-black shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200/80 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0 transition-transform ${
                      isOpen ? "rotate-180 bg-[#78e000] text-black" : ""
                    }`}
                  >
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Need Help Box */}
        <div className="max-w-4xl mx-auto mt-14 bg-[#001a2c] p-8 text-center text-white border border-[#002b47] shadow-xl">
          <FiHelpCircle className="w-10 h-10 text-[#78e000] mx-auto mb-3" />
          <h3 className="text-xl font-black uppercase mb-2">Vẫn Còn Câu Hỏi Khác?</h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6">
            Đừng ngần ngại liên hệ trực tiếp với chúng tôi để nhận được sự hỗ trợ nhiệt tình từ các chuyên gia thể thao.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:19006868"
              className="inline-flex items-center gap-2 bg-[#78e000] text-black font-extrabold text-xs sm:text-sm px-6 py-3 shadow hover:scale-105 transition-transform"
            >
              <FiPhone className="w-4 h-4" />
              <span>Gọi Hotline 1900 6868</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm px-6 py-3 transition-colors"
            >
              Gửi Tin Nhắn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
