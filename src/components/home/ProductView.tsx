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

type ViewMode = "slider" | "list";

interface ProductViewProps {
  viewMode?: ViewMode;
  status?: string | string[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxProducts?: number;
  showNavigation?: boolean;
  itemsPerPage?: number;
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
    640: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
    1280: { slidesPerView: 6, spaceBetween: 24 },
  },
} as const;

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

const ANIMATION_DURATION = 500;

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
  if (!products.length) return [];

  let filtered = products;

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    filtered = products.filter((p) => p.status && statuses.includes(p.status));
  }

  return maxProducts ? filtered.slice(0, maxProducts) : filtered;
};

const chunkProducts = (
  products: Product[],
  itemsPerPage: number
): Product[][] => {
  if (!products.length || itemsPerPage <= 0) return [];

  const chunks: Product[][] = [];
  for (let i = 0; i < products.length; i += itemsPerPage) {
    chunks.push(products.slice(i, i + itemsPerPage));
  }
  return chunks;
};

// =======================
// 🔹 Navigation Button (Memoized & Reusable)
// =======================
const NavButton = memo<{
  direction: "prev" | "next";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel: string;
  size?: "default" | "large";
}>(
  ({
    direction,
    onClick,
    disabled,
    className = "",
    ariaLabel,
    size = "default",
  }) => {
    const iconMap = {
      prev: { default: ChevronLeft, large: ArrowLeft },
      next: { default: ChevronRight, large: ArrowRight },
    };

    const Icon = iconMap[direction][size];
    const sizeClass =
      size === "large"
        ? "w-12 h-12 md:w-14 md:h-14 md:rounded-2xl"
        : "w-10 h-10 md:w-12 md:h-12";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${sizeClass} bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={ariaLabel}
      >
        <Icon
          size={size === "large" ? 18 : 20}
          className="md:w-6 md:h-6 group-hover:scale-110 transition-transform"
        />
      </button>
    );
  }
);
NavButton.displayName = "NavButton";

