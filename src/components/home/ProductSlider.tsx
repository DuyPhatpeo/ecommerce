import React, { useEffect, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../section/ProductCard";
import type { Section } from "./ProductView";

interface ProductSliderProps {
  section: Section;
  showNavigation?: boolean;
}

// Swiper config
const SWIPER_CONFIG = {
  slidesPerView: 2,
  spaceBetween: 16,
  speed: 800,
  centeredSlides: false,
  centeredSlidesBounds: true,
  breakpoints: {
    640: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
    1280: { slidesPerView: 6, spaceBetween: 24 },
  },
} as const;

const SWIPER_CDN = {
  CSS: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
  JS: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
};

// Chuyển dữ liệu product cho ProductCard
const mapProductData = (product: Section["products"][0]) => ({
  id: product.id,
  img: product.images?.[0] || "no-image.png",
  title: product.title,
  salePrice: product.salePrice ?? product.price,
  regularPrice: product.regularPrice ?? product.oldPrice,
  stock: product.stock,
});

// Navigation Button
const NavButton = memo<{
  direction: "prev" | "next";
  className?: string;
  ariaLabel: string;
}>(({ direction, className = "", ariaLabel }) => {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      className={`w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center ${className}`}
      aria-label={ariaLabel}
    >
      <Icon className="md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
    </button>
  );
});
NavButton.displayName = "NavButton";

// Slider navigation
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

// Hook init Swiper
const useSwiper = (section: Section) => {
  useEffect(() => {
    if (!section?.products.length) return;

    let swiperCSS: HTMLLinkElement | null = null;
    let swiperInstance: any = null;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const initSwiper = async () => {
      if (!document.querySelector(`link[href="${SWIPER_CDN.CSS}"]`)) {
        swiperCSS = document.createElement("link");
        swiperCSS.rel = "stylesheet";
        swiperCSS.href = SWIPER_CDN.CSS;
        document.head.appendChild(swiperCSS);
      }

      try {
        await loadScript(SWIPER_CDN.JS);
        const Swiper = (window as any).Swiper;
        if (!Swiper) return;

        setTimeout(() => {
          const el = document.querySelector(`.${section.swiperClass}`);
          if (!el) return;

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
        }, 50);
      } catch (err) {
        console.error("Swiper load failed:", err);
      }
    };

    initSwiper();

    return () => {
      if (swiperInstance) swiperInstance.destroy(true, true);
      if (swiperCSS?.parentNode) swiperCSS.remove();
    };
  }, [section]);
};

// Main component
const ProductSlider: React.FC<ProductSliderProps> = ({
  section,
  showNavigation = true,
}) => {
  useSwiper(section);

  return (
    <div className="relative px-6 md:px-14">
      <div className={`${section.swiperClass} overflow-hidden`}>
        <div className="swiper-wrapper">
          {section.products.map((p) => (
            <div key={p.id} className="swiper-slide">
              <ProductCard data={mapProductData(p)} />
            </div>
          ))}
        </div>
      </div>

      {showNavigation && (
        <div className="max-w-7xl mx-auto px-4 md:px-16 mt-8 md:mt-12 flex justify-center">
          <SliderNavigation swiperClass={section.swiperClass} />
        </div>
      )}

      <style>{`
        .swiper-pagination-bullet { width: 6px; height: 6px; background: #d1d5db; opacity: 1; transition: all 0.3s; }
        @media (min-width: 768px){ .swiper-pagination-bullet { width: 8px; height: 8px; } }
        .swiper-pagination-bullet-active { width: 24px; border-radius: 4px; background: linear-gradient(to right, #f97316, #ef4444); }
        @media (min-width: 768px){ .swiper-pagination-bullet-active { width: 32px; } }
        .swiper-slide { height: auto; display: flex; }
        .swiper-slide > * { width: 100%; }
        [class*="product-swiper-"] { padding: 8px 0; }
        .swiper-button-disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
      `}</style>
    </div>
  );
};

export default ProductSlider;
