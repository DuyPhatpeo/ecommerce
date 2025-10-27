import React, { useEffect, useState } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import ProductCard from "../section/ProductCard";
import { getProducts } from "../../api/productApi";

interface Product {
  id: number;
  title: string;
  salePrice: number;
  regularPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
}

interface Section {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  swiperClass: string;
}

const ProductSlider: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [swiperInstances, setSwiperInstances] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Product[] = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid product data");

        const latest = data.filter((p) => p.status === "latest");

        setSections([
          {
            title: "Latest Products",
            subtitle: "Discover our newest arrivals with exclusive deals",
            icon: <TrendingUp size={18} />,
            products: latest,
            swiperClass: "latest-swiper",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setSections([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (sections.length === 0 || sections.every((s) => s.products.length === 0))
      return;

    // Load Swiper CSS
    const swiperCSS = document.createElement("link");
    swiperCSS.rel = "stylesheet";
    swiperCSS.href =
      "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
    document.head.appendChild(swiperCSS);

    // Load Swiper JS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const Swiper = window.Swiper;

      const instances = sections.map((section) => {
        if (section.products.length === 0) return null;

        return new Swiper(`.${section.swiperClass}`, {
          slidesPerView: 2,
          spaceBetween: 16,
          speed: 800,
          loop: section.products.length > 4,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          grabCursor: true,
          breakpoints: {
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          },
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
      });

      setSwiperInstances(instances.filter(Boolean));
    };

    document.body.appendChild(script);

    return () => {
      swiperInstances.forEach((swiper) => {
        if (swiper) swiper.destroy(true, true);
      });
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(swiperCSS)) {
        document.head.removeChild(swiperCSS);
      }
    };
  }, [sections.length]);

  if (sections.length === 0 || sections.every((s) => s.products.length === 0)) {
    return (
      <div className="w-full py-20 text-center text-gray-500">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

      {sections.map((section, sectionIdx) => {
        if (section.products.length === 0) return null;

        return (
          <div key={sectionIdx} className={sectionIdx > 0 ? "mt-20" : ""}>
            {/* Header */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16 mb-12">
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

                {/* Navigation Controls */}
                <div className="flex items-center gap-4">
                  <button
                    className={`${section.swiperClass}-prev w-12 h-12 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center group`}
                  >
                    <ChevronLeft
                      size={24}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>

                  <div
                    className={`${section.swiperClass}-pagination flex gap-2`}
                  ></div>

                  <button
                    className={`${section.swiperClass}-next w-12 h-12 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center group`}
                  >
                    <ChevronRight
                      size={24}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Swiper Slider */}
            <div className="relative px-4 sm:px-6 md:px-8">
              <div className={`${section.swiperClass} overflow-hidden`}>
                <div className="swiper-wrapper">
                  {section.products.map((product) => (
                    <div key={product.id} className="swiper-slide">
                      <ProductCard
                        data={{
                          id: product.id,
                          img: product.images?.[0] || "no-image.png",
                          title: product.title,
                          salePrice:
                            product.salePrice ?? (product as any).price,
                          regularPrice:
                            product.regularPrice ?? (product as any).oldPrice,
                          stock: product.stock,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden flex justify-center items-center gap-4 mt-8">
                <button
                  className={`${section.swiperClass}-prev w-10 h-10 bg-white border border-gray-200 text-gray-600 hover:text-white hover:bg-orange-500 rounded-lg transition-all flex items-center justify-center`}
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  className={`${section.swiperClass}-pagination-mobile flex gap-2`}
                ></div>

                <button
                  className={`${section.swiperClass}-next w-10 h-10 bg-white border border-gray-200 text-gray-600 hover:text-white hover:bg-orange-500 rounded-lg transition-all flex items-center justify-center`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "500+", label: "Products Available" },
            { value: "50K+", label: "Happy Customers" },
            { value: "4.9★", label: "Average Rating" },
            { value: "Free", label: "Shipping & Returns" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

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

        .swiper-slide {
          height: auto;
        }

        .latest-swiper,
        .coming-swiper {
          padding: 8px 0;
        }
      `}</style>
    </section>
  );
};

export default ProductSlider;
