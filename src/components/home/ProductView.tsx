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

  // Tính số card hiển thị theo kích thước màn hình
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

  // Lấy sản phẩm từ API
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

  // Xử lý drag to scroll
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

    const wasDragging = dragDistance > 10; // Tăng threshold lên 10px

    setIsDragging(false);
    sliderRef.current.style.cursor = "grab";

    // Chỉ snap nếu thực sự kéo (> 10px)
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

      // Smooth scroll đến card gần nhất
      const targetCard = cards[closestIndex] as HTMLElement;
      if (targetCard) {
        sliderRef.current.scrollTo({
          left: targetCard.offsetLeft - 8,
          behavior: "smooth",
        });
      }
    }

    // Reset drag distance
    setTimeout(() => setDragDistance(0), 100);
  }, [dragDistance, maxIndex]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleMouseUp();
    }
  }, [isDragging, handleMouseUp]);

  // Touch support cho mobile
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
          {/* Slider / Grid Container */}
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
                    ? "flex gap-2 sm:gap-4 py-2"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
                }
              >
                {products.map((p, index) => (
                  <div
                    key={`${p.id}-${index}`}
                    className={
                      mode === "slider"
                        ? "product-card-item flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-12px)] xl:w-[calc(16.666%-16px)]"
                        : ""
                    }
                    style={{
                      pointerEvents: dragDistance > 10 ? "none" : "auto",
                    }}
                    onClick={(e) => {
                      // Ngăn click nếu vừa kéo
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

          {/* Nút điều hướng */}
          {mode === "slider" && products.length > visibleCount && (
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 flex justify-center gap-4 z-10">
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
