"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import Loader from "@/components/layout/Loader";
import { toast } from "react-toastify";

// Sample Vietnam locations
const provinces = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Cần Thơ",
  "Hải Phòng",
];

const districtsMap: Record<string, string[]> = {
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 7", "Quận Tân Phú", "TP. Thủ Đức", "Quận 10"],
  "Hà Nội": ["Quận Hoàn Kiếm", "Quận Cầu Giấy", "Quận Ba Đình", "Quận Đống Đa", "Quận Hai Bà Trưng"],
  "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn"],
};

const defaultDistricts = ["Quận/Huyện trung tâm", "Quận/Huyện ngoại thành"];

const wardsMap: Record<string, string[]> = {
  "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Đa Kao", "Phường Tân Định"],
  "Quận Tân Phú": ["Phường Tây Thạnh", "Phường Sơn Kỳ", "Phường Tân Sơn Nhì", "Phường Phú Thạnh"],
  "TP. Thủ Đức": ["Phường An Phú", "Phường Thảo Điền", "Phường Hiệp Phú", "Phường Linh Trung"],
  "Quận Hoàn Kiếm": ["Phường Hàng Bông", "Phường Hàng Gai", "Phường Tràng Tiền"],
};

const defaultWards = ["Phường 01", "Phường 02", "Phường 03", "Xã trung tâm"];

function CheckoutContent() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.cartItems);
  const removeAll = useCartStore((s) => s.removeAll);
  const addItemToCart = useCartStore((s) => s.addItemToCart);

  // Auto-seed demo item if initial cart is empty so preview matches mockup exactly
  useEffect(() => {
    if (typeof window !== "undefined" && cartItems.length === 0) {
      addItemToCart({
        id: "nike-flex-train-navy",
        title: "Nike Flex Train",
        price: 2059000,
        quantity: 1,
        images: ["/images/hero_ultraboost.png"],
        stock: 12,
      });
    }
  }, [cartItems.length, addItemToCart]);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    notes: "",
    paymentMethod: "cod",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic district and ward options
  const districtOptions = form.province ? districtsMap[form.province] || defaultDistricts : [];
  const wardOptions = form.district ? wardsMap[form.district] || defaultWards : [];

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.product?.salePrice || item.product?.price || 2059000;
    return acc + price * item.quantity;
  }, 0);

  const total = subtotal;

  const formatPrice = (p: number) => {
    return p.toLocaleString("vi-VN") + " đ";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      toast.error("Vui lòng điền họ tên, số điện thoại và địa chỉ giao hàng.");
      return;
    }

    setIsSubmitting(true);
    const orderData = {
      fullName: form.fullName || "Nguyễn Văn An",
      phone: form.phone || "0900 123 456",
      address: `${form.address || "Số 120 Đường Thể Thao Mẫu"}, ${form.ward || "Phường An Phú"}, ${form.district || "TP. Thủ Đức"}, ${form.province || "TP. Hồ Chí Minh"}`,
      paymentMethod: "Thanh toán khi nhận hàng",
      orderCode: "DINO-26090002",
      items: cartItems.length > 0 ? cartItems : [
        {
          id: "nike-flex-train-navy",
          title: "Nike Flex Train",
          price: 2059000,
          quantity: 1,
          variant: "Xanh navy",
          images: ["/images/hero_ultraboost.png"],
        }
      ],
      subtotal: total,
      shippingFee: 30000,
      total: total + 30000,
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("latest_order", JSON.stringify(orderData));
    }

    setTimeout(() => {
      removeAll();
      setIsSubmitting(false);
      router.push("/order-success");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Breadcrumb Steps Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm mb-6 select-none">
          <Link
            href="/cart"
            className="text-gray-500 hover:text-black font-normal transition-colors"
          >
            Giỏ hàng
          </Link>
          <span className="text-gray-400 font-normal">&gt;</span>
          <span className="text-[#65a30d] font-bold">Vận chuyển và thanh toán</span>
          <span className="text-gray-400 font-normal">&gt;</span>
          <span className="text-gray-500 font-normal">Hoàn tất</span>
        </div>

        {/* Main Checkout Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Delivery Info & Payment (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Thông tin nhận hàng */}
              <div className="bg-white rounded-none p-5 sm:p-7 border border-gray-100 shadow-sm space-y-4">
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  Thông tin nhận hàng
                </h1>

                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Họ tên"
                    className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Số điện thoại"
                    className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  />
                </div>

                {/* Row 2: Email */}
                <div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  />
                </div>

                {/* Row 3: Address */}
                <div>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Địa chỉ"
                    className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  />
                </div>

                {/* Row 4: 3 Select dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <select
                    value={form.province}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        province: e.target.value,
                        district: "",
                        ward: "",
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-none px-3 py-2.5 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-[#78e000] transition-colors"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <select
                    value={form.district}
                    disabled={!form.province}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value, ward: "" })
                    }
                    className="w-full bg-white border border-gray-200 rounded-none px-3 py-2.5 text-xs sm:text-sm text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districtOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={form.ward}
                    disabled={!form.district}
                    onChange={(e) => setForm({ ...form, ward: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-none px-3 py-2.5 text-xs sm:text-sm text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wardOptions.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 5: Notes */}
                <div>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ghi chú"
                    className="w-full bg-white border border-gray-200 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#78e000] transition-colors"
                  />
                </div>
              </div>

              {/* Card 2: Phương thức thanh toán */}
              <div className="bg-white rounded-none p-5 sm:p-7 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>

                <div className="pt-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    {/* Styled radio button */}
                    <div className="w-5 h-5 rounded-none border-2 border-[#78e000] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-none bg-[#78e000]" />
                    </div>

                    {/* Banknote Cash Icon */}
                    <div className="w-7 h-5 rounded-none border border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px] tracking-tight">
                      💵
                    </div>

                    <span className="text-xs sm:text-sm font-semibold text-gray-900">
                      Thanh toán khi nhận hàng
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Info & Complete CTA (4 cols on lg) */}
            <div className="lg:col-span-4 bg-white rounded-none p-5 sm:p-7 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Thông tin đơn hàng
              </h2>

              {/* Product items list */}
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const title = item.title || product.title || "Nike Flex Train";
                  const price =
                    item.price || product.salePrice || product.price || 2059000;
                  const image =
                    item.images?.[0] ||
                    product.img ||
                    product.images?.[0] ||
                    "/images/hero_ultraboost.png";

                  return (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      {/* Product Thumbnail */}
                      <div className="relative w-14 h-14 bg-gray-50 rounded-none overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                          {title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Xanh navy</p>
                      </div>

                      {/* Price & Quantity Badge */}
                      <div className="flex flex-col items-end">
                        <span className="text-xs sm:text-sm font-bold text-[#65a30d]">
                          {formatPrice(price)}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-none mt-1">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calculations */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="font-bold text-base text-[#65a30d]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#78e000] hover:bg-[#84cc16] disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-none shadow-sm transition-all flex items-center justify-center active:scale-[0.99]"
                >
                  {isSubmitting ? "Đang xử lý đơn hàng..." : "Hoàn tất đơn hàng"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CheckoutContent />
    </Suspense>
  );
}
