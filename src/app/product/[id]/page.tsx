"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-toastify";
import Loader from "@/components/layout/Loader";
import FavoriteSportsSection from "@/components/home/FavoriteSportsSection";
import ServicesBanner from "@/components/home/ServicesBanner";

const productsCatalog: Record<string, any> = {
  "prod-lebron-tr1": {
    id: "prod-lebron-tr1",
    title: "LeBron TR 1",
    brand: "Nike",
    sku: "PO9214",
    category: "Giày Nam",
    price: 3829000,
    colorName: "Xanh navy",
    colors: ["#1d4ed8", "#0f172a", "#000000", "#cbd5e1"],
    images: [
      "/images/lebron_tr1.jpg",
      "/images/hero_ultraboost.png",
      "/images/hero_ultraboost_studio.jpg",
    ],
    description:
      "LeBron TR 1 được thiết kế chuyên biệt để tối ưu hoá khả năng bám sân, kiểm soát chuyển động đa hướng và hoàn trả lực nảy vượt trội cho các vận động viên thể thao cường độ cao.",
  },
  "prod-ultraboost-solar": {
    id: "prod-ultraboost-solar",
    title: "Adidas Ultraboost Solar Yellow",
    brand: "Adidas",
    sku: "AD8821",
    category: "Chạy Bộ",
    price: 2400000,
    colorName: "Vàng Neon",
    colors: ["#78e000", "#ffffff", "#000000"],
    images: [
      "/images/hero_ultraboost.png",
      "/images/hero_ultraboost_studio.jpg",
      "/images/lebron_tr1.jpg",
    ],
    description:
      "Adidas Ultraboost Solar Yellow mang tinh thần bứt phá mùa hè với công nghệ đệm hạt Boost hoàn trả năng lượng tối đa, thân giày dệt Primeknit ôm sát bàn chân, tạo cảm giác êm ái linh hoạt trên từng bước chạy.",
  },
  default: {
    id: "prod-lebron-tr1",
    title: "LeBron TR 1",
    brand: "Nike",
    sku: "PO9214",
    category: "Giày Nam",
    price: 3829000,
    colorName: "Xanh navy",
    colors: ["#1d4ed8", "#0f172a", "#000000", "#cbd5e1"],
    images: [
      "/images/lebron_tr1.jpg",
      "/images/hero_ultraboost.png",
      "/images/hero_ultraboost_studio.jpg",
    ],
    description:
      "LeBron TR 1 được thiết kế chuyên biệt để tối ưu hoá khả năng bám sân, kiểm soát chuyển động đa hướng và hoàn trả lực nảy vượt trội cho các vận động viên thể thao cường độ cao.",
  },
};

const relatedProducts = [
  {
    id: "prod-nike-free-metcon-6",
    title: "Nike Free Metcon 6",
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-metcon-10",
    title: "Nike Metcon 10",
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-flex-train",
    title: "Nike Flex Train",
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-af1-retro",
    title: "Nike Air Force 1 Retro",
    img: "/images/hero_ultraboost.png",
  },
];

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "prod-lebron-tr1";

  const [product, setProduct] = useState<any>(
    productsCatalog[id] || productsCatalog["default"]
  );
  const [selectedImg, setSelectedImg] = useState<string>(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isDescOpen, setIsDescOpen] = useState<boolean>(true);

  const addItemToCart = useCartStore((s) => s.addItemToCart);

  useEffect(() => {
    // Try fetching from database API
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const found = data.data.find((p: any) => p.id === id);
          if (found) {
            setProduct({
              ...productsCatalog["default"],
              ...found,
              sku: found.sku || "PO9214",
              images: found.img
                ? [found.img, ...productsCatalog["default"].images]
                : productsCatalog["default"].images,
            });
            if (found.img) {
              setSelectedImg(found.img);
            }
          }
        }
      })
      .catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      images: [selectedImg || product.images[0]],
      quantity,
    });
    toast.success(`Đã thêm ${quantity}x ${product.title} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          <span>&gt;</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            Sản phẩm
          </Link>
          <span>&gt;</span>
          <Link
            href="/shop?category=men"
            className="hover:text-black transition-colors"
          >
            {product.category || "Giày Nam"}
          </Link>
          <span>&gt;</span>
          <span className="text-[#78e000] font-semibold">{product.title}</span>
        </div>
      </div>

      {/* 2. Main Product Info */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Vertical Thumbnails + Big Product Image */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-20 flex-shrink-0">
              {product.images?.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(imgUrl)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden border-2 transition-all p-1 bg-white ${
                    selectedImg === imgUrl
                      ? "border-black shadow-md"
                      : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image Container */}
            <div className="relative flex-1 w-full aspect-square sm:min-h-[460px] lg:min-h-[500px] bg-[#f5f5f5] rounded-none overflow-hidden flex items-center justify-center p-6 sm:p-10 border border-gray-100 shadow-sm">
              <Image
                src={selectedImg}
                alt={product.title}
                fill
                priority
                className="object-contain p-6 sm:p-8"
              />
            </div>
          </div>

          {/* Right Column: Title, Sku, Price, Colors, Quantity, CTA buttons */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                <span>
                  Thương hiệu: <strong className="text-gray-800">{product.brand}</strong>
                </span>
                <span>|</span>
                <span>
                  Mã sản phẩm: <strong className="text-gray-800">{product.sku}</strong>
                </span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#78e000]">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Color Selector */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-800 mb-2.5">
                Màu sắc:{" "}
                <span className="font-normal text-gray-600">
                  {product.colorName || "Xanh navy"}
                </span>
              </p>
              <div className="flex items-center gap-3">
                {product.colors?.map((color: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-6 h-6 rounded-none border-2 transition-all ${
                      selectedColor === idx
                        ? "border-[#78e000] scale-110 shadow-sm"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-800 mb-2">Số lượng:</p>
              <div className="inline-flex items-center border border-gray-300 rounded-none overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base"
                >
                  -
                </button>
                <span className="w-12 text-center text-xs font-bold text-gray-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to cart (outline) & Buy now (solid green) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#78e000] text-[#78e000] hover:bg-[#78e000]/10 font-bold text-xs sm:text-sm py-3 px-5 rounded-none transition-colors whitespace-nowrap"
              >
                <FiShoppingBag className="w-4 h-4" />
                <span>Thêm vào giỏ hàng</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 inline-flex items-center justify-center bg-[#78e000] hover:bg-[#84cc16] text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-none shadow-sm transition-colors whitespace-nowrap"
              >
                Mua ngay
              </button>
            </div>

            {/* Description Accordion */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsDescOpen(!isDescOpen)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-black text-gray-900 py-2"
              >
                <span>Mô tả sản phẩm</span>
                <span className="text-gray-400 font-normal">
                  {isDescOpen ? "−" : "+"}
                </span>
              </button>
              {isDescOpen && (
                <div className="text-xs text-gray-600 leading-relaxed pt-2 pb-1 space-y-2">
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section: Sản phẩm liên quan */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12 border-t border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-8">
          Sản phẩm liên quan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group relative bg-[#f5f5f5] rounded-none overflow-hidden aspect-[3/4] flex items-center justify-center p-6 border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Section: MÔN THỂ THAO YÊU THÍCH */}
      <FavoriteSportsSection />

      {/* 5. Section: 4 Cam Kết Dịch Vụ */}
      <ServicesBanner />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductDetailContent />
    </Suspense>
  );
}
