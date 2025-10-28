import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ProductCard from "../section/ProductCard";
import { getProducts } from "../../api/productApi";

// =======================
// 🔹 Types
// =======================
interface Product {
  id: string;
  title: string;
  price?: number;
  salePrice?: number | null;
  regularPrice?: number | null;
  oldPrice?: number | null;
  stock?: number;
  images?: string[];
  status?: string;
}

interface Section {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  swiperClass: string;
}

interface SectionHeaderProps {
  section: Section;
  swiperClass: string;
  isSliderMode: boolean;
}

interface ListNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (idx: number) => void;
  isAnimating: boolean;
}

type ViewMode = "slider" | "list";

interface ProductViewProps {
  viewMode?: ViewMode;
  status?: string | string[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxProducts?: number;
  showNavigation?: boolean;
  itemsPerPage?: number; // 🆕 Số sản phẩm mỗi trang
}

// =======================
// 🔹 Constants
// =======================
const SWIPER_CONFIG = {
  slidesPerView: 2,
  spaceBetween: 16,
  speed: 800,
  autoplayDelay: 3500,
  animationDuration: 600,
  breakpoints: {
    640: { slidesPerView: 3, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
    1280: { slidesPerView: 6, spaceBetween: 24 },
  },
};

const STATUS_CONFIG: Record<
  string,
  { title: string; subtitle: string; icon: React.ReactNode }
> = {
  latest: {
    title: "Latest Products",
    subtitle: "Discover our newest arrivals with exclusive deals",
    icon: <TrendingUp size={18} />,
  },
  coming: {
    title: "Coming Soon",
    subtitle: "Pre-order exclusive releases",
    icon: <Sparkles size={18} />,
  },
};

// =======================
// 🔹 Utility Functions
// =======================
const mapProductData = (product: Product) => ({
  id: product.id,
  img: product.images?.[0] || "no-image.png",
  title: product.title,
  salePrice: product.salePrice ?? product.price,
  regularPrice: product.regularPrice ?? product.oldPrice,
  stock: product.stock,
});

const filterProductsByStatus = (
  products: Product[],
  status?: string | string[],
  maxProducts?: number
) => {
  let filtered = products;

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    filtered = products.filter((p) => p.status && statuses.includes(p.status));
  }

  return maxProducts ? filtered.slice(0, maxProducts) : filtered;
};

// 🆕 Chunk products thành các trang
const chunkProducts = (
  products: Product[],
  itemsPerPage: number
): Product[][] => {
  const chunks: Product[][] = [];
  for (let i = 0; i < products.length; i += itemsPerPage) {
    chunks.push(products.slice(i, i + itemsPerPage));
  }
  return chunks;
};

// =======================
// 🔹 Section Header (Memoized)
// =======================
const SectionHeader = memo<SectionHeaderProps>(
  ({ section, swiperClass, isSliderMode }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {section.icon}
            <span>Special Collection</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
            {section.title}
          </h2>

          <p className="text-gray-600 text-base max-w-xl mx-auto md:mx-0 mt-2">
            {section.subtitle}
          </p>
        </div>

        {isSliderMode && (
          <div className="flex items-center gap-4">
            <button
              className={`${swiperClass}-prev w-12 h-12 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center group`}
              aria-label="Previous"
            >
              <ChevronLeft
                size={24}
                className="group-hover:scale-110 transition-transform"
              />
            </button>

            <div className={`${swiperClass}-pagination flex gap-2`} />

            <button
              className={`${swiperClass}-next w-12 h-12 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center group`}
              aria-label="Next"
            >
              <ChevronRight
                size={24}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

// =======================
// 🔹 List Navigation (Memoized)
// =======================
const ListNavigation = memo<ListNavigationProps>(
  ({ current, total, onPrev, onNext, onDotClick, isAnimating }) => (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrev}
        disabled={isAnimating || total <= 1}
        className="w-14 h-14 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onDotClick(idx)}
              disabled={isAnimating}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-12 bg-gradient-to-r from-orange-500 to-red-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {current + 1} / {total}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={isAnimating || total <= 1}
        className="w-14 h-14 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  )
);
ListNavigation.displayName = "ListNavigation";

// =======================
// 🔹 Custom Hook for Swiper
// =======================
const useSwiper = (section: Section | null, viewMode: ViewMode) => {
  useEffect(() => {
    if (viewMode !== "slider" || !section?.products.length) return;

    const swiperCSS = document.createElement("link");
    swiperCSS.rel = "stylesheet";
    swiperCSS.href =
      "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
    document.head.appendChild(swiperCSS);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
    script.async = true;

    script.onload = () => {
      const Swiper = (window as any).Swiper;

      new Swiper(`.${section.swiperClass}`, {
        ...SWIPER_CONFIG,
        loop: section.products.length > 4,
        grabCursor: true,
        breakpoints: SWIPER_CONFIG.breakpoints,
        navigation: {
          nextEl: `.${section.swiperClass}-next`,
          prevEl: `.${section.swiperClass}-prev`,
        },
        pagination: {
          el: `.${section.swiperClass}-pagination`,
          clickable: true,
          dynamicBullets: true,
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(swiperCSS);
    };
  }, [viewMode, section]);
};

// =======================
// 🔹 Main Component
// =======================
const ProductView: React.FC<ProductViewProps> = ({
  viewMode = "slider",
  status,
  title,
  subtitle,
  icon,
  maxProducts,
  showNavigation = true,
  itemsPerPage = 8, // 🆕 Mặc định 8 sản phẩm mỗi trang
}) => {
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 🆕 Trang hiện tại
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid product data");

        const filteredProducts = filterProductsByStatus(
          data,
          status,
          maxProducts
        );

        if (filteredProducts.length === 0) {
          setSection(null);
          return;
        }

        const defaultConfig =
          status && !Array.isArray(status) ? STATUS_CONFIG[status] : null;

        const newSection: Section = {
          title: title || defaultConfig?.title || "Products",
          subtitle:
            subtitle || defaultConfig?.subtitle || "Browse our collection",
          icon: icon || defaultConfig?.icon || <Sparkles size={18} />,
          products: filteredProducts,
          swiperClass: `product-swiper-${status || "default"}`,
        };

        setSection(newSection);
        setCurrentPage(0); // Reset về trang đầu khi data thay đổi
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [status, maxProducts, title, subtitle, icon]);

  useSwiper(section, viewMode);

  // 🆕 Tính toán phân trang
  const productPages = useMemo(() => {
    if (!section || viewMode !== "list") return [];
    return chunkProducts(section.products, itemsPerPage);
  }, [section, viewMode, itemsPerPage]);

  const totalPages = productPages.length;
  const currentProducts = productPages[currentPage] || [];

  // 🆕 Xử lý chuyển trang
  const handleNext = useCallback(() => {
    if (isAnimating || currentPage >= totalPages - 1) return;
    setIsAnimating(true);
    setCurrentPage((p) => p + 1);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentPage, totalPages]);

  const handlePrev = useCallback(() => {
    if (isAnimating || currentPage <= 0) return;
    setIsAnimating(true);
    setCurrentPage((p) => p - 1);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentPage]);

  const handleDotClick = useCallback(
    (idx: number) => {
      if (!isAnimating && idx !== currentPage) {
        setIsAnimating(true);
        setCurrentPage(idx);
        setTimeout(() => setIsAnimating(false), 500);
      }
    },
    [isAnimating, currentPage]
  );

  if (isLoading)
    return (
      <div className="w-full py-20 text-center text-gray-500 animate-pulse">
        Loading products...
      </div>
    );

  if (!section || !section.products.length)
    return (
      <div className="w-full py-20 text-center text-gray-500">
        No products available.
      </div>
    );

  return (
    <section className="w-full py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

      {viewMode === "slider" && (
        <div>
          <SectionHeader
            section={section}
            swiperClass={section.swiperClass}
            isSliderMode={showNavigation}
          />
          <div className="relative px-4 sm:px-6 md:px-8">
            <div className={`${section.swiperClass} overflow-hidden`}>
              <div className="swiper-wrapper">
                {section.products.map((p) => (
                  <div key={p.id} className="swiper-slide">
                    <ProductCard data={mapProductData(p)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {section.icon}
                <span>Special Collection</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
                {section.title}
              </h2>

              <p className="text-gray-600 text-base max-w-xl mx-auto md:mx-0 mt-2">
                {section.subtitle}
              </p>
            </div>

            {totalPages > 1 && (
              <ListNavigation
                current={currentPage}
                total={totalPages}
                onPrev={handlePrev}
                onNext={handleNext}
                onDotClick={handleDotClick}
                isAnimating={isAnimating}
              />
            )}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 mb-12">
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 transition-all duration-500 ease-in-out ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {currentProducts.map((p) => (
                <ProductCard key={p.id} data={mapProductData(p)} />
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 4px;
          background: linear-gradient(to right, #f97316, #ef4444);
        }
        .swiper-slide { height: auto; }
        [class*="product-swiper-"] { padding: 8px 0; }
      `}</style>
    </section>
  );
};

export default ProductView;
