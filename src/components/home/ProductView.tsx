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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

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

  const handleSlide = useCallback(
    (dir: "left" | "right") => {
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
          left: target.offsetLeft - 8,
          behavior: "smooth",
        });
    },
    [currentIndex, maxIndex]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!sliderRef.current || mode !== "slider") return;
      setIsDragging(true);
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
      setDragDistance(0);
      sliderRef.current.style.cursor = "grabbing";
      e.preventDefault();
    },
    [mode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      e.preventDefault();
      const x = e.pageX - sliderRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      setDragDistance(Math.abs(walk));
      sliderRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    if (!sliderRef.current) return;

    const wasDragging = dragDistance > 10;

    setIsDragging(false);
    sliderRef.current.style.cursor = "grab";

    if (wasDragging) {
      const cards = sliderRef.current.querySelectorAll(".product-card-item");
      let closestIndex = 0;
      let minDiff = Infinity;

      cards.forEach((card, index) => {
        const el = card as HTMLElement;
        const diff = Math.abs(el.offsetLeft - sliderRef.current!.scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      setCurrentIndex(Math.min(closestIndex, maxIndex));

      const targetCard = cards[closestIndex] as HTMLElement;
      if (targetCard) {
        sliderRef.current.scrollTo({
          left: targetCard.offsetLeft - 8,
          behavior: "smooth",
        });
      }
    }

    setTimeout(() => setDragDistance(0), 100);
  }, [dragDistance, maxIndex]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleMouseUp();
    }
  }, [isDragging, handleMouseUp]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!sliderRef.current || mode !== "slider") return;
      setIsDragging(true);
      setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
      setDragDistance(0);
    },
    [mode]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;
      const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      setDragDistance(Math.abs(walk));
      sliderRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  const canLeft = currentIndex > 0;
  const canRight = currentIndex < maxIndex;

  if (isLoading)
    return (
      <div className="py-20 text-center">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
          <Sparkles
            className="absolute text-orange-500 animate-pulse"
            size={24}
          />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">
          Đang tải sản phẩm...
        </p>
      </div>
    );

  if (!products.length)
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-50">
          <Sparkles size={40} className="text-orange-400" />
        </div>
        <p className="text-lg font-medium text-gray-700">
          Không có sản phẩm nào
        </p>
        <p className="mt-1 text-sm text-gray-500">Vui lòng thử lại sau</p>
      </div>
    );

  return (
    <section
      className={`relative w-full py-12 md:py-20 overflow-hidden ${
        mode === "slider"
          ? "bg-transparent"
          : "bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl md:px-16">
        {/* Title với animation gradient */}
        <div className="relative inline-block">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent leading-tight pb-3">
            {title}
          </h2>
          <div className="absolute left-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-transparent w-24 animate-pulse" />
        </div>
      </div>

      <div
        className={`mt-12 ${
          mode === "slider"
            ? "px-2 sm:px-4 md:px-6"
            : "max-w-7xl mx-auto px-4 md:px-16"
        }`}
      >
        <div className="relative">
          <div className={mode === "slider" ? "pb-20" : ""}>
            <div
              ref={sliderRef}
              className={
                mode === "slider"
                  ? "overflow-x-auto overflow-y-visible scrollbar-hide"
                  : ""
              }
              style={
                mode === "slider"
                  ? {
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      cursor: isDragging ? "grabbing" : "grab",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    }
                  : {}
              }
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={
                  mode === "slider"
                    ? "flex gap-3 sm:gap-4 py-2"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
                }
              >
                {products.map((p, index) => (
                  <div
                    key={`${p.id}-${index}`}
                    className={
                      mode === "slider"
                        ? "product-card-item flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] xl:w-[calc(16.666%-16px)]"
                        : ""
                    }
                    style={{
                      pointerEvents: dragDistance > 10 ? "none" : "auto",
                    }}
                    onClick={(e) => {
                      if (dragDistance > 10) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
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

          {/* Navigation buttons với style cải tiến */}
          {mode === "slider" && products.length > visibleCount && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex justify-center gap-3 z-10">
              <Button
                icon={<ArrowLeft size={20} strokeWidth={2.5} />}
                onClick={() => handleSlide("left")}
                disabled={!canLeft}
                className={`
                  group relative overflow-hidden
                  bg-white shadow-lg rounded-full p-3
                  transition-all duration-300 ease-out
                  ${
                    canLeft
                      ? "hover:bg-orange-500 hover:shadow-xl hover:scale-110 active:scale-95"
                      : "opacity-40 cursor-not-allowed"
                  }
                `}
              >
                <span
                  className={`
                  block transition-colors duration-300
                  ${
                    canLeft
                      ? "text-orange-600 group-hover:text-white"
                      : "text-gray-400"
                  }
                `}
                >
                  <ArrowLeft size={20} strokeWidth={2.5} />
                </span>
              </Button>

              <Button
                icon={<ArrowRight size={20} strokeWidth={2.5} />}
                onClick={() => handleSlide("right")}
                disabled={!canRight}
                className={`
                  group relative overflow-hidden
                  bg-white shadow-lg rounded-full p-3
                  transition-all duration-300 ease-out
                  ${
                    canRight
                      ? "hover:bg-orange-500 hover:shadow-xl hover:scale-110 active:scale-95"
                      : "opacity-40 cursor-not-allowed"
                  }
                `}
              >
                <span
                  className={`
                  block transition-colors duration-300
                  ${
                    canRight
                      ? "text-orange-600 group-hover:text-white"
                      : "text-gray-400"
                  }
                `}
                >
                  <ArrowRight size={20} strokeWidth={2.5} />
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductView;
