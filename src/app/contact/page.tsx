"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiSend,
  FiCheckCircle,
  FiCheck,
} from "react-icons/fi";
import ServicesBanner from "@/components/home/ServicesBanner";
import { toast } from "react-toastify";

// Regional Showroom data
const southShowrooms = [
  {
    name: "Dino Sport – Flagship Saigon",
    image: "/images/showroom_store.jpg",
    address: "Tòa nhà Dino Tower\n120 Đường Thể Thao Mẫu, P. An Phú, TP. Thủ Đức",
    hours: "Thứ 2 - Chủ Nhật: 09:30 - 22:00\n(Cả lễ & Tết)",
    contact: "028 7777 0001 / 0900 111 222",
  },
  {
    name: "Dino Sport – Central Saigon",
    image: "/images/showroom_crescent.jpg",
    address: "TTTM Mẫu Crescent\n450 Đại Lộ Tân Phong Mẫu, Quận 7, TP. HCM",
    hours: "Thứ 2 - Chủ Nhật: 10:00 - 22:00\n(Cả lễ & Tết)",
    contact: "028 7777 0002 / 0900 333 444",
  },
  {
    name: "Dino Sport – West Saigon",
    image: "/images/showroom_estella.jpg",
    address: "360 Đường Tân Bình Mẫu, Phường 14, Quận 3, TP. HCM",
    hours: "Thứ 2 - Chủ Nhật: 09:00 - 21:30\n(Cả lễ & Tết)",
    contact: "028 7777 0003 / 0900 555 666",
  },
];

const northShowrooms = [
  {
    name: "Dino Sport – Hanoi Flagship",
    image: "/images/we_fit_together.jpg",
    address: "Dino Center Hanoi\n88 Phố Tràng Thi Mẫu, Hoàn Kiếm, Hà Nội",
    hours: "Thứ 2 - Chủ Nhật: 09:00 - 21:30\n(Cả lễ & Tết)",
    contact: "024 7777 0001 / 0900 777 888",
  },
];

// FAQ items
const faqListCol1 = [
  {
    id: 1,
    question: "Làm sao để đặt hàng nhanh ngay?",
    answer:
      "Có, chúng tôi hỗ trợ đặt qua hotline hoặc fanpage chính thức. Đội ngũ tư vấn viên sẽ trực tiếp hỗ trợ bạn chọn size, kiểm tra tình trạng kho và tiến hành giao hàng tận nơi siêu tốc.",
  },
  {
    id: 2,
    question: "Chi phí vận chuyển được tính như thế nào?",
    answer:
      "Dino Sports miễn phí vận chuyển cho các đơn hàng trong bán kính 3km và đơn hàng từ 1.500.000đ trên toàn quốc. Các đơn hàng tiêu chuẩn khác áp dụng mức phí đồng giá 30.000đ.",
  },
  {
    id: 3,
    question: "Quy trình đổi trả hàng như thế nào?",
    answer:
      "Quý khách được hỗ trợ đổi size hoặc đổi mẫu trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác, hộp đựng và chưa qua sử dụng trên sân đấu.",
  },
  {
    id: 4,
    question: "Tôi có thể xem trực tiếp sản phẩm ở đâu?",
    answer:
      "Bạn có thể ghé trực tiếp hệ thống showroom của Dino Sports tại TP. Hồ Chí Minh và Hà Nội để trải nghiệm và thử giày trực tiếp.",
  },
];