// =======================
// 🔹 Pagination Dots (Memoized & Reusable)
// =======================
const PaginationDots = memo<{
  total: number;
  current: number;
  onDotClick: (idx: number) => void;
  isAnimating: boolean;
}>(({ total, current, onDotClick, isAnimating }) => (
  <div className="flex gap-1.5 md:gap-2">
    {Array.from({ length: total }, (_, idx) => (
      <button
        key={idx}
        onClick={() => onDotClick(idx)}
        disabled={isAnimating}
        aria-label={`Go to page ${idx + 1}`}
        className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
          idx === current
            ? "w-8 md:w-12 bg-gradient-to-r from-orange-500 to-red-500"
            : "w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400"
        }`}
      />
    ))}
  </div>
));
PaginationDots.displayName = "PaginationDots";

// =======================
// 🔹 Section Header Content (Memoized & Reusable)
// =======================
const SectionHeaderContent = memo<{ section: Section }>(({ section }) => (
  <div className="flex-1 text-center md:text-left">
    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
      {section.icon}
      <span>Special Collection</span>
    </div>

    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
      {section.title}
    </h2>

    <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto md:mx-0 mt-2">
      {section.subtitle}
    </p>
  </div>
));
SectionHeaderContent.displayName = "SectionHeaderContent";

// =======================
// 🔹 Slider Navigation (Memoized)
// =======================
const SliderNavigation = memo<{ swiperClass: string }>(({ swiperClass }) => (
  <div className="flex items-center gap-2 md:gap-4">
    <NavButton
      direction="prev"
      className={`${swiperClass}-prev`}
      ariaLabel="Previous"
    />
    <div className={`${swiperClass}-pagination flex gap-2`} />
    <NavButton
      direction="next"
      className={`${swiperClass}-next`}
      ariaLabel="Next"
    />
  </div>
));
SliderNavigation.displayName = "SliderNavigation";

// =======================
// 🔹 List Navigation (Memoized)
// =======================
const ListNavigation = memo<{
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (idx: number) => void;
  isAnimating: boolean;
}>(({ current, total, onPrev, onNext, onDotClick, isAnimating }) => (
  <div className="flex items-center gap-3 md:gap-4">
    <NavButton
      direction="prev"
      onClick={onPrev}
      disabled={isAnimating || total <= 1}
      size="large"
      ariaLabel="Previous page"
    />

    <div className="flex flex-col items-center gap-2">
      <PaginationDots
        total={total}
        current={current}
        onDotClick={onDotClick}
        isAnimating={isAnimating}
      />
      <span className="text-xs text-gray-500 font-medium">
        {current + 1} / {total}
      </span>
    </div>

    <NavButton
      direction="next"
      onClick={onNext}
      disabled={isAnimating || total <= 1}
      size="large"
      ariaLabel="Next page"
    />
  </div>
));
ListNavigation.displayName = "ListNavigation";

// =======================
// 🔹 Loading State
// =======================
const LoadingState = memo(() => (
  <div className="w-full py-12 md:py-20 text-center text-gray-500">
    <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-sm md:text-base">Loading products...</p>
  </div>
));
LoadingState.displayName = "LoadingState";

// =======================
// 🔹 Empty State
// =======================
const EmptyState = memo(() => (
  <div className="w-full py-12 md:py-20 text-center text-gray-500">
    <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
    <p className="text-sm md:text-base">No products available.</p>
  </div>
));
EmptyState.displayName = "EmptyState";

// =======================
// 🔹 Product Grid (Memoized)
// =======================
const ProductGrid = memo<{ products: Product[]; isAnimating: boolean }>(
  ({ products, isAnimating }) => (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 transition-all duration-500 ease-in-out ${
        isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} data={mapProductData(p)} />
      ))}
    </div>
  )
);
ProductGrid.displayName = "ProductGrid";

// =======================
// 🔹 Custom Hook for Swiper
// =======================
const useSwiper = (section: Section | null, viewMode: ViewMode) => {
  useEffect(() => {
    if (viewMode !== "slider" || !section?.products.length) return;

    let swiperCSS: HTMLLinkElement | null = null;
    let script: HTMLScriptElement | null = null;
    let swiperInstance: any = null;

    const initSwiper = () => {
      swiperCSS = document.createElement("link");
      swiperCSS.rel = "stylesheet";
      swiperCSS.href =
        "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
      document.head.appendChild(swiperCSS);

      script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
      script.async = true;

      script.onload = () => {
        const Swiper = (window as any).Swiper;
        if (!Swiper || !section) return;

        swiperInstance = new Swiper(`.${section.swiperClass}`, {
          ...SWIPER_CONFIG,
          loop: section.products.length > 4,
          grabCursor: true,
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
    };

    initSwiper();

    return () => {
      if (swiperInstance?.destroy) {
        swiperInstance.destroy(true, true);
      }
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (swiperCSS && document.head.contains(swiperCSS)) {
        document.head.removeChild(swiperCSS);
      }
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
  itemsPerPage = 8,
}) => {
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();

        if (!isMounted) return;

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
        setCurrentPage(0);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (isMounted) setSection(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [status, maxProducts, title, subtitle, icon]);

  useSwiper(section, viewMode);

  // Memoize product pages
  const productPages = useMemo(() => {
    if (!section || viewMode !== "list") return [];
    return chunkProducts(section.products, itemsPerPage);
  }, [section, viewMode, itemsPerPage]);

  const totalPages = productPages.length;
  const currentProducts = productPages[currentPage] || [];

  // Navigation handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (isAnimating || newPage < 0 || newPage >= totalPages) return;

      setIsAnimating(true);
      setCurrentPage(newPage);
      setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
    },
    [isAnimating, totalPages]
  );

  const handleNext = useCallback(() => {
    const nextPage = (currentPage + 1) % totalPages;
    handlePageChange(nextPage);
  }, [currentPage, totalPages, handlePageChange]);

  const handlePrev = useCallback(() => {
    const prevPage = currentPage === 0 ? totalPages - 1 : currentPage - 1;
    handlePageChange(prevPage);
  }, [currentPage, totalPages, handlePageChange]);

  const handleDotClick = useCallback(
    (idx: number) => {
      if (idx !== currentPage) {
        handlePageChange(idx);
      }
    },
    [currentPage, handlePageChange]
  );

  // Loading state
  if (isLoading) return <LoadingState />;

  // Empty state
  if (!section || !section.products.length) return <EmptyState />;

  return (
    <section className="w-full py-8 md:py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-orange-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

      {/* Header Section - Common for both modes */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 md:mb-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <SectionHeaderContent section={section} />
        </div>
      </div>

      {viewMode === "slider" ? (
        <>
          {/* Swiper Products */}
          <div className="relative px-4">
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

          {/* Navigation Controls - Below Products */}
          {showNavigation && (
            <div className="max-w-7xl mx-auto px-4 md:px-16 mt-8 md:mt-12 flex justify-center">
              <SliderNavigation swiperClass={section.swiperClass} />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Product Grid */}
          <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 md:mb-12">
            <ProductGrid products={currentProducts} isAnimating={isAnimating} />
          </div>

          {/* Navigation Controls - Below Products */}
          {totalPages > 1 && showNavigation && (
            <div className="max-w-7xl mx-auto px-4 md:px-16 mt-8 md:mt-12 flex justify-center">
              <ListNavigation
                current={currentPage}
                total={totalPages}
                onPrev={handlePrev}
                onNext={handleNext}
                onDotClick={handleDotClick}
                isAnimating={isAnimating}
              />
            </div>
          )}
        </>
      )}

      {/* Custom Swiper Styles */}
      <style>{`
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s;
        }
        @media (min-width: 768px) {
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: linear-gradient(to right, #f97316, #ef4444);
        }
        @media (min-width: 768px) {
          .swiper-pagination-bullet-active {
            width: 32px;
          }
        }
        .swiper-slide { 
          height: auto; 
          display: flex;
        }
        .swiper-slide > * {
          width: 100%;
        }
        [class*="product-swiper-"] { 
          padding: 8px 0; 
        }
      `}</style>
    </section>
  );
};

export default ProductView;
