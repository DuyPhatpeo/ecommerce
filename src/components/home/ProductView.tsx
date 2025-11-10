import React, { useEffect, useState, useRef, useCallback } from "react";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ProductCard from "../section/ProductCard";
import Button from "../ui/Button";

interface Product {
  id: string;
  title: string;
  price?: number;
  salePrice?: number | null;
  regularPrice?: number;
  oldPrice?: number;
  stock?: number;
  images?: string[];
  status?: string;
  category?: string;
}

interface ProductViewProps {
  status?: string | string[];
  category?: string | string[];
  title?: string;
  maxProducts?: number;
  mode?: "grid" | "slider";
}

const ProductView: React.FC<ProductViewProps> = ({
  status,
  category,
  title = "Sản phẩm",
  maxProducts,
  mode = "grid",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const sliderRef = useRef<HTMLDivElement>(null);

  const computeVisible = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) return 2;
    if (w < 1024) return 3;
    if (w < 1280) return 4;
    return 6;
  }, []);

  useEffect(() => {
    setVisibleCount(computeVisible());
    const onResize = () => setVisibleCount(computeVisible());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeVisible]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid data");

        const filtered = data
          .filter((p) => (p.stock ?? 0) > 0)
          .filter((p) =>
            status ? [status].flat().includes(p.status || "") : true
          )
          .filter((p) =>
            category ? [category].flat().includes(p.category || "") : true
          )
          .slice(0, maxProducts || data.length);

        setProducts(filtered);
      } catch (e) {
        console.error("Lỗi khi tải sản phẩm:", e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [status, category, maxProducts]);

  const maxIndex = Math.max(products.length - visibleCount, 0);

  const handleSlide = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const next =
      dir === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(maxIndex, currentIndex + 1);
    setCurrentIndex(next);
    const target = sliderRef.current.querySelectorAll(".product-card-item")[
      next
    ] as HTMLElement;
    if (target)
      sliderRef.current.scrollTo({
        left: target.offsetLeft - 12,
        behavior: "smooth",
      });
  };

  const canLeft = currentIndex > 0;
  const canRight = currentIndex < maxIndex;

  if (isLoading)
    return (
      <div className="py-16 text-center text-gray-500">
        <div className="w-8 h-8 mx-auto border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
        <p className="mt-3 text-sm">Loading product...</p>
      </div>
    );

  if (!products.length)
    return (
      <div className="py-16 text-center text-gray-500">
        <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
        <p>There are no products.</p>
      </div>
    );

  return (
    <section
      className={`relative w-full py-8 overflow-hidden md:py-16 ${
        mode === "slider"
          ? "bg-transparent"
          : "bg-gradient-to-br from-gray-50 via-white to-white/40"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl md:px-16">
        <h2 className="relative inline-block text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800 bg-clip-text text-transparent leading-[1.1] pb-2">
          {title}
          <span className="absolute left-0 -bottom-1 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-700" />
        </h2>
      </div>

      <div
        className={`mt-10 ${
          mode === "slider"
            ? "px-2 sm:px-4 md:px-6"
            : "max-w-7xl mx-auto px-4 md:px-16"
        }`}
      >
        <div className="relative">
          {/* Slider Container */}
          <div className={mode === "slider" ? "pb-24" : ""}>
            <div
              ref={sliderRef}
              className={
                mode === "slider"
                  ? "overflow-x-auto overflow-y-visible scrollbar-hide"
                  : ""
              }
              style={
                mode === "slider"
                  ? { scrollbarWidth: "none", msOverflowStyle: "none" }
                  : {}
              }
            >
              <div
                className={
                  mode === "slider"
                    ? "flex gap-4 py-2"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                }
              >
                {products.map((p, index) => (
                  <div
                    key={`${p.id}-${index}`}
                    className={
                      mode === "slider"
                        ? "product-card-item flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)] xl:w-[calc(16.666%-16px)]"
                        : ""
                    }
                  >
                    <ProductCard
                      data={{
                        id: p.id,
                        img: p.images?.[0] || "placeholder.jpg",
                        title: p.title,
                        salePrice: p.salePrice ?? p.price,
                        regularPrice: p.regularPrice ?? p.oldPrice,
                        stock: p.stock,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          {mode === "slider" && products.length > visibleCount && (
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 flex justify-center gap-4 z-10">
              <Button
                icon={<ArrowLeft size={22} />}
                onClick={() => handleSlide("left")}
                disabled={!canLeft}
                className="transition-all duration-200 ease-in-out hover:bg-orange-100 hover:text-orange-600 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2"
              />
              <Button
                icon={<ArrowRight size={22} />}
                onClick={() => handleSlide("right")}
                disabled={!canRight}
                className="transition-all duration-200 ease-in-out hover:bg-orange-100 hover:text-orange-600 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductView;