const faqListCol2 = [
  {
    id: 5,
    question: "Sản phẩm có hoàn toàn chính hãng không?",
    answer:
      "Tất cả sản phẩm tại Dino Sports cam kết 100% chính hãng, có nguồn gốc xuất xứ rõ ràng và được kiểm định kỹ lưỡng bởi chuyên gia trước khi xuất kho đến tay khách hàng.",
  },
  {
    id: 6,
    question: "Thời gian giao hàng mất bao lâu?",
    answer:
      "Khu vực nội thành TP.HCM và Hà Nội nhận hàng hỏa tốc trong 2 - 4 giờ hoặc trong ngày. Đối với các tỉnh thành khác, thời gian giao hàng tiêu chuẩn từ 2 - 3 ngày làm việc.",
  },
  {
    id: 7,
    question: "Có những hình thức thanh toán nào?",
    answer:
      "Chúng tôi hỗ trợ thanh toán linh hoạt: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng qua mã QR VietQR, Thanh toán thẻ Visa/Mastercard và các loại ví điện tử phổ biến.",
  },
  {
    id: 8,
    question: "Mua online giày có vừa vặn không, lỡ chật thì sao?",
    answer:
      "Đội ngũ CSKH sẽ tư vấn chuẩn xác theo bảng size từng thương hiệu trước khi chốt đơn. Nếu mang không vừa chân, Dino Sports hỗ trợ đổi size tận nhà hoàn toàn miễn phí vận chuyển 1 chiều.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    address: "",
    showroom: "",
    message: "",
  });

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIds, setOpenFaqIds] = useState<number[]>([1, 5]);

  const toggleFaq = (id: number) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }
    if (!captchaChecked) {
      toast.error("Vui lòng xác nhận 'Tôi không phải là người máy'");
      return;
    }
    setSubmitted(true);
    toast.success("Gửi tin nhắn liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[220px] sm:h-[260px] bg-dark flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/contact_hero_shelves.jpg"
          alt="Sneaker Showcase Wall"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark" />

        <div className="relative z-10 px-4 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-widest uppercase">
            LIÊN HỆ
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-300 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="text-gray-500">&gt;</span>
            <span className="text-primary font-bold">Liên hệ</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT INFO & FORM SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Intro & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-none text-[11px] font-bold text-gray-700 bg-gray-100 border border-gray-200 uppercase tracking-wider">
                Thông tin liên hệ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Tìm Đôi Giày Hoàn Hảo Cho <br className="hidden sm:inline" />
                Bạn Ngay Hôm Nay
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                Hệ thống showroom hiện đại, chuyên nghiệp cùng đội ngũ am hiểu thể thao
                luôn sẵn sàng chào đón bạn. Hãy ghé thăm để trải nghiệm và tìm kiếm người
                đồng hành hoàn hảo cho từng bước chạy.
              </p>
            </div>

            {/* Dark Information Box */}
            <div className="bg-dark-card rounded-none p-6 sm:p-7 text-white shadow-xl space-y-5 border border-dark-border">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-none bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                    Địa chỉ
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-gray-100 leading-relaxed mt-0.5">
                    Đường D, Kênh 19/5, Tây Thạnh, Tân Phú,
                    <br />
                    Thành phố Hồ Chí Minh 700000
                  </p>
                </div>
              </div>

              {/* Hotline */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-gray-800">
                <div className="w-9 h-9 rounded-none bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                    Hotline tư vấn
                  </span>
                  <a
                    href="tel:19006868"
                    className="text-base sm:text-lg font-black text-white hover:text-primary transition-colors block mt-0.5"
                  >
                    1900 6868
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-gray-800">
                <div className="w-9 h-9 rounded-none bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                    Email
                  </span>
                  <a
                    href="mailto:contact@dinosports.vn"
                    className="text-xs sm:text-sm font-bold text-gray-100 hover:text-primary transition-colors block mt-0.5"
                  >
                    contact@dinosports.vn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-none p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-none bg-lime-100 text-primary flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  Gửi Yêu Cầu Thành Công!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Cảm ơn bạn đã liên hệ với Dino Sports. Chuyên viên tư vấn của chúng tôi
                  sẽ liên hệ lại qua số điện thoại <strong>{formData.phone}</strong> trong
                  thời gian sớm nhất.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      subject: "",
                      address: "",
                      showroom: "",
                      message: "",
                    });
                    setCaptchaChecked(false);
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-none transition-colors"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập họ và tên"
                      className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Nhập email"
                      className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Chủ đề
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Vấn đề thắc mắc"
                      className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Nhập địa chỉ"
                    className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Row 4: Select Showroom */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Chọn showroom gần nhất
                  </label>
                  <select
                    value={formData.showroom}
                    onChange={(e) =>
                      setFormData({ ...formData, showroom: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="">Chọn showroom gần nhất...</option>
                    <option value="estella">
                      Dino Sport – Flagship Saigon (Thủ Đức, TP.HCM)
                    </option>
                    <option value="crescent">
                      Dino Sport – Central Saigon (Quận 7, TP.HCM)
                    </option>
                    <option value="levansy">
                      Dino Sport – West Saigon (Quận 3, TP.HCM)
                    </option>
                    <option value="hanoi">
                      Dino Sport – Hanoi Flagship (Hoàn Kiếm, Hà Nội)
                    </option>
                  </select>
                </div>

                {/* Row 5: Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nội dung lời nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Nội dung chi tiết lời nhắn..."
                    className="w-full bg-white border border-gray-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>

                {/* Row 6: Captcha Mockup */}
                <div className="pt-1">
                  <div
                    onClick={() => setCaptchaChecked(!captchaChecked)}
                    className="inline-flex items-center justify-between gap-6 bg-[#f9f9f9] border border-gray-300 rounded-none px-3.5 py-2.5 cursor-pointer select-none hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-none border flex items-center justify-center transition-colors ${
                          captchaChecked
                            ? "bg-primary border-primary text-black"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {captchaChecked && <FiCheck className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium text-gray-800">
                        Tôi không phải là người máy
                      </span>
                    </div>

                    <div className="flex flex-col items-center pl-4 border-l border-gray-200">
                      <div className="w-6 h-6 rounded-none border-2 border-blue-500 border-t-transparent animate-spin-slow opacity-60 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-blue-600">C</span>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-0.5 leading-none">
                        reCAPTCHA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 7: Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-black font-extrabold text-sm sm:text-base py-3.5 rounded-none shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    <span>Gửi tin nhắn</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3. SHOWROOM LOCATIONS SECTION */}
      <section className="bg-gray-50/70 border-t border-gray-100 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 space-y-14">
          {/* MIỀN NAM */}
          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
                MIỀN NAM
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-gray-500">
                (3 Cửa hàng)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {southShowrooms.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-none border border-gray-200/80 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative w-full h-48 bg-gray-100 rounded-none">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-black text-base text-gray-900 mb-3">
                        {s.name}
                      </h3>
                      <div className="space-y-2.5 text-xs text-gray-600">
                        <div>
                          <span className="font-bold text-gray-900 block mb-0.5">
                            Địa chỉ:
                          </span>
                          <p className="whitespace-pre-line leading-relaxed text-gray-600">
                            {s.address}
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-gray-900 block mb-0.5">
                            Giờ mở cửa:
                          </span>
                          <p className="whitespace-pre-line leading-relaxed text-gray-600">
                            {s.hours}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-xs">
                      <span className="font-bold text-gray-900 block mb-0.5">
                        Liên hệ:
                      </span>
                      <p className="font-semibold text-gray-700">{s.contact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIỀN BẮC */}
          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
                MIỀN BẮC
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-gray-500">
                (1 Cửa hàng)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {northShowrooms.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-none border border-gray-200/80 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative w-full h-48 bg-gray-100 rounded-none">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-black text-base text-gray-900 mb-3">
                        {s.name}
                      </h3>
                      <div className="space-y-2.5 text-xs text-gray-600">
                        <div>
                          <span className="font-bold text-gray-900 block mb-0.5">
                            Địa chỉ:
                          </span>
                          <p className="whitespace-pre-line leading-relaxed text-gray-600">
                            {s.address}
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-gray-900 block mb-0.5">
                            Giờ mở cửa:
                          </span>
                          <p className="whitespace-pre-line leading-relaxed text-gray-600">
                            {s.hours}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-xs">
                      <span className="font-bold text-gray-900 block mb-0.5">
                        Liên hệ:
                      </span>
                      <p className="font-semibold text-gray-700">{s.contact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ / GIẢI ĐÁP THÔNG TIN SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary bg-black px-2.5 py-0.5 rounded-none tracking-wider uppercase">
              FAQ
            </span>
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              GIẢI ĐÁP THÔNG TIN DỊCH VỤ & MUA HÀNG
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight max-w-4xl leading-snug">
            Chúng tôi ở đây để trả lời hết cả câu hỏi của bạn, hỗ trợ 100% mọi thắc
            mắc cho đến khi mọi thứ rõ ràng nhất
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Poster Flyer */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden shadow-lg border border-gray-200">
              <Image
                src="/images/contact_faq_poster.jpg"
                alt="Bứt Phá Phong Cách"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 p-4 rounded-none bg-gray-50 border border-gray-200 text-xs space-y-1">
              <p className="font-bold text-gray-900">Bạn có câu hỏi khác?</p>
              <p className="text-gray-500">
                Hỗ trợ ngay 24/7 qua hotline:{" "}
                <a
                  href="tel:02838767888"
                  className="font-bold text-black hover:text-primary"
                >
                  (028) 3876 7888
                </a>
              </p>
            </div>
          </div>

          {/* Right 2 Columns of Accordions */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sub-col 1 */}
            <div className="space-y-3">
              {faqListCol1.map((item) => {
                const isOpen = openFaqIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-none overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        {item.question}
                      </span>
                      {isOpen ? (
                        <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sub-col 2 */}
            <div className="space-y-3">
              {faqListCol2.map((item) => {
                const isOpen = openFaqIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-none overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        {item.question}
                      </span>
                      {isOpen ? (
                        <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4 SERVICE COMMITMENTS BANNER */}
      <ServicesBanner />
    </div>
  );
}
