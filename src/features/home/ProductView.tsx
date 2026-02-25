import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiChevronRight } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { getProducts } from "../../api/productApi";
import ProductCard from "../../components/shared/ProductCard";

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
  title = "Products",
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  // Calculate number of visible products based on screen width
  const computeVisible = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) return 2;
    if (w < 1024) return 3;
    if (w < 1280) return 4;
    return 6;
  }, []);

  // Update visible count on window resize
  useEffect(() => {
    setVisibleCount(computeVisible());
    const onResize = () => setVisibleCount(computeVisible());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeVisible]);

  // Fetch products
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
        console.error("Error loading products:", e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [status, category, maxProducts]);

  const maxIndex = Math.max(products.length - visibleCount, 0);

  // Handle slide left/right
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
      if (target) {
        sliderRef.current.scrollTo({
          left: target.offsetLeft - 8,
          behavior: "smooth",
        });
      }
    },
    [currentIndex, maxIndex]
  );

  // Mouse drag handlers
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

  // Touch handlers
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

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 text-center"
      >
        <div className="relative inline-flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-200 rounded-full border-t-orange-500"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <BsStars className="absolute text-orange-500" size={24} />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm font-medium text-gray-600"
        >
          Loading products...
        </motion.p>
      </motion.div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-50"
        >
          <BsStars size={40} className="text-orange-400" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-medium text-gray-700"
        >
          No products found
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-1 text-sm text-gray-500"
        >
          Please try again later
        </motion.p>
      </motion.div>
    );
  }

  return (
    <section
      className={`relative w-full py-12 md:py-20 overflow-hidden border-t border-gray-200/50 ${
        mode === "slider"
          ? "bg-transparent"
          : "bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20"
      }`}
    >
      {/* Header Section */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 mx-auto max-w-7xl md:px-16"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Title with gradient animation */}
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent leading-tight pb-3">
              {title}
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute left-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-transparent"
            />
          </div>

          {/* View All Button - only shown in grid mode and when category exists */}
          {mode === "grid" && category && (
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`/shop/${Array.isArray(category) ? category[0] : category}`}
              className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-orange-500 border-2 border-orange-500 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex-shrink-0"
            >
              <span className="text-xs sm:text-sm font-semibold text-orange-600 group-hover:text-white transition-colors whitespace-nowrap">
                View All
              </span>
              <FiChevronRight
                size={18}
                className="text-orange-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                strokeWidth={2.5}
              />
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Products Section */}
      <div
        className={`mt-12 ${
          mode === "slider"
            ? "px-4 md:px-8 lg:px-12 xl:px-16"
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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={
                  mode === "slider"
                    ? "flex gap-3 sm:gap-4 py-2"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
                }
              >
                {products.map((p, index) => (
                  <motion.div
                    key={`${p.id}-${index}`}
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
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
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Navigation buttons - only for slider mode */}
          {mode === "slider" && products.length > visibleCount && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-4 flex justify-center gap-3 z-10"
            >
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: canLeft ? 1.15 : 1 }}
                whileTap={{ scale: canLeft ? 0.95 : 1 }}
                onClick={() => handleSlide("left")}
                disabled={!canLeft}
                className={`
        group flex items-center justify-center w-12 h-12 rounded-2xl
        backdrop-blur-md border border-gray-200 transition-all duration-300
        ${
          canLeft
            ? "bg-white/80 hover:bg-orange-500 shadow-md hover:shadow-lg"
            : "bg-gray-100/50 border-gray-200/50 cursor-not-allowed opacity-50"
        }
      `}
                aria-label="Previous"
              >
                <FiArrowLeft
                  size={20}
                  className={`transition-colors duration-300 ${
                    canLeft
                      ? "text-gray-700 group-hover:text-white"
                      : "text-gray-400"
                  }`}
                  strokeWidth={2}
                />
              </motion.button>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: canRight ? 1.15 : 1 }}
                whileTap={{ scale: canRight ? 0.95 : 1 }}
                onClick={() => handleSlide("right")}
                disabled={!canRight}
                className={`
        group flex items-center justify-center w-12 h-12 rounded-2xl
        backdrop-blur-md border border-gray-200 transition-all duration-300
        ${
          canRight
            ? "bg-white/80 hover:bg-orange-500 shadow-md hover:shadow-lg"
            : "bg-gray-100/50 border-gray-200/50 cursor-not-allowed opacity-50"
        }
      `}
                aria-label="Next"
              >
                <FiArrowRight
                  size={20}
                  className={`transition-colors duration-300 ${
                    canRight
                      ? "text-gray-700 group-hover:text-white"
                      : "text-gray-400"
                  }`}
                  strokeWidth={2}
                />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductView;
