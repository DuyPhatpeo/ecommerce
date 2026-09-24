"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiShoppingBag, FiStar } from "react-icons/fi";
import SectionBanner from "@/components/shared/SectionBanner";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-toastify";
import Loader from "@/components/layout/Loader";

const sampleProducts = [
  {
    id: "prod-ultraboost-solar",
    title: "Adidas Ultraboost Solar Yellow",
    brand: "Adidas",
    price: 2400000,
    img: "/images/hero_ultraboost.png",
    category: "Chạy Bộ",
  },
  {
    id: "prod-lebron-tr1",
    title: "LeBron TR 1 Multi-Court",
    brand: "Nike",
    price: 3829000,
    img: "/images/hero_ultraboost.png",
    category: "Bóng Rổ",
  },
  {
    id: "prod-nike-flex-train",
    title: "Nike Flex Train Essential",
    brand: "Nike",
    price: 2059000,
    img: "/images/hero_ultraboost.png",
    category: "Luyện Tập",
  },
  {
    id: "prod-nike-metcon-10",
    title: "Nike Metcon 10 Pro",
    brand: "Nike",
    price: 1959000,
    img: "/images/hero_ultraboost.png",
    category: "Luyện Tập",
  },
  {
    id: "prod-nike-af1-retro",
    title: "Nike Air Force 1 Retro '07",
    brand: "Nike",
    price: 5279000,
    img: "/images/hero_ultraboost.png",
    category: "Thời Trang",
  },
  {
    id: "prod-nike-air-max-dn8",
    title: "Nike Air Max Dn8 Leather",
    brand: "Nike",
    price: 6179000,
    img: "/images/hero_ultraboost.png",
    category: "Thời Trang",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const addItemToCart = useCartStore((s) => s.addItemToCart);

  const filtered = sampleProducts.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const handleQuickAdd = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      stock: 10,
      images: [product.img],
    });
    toast.success(`Đã thêm ${product.title} vào giỏ hàng!`);
  };

  const trendingTags = ["Ultraboost", "Nike", "Adidas", "Metcon", "Air Force", "Chạy Bộ"];

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "₫";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SectionBanner
        title="Tìm Kiếm Sản Phẩm"
        subtitle={query ? `Kết quả tìm kiếm cho: "${query}"` : "Tìm kiếm mẫu giày thể thao yêu thích của bạn"}
        category="TÌM KIẾM"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <FiSearch className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập tên giày, thương hiệu (Nike, Adidas, Ultraboost...)"
              className="w-full bg-white text-gray-900 pl-14 pr-6 py-4 rounded-none border border-gray-200 text-sm focus:outline-none focus:border-[#78e000] focus:ring-2 focus:ring-[#78e000]/20 shadow-md"
            />
          </div>

          {/* Trending suggestions */}
          <div className="flex items-center gap-2 mt-4 flex-wrap justify-center text-xs">
            <span className="text-gray-400 font-bold uppercase">Tìm kiếm phổ biến:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-none border border-gray-200 transition-colors font-semibold"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="text-xs font-bold text-gray-500 mb-6">
          Tìm thấy <strong>{filtered.length}</strong> sản phẩm phù hợp
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-none p-16 text-center border border-gray-200 shadow-sm max-w-lg mx-auto">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-xs text-gray-500 mb-6">
              Không có sản phẩm nào khớp với từ khóa của bạn. Hãy thử tìm kiếm với từ khóa khác như "Nike", "Adidas", "Ultraboost".
            </p>
            <button
              onClick={() => setQuery("")}
              className="px-6 py-2.5 bg-[#78e000] text-black font-extrabold text-xs rounded-none shadow hover:scale-105 transition-transform"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-none p-4 flex flex-col justify-between border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group relative"
              >
                <Link href={`/product/${p.id}`} className="block relative w-full h-56 mb-2 bg-[#f8f9fa] rounded-none overflow-hidden p-3 flex items-center justify-center">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-contain p-3"
                  />
                  <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-none">
                    {p.brand}
                  </span>
                </Link>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {p.category}
                  </span>
                  <Link href={`/product/${p.id}`} className="block">
                    <h3 className="font-black text-sm text-gray-900 group-hover:text-[#78e000] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <p className="text-base font-black text-gray-900">{formatPrice(p.price)}</p>
                    <button
                      onClick={(e) => handleQuickAdd(p, e)}
                      className="w-10 h-10 rounded-none bg-[#001a2c] hover:bg-[#78e000] text-white hover:text-black flex items-center justify-center shadow transition-all duration-300 hover:scale-105"
                      title="Thêm vào giỏ"
                    >
                      <FiShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchContent />
    </Suspense>
  );
}
