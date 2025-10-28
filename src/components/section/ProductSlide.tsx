import React, { useEffect, memo } from "react";
import ProductCard from "../section/ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SWIPER_CONFIG = {
  slidesPerView: 2,
  spaceBetween: 16,
  speed: 800,
  breakpoints: {
    640: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
    1280: { slidesPerView: 6, spaceBetween: 24 },
  },
};

interface ProductSlideProps {
  products: any[];
  status?: string | string[];
  mapProductData: (p: any) => any;
  showNavigation?: boolean;
}

const ProductSlide = memo(
  ({ products, status, mapProductData, showNavigation }: ProductSlideProps) => {
    const swiperClass = `product-swiper-${status || "default"}`;

    useEffect(() => {
      if (!products.length) return;

      let swiper: any;
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
      document.head.appendChild(css);

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
      script.async = true;
      script.onload = () => {
        const Swiper = (window as any).Swiper;
        swiper = new Swiper(`.${swiperClass}`, {
          ...SWIPER_CONFIG,
          loop: products.length > 4,
          grabCursor: true,
          navigation: {
            nextEl: `.${swiperClass}-next`,
            prevEl: `.${swiperClass}-prev`,
          },
          pagination: {
            el: `.${swiperClass}-pagination`,
            clickable: true,
            dynamicBullets: true,
          },
        });
      };
      document.body.appendChild(script);

      return () => {
        swiper?.destroy?.();
        document.body.removeChild(script);
        document.head.removeChild(css);
      };
    }, [products, swiperClass]);

    return (
      <>
        <div className="relative px-4">
          <div className={`${swiperClass} overflow-hidden`}>
            <div className="swiper-wrapper">
              {products.map((p) => (
                <div key={p.id} className="swiper-slide">
                  <ProductCard data={mapProductData(p)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNavigation && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              className={`${swiperClass}-prev w-10 h-10 flex items-center justify-center rounded-lg border bg-white hover:bg-orange-100 text-gray-600`}
            >
              <ArrowLeft />
            </button>
            <div className={`${swiperClass}-pagination flex gap-2`} />
            <button
              className={`${swiperClass}-next w-10 h-10 flex items-center justify-center rounded-lg border bg-white hover:bg-orange-100 text-gray-600`}
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </>
    );
  }
);

ProductSlide.displayName = "ProductSlide";
export default ProductSlide;
