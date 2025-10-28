import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "../section/ProductCard";
import type { Section } from "./ProductView";

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
}

interface ProductGridProps {
  section: Section;
  showNavigation?: boolean;
  itemsPerPage?: number;
}

// =======================
// 🔹 Constants
// =======================
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

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  if (!arr.length || size <= 0) return [];
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

// =======================
// 🔹 Navigation Button
// =======================
const NavButton = memo<{
  direction: "prev" | "next";
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel: string;
}>(({ direction, onClick, disabled = false, ariaLabel }) => {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl md:rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={ariaLabel}
    >
      <Icon
        size={18}
        className="md:w-6 md:h-6 group-hover:scale-110 transition-transform"
      />
    </button>
  );
});
NavButton.displayName = "NavButton";

// =======================
// 🔹 Pagination Dots
// =======================
const PaginationDots = memo<{
  total: number;
  current: number;
  onDotClick: (idx: number) => void;
  isAnimating: boolean;
}>(({ total, current, onDotClick, isAnimating }) => {
  if (total <= 1) return null;

  return (
    <div className="flex gap-1.5 md:gap-2">
      {Array.from({ length: total }, (_, idx) => (
        <button
          key={idx}
          onClick={() => onDotClick(idx)}
          disabled={isAnimating}
          aria-label={`Go to page ${idx + 1}`}
          aria-current={idx === current ? "page" : undefined}
          className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
            idx === current
              ? "w-8 md:w-12 bg-gradient-to-r from-orange-500 to-red-500"
              : "w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
});
PaginationDots.displayName = "PaginationDots";

// =======================
// 🔹 Grid Navigation
// =======================
const GridNavigation = memo<{
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (idx: number) => void;
  isAnimating: boolean;
}>(({ current, total, onPrev, onNext, onDotClick, isAnimating }) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <NavButton
        direction="prev"
        onClick={onPrev}
        disabled={isAnimating || total <= 1}
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
        ariaLabel="Next page"
      />
    </div>
  );
});
GridNavigation.displayName = "GridNavigation";

// =======================
// 🔹 Product Grid Display
// =======================
const ProductGridDisplay = memo<{
  products: Product[];
  isAnimating: boolean;
}>(({ products, isAnimating }) => {
  if (!products.length) return null;

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 transition-all duration-500 ease-in-out ${
        isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} data={mapProductData(p)} />
      ))}
    </div>
  );
});
ProductGridDisplay.displayName = "ProductGridDisplay";

// =======================
// 🔹 Custom Hook for Pagination
// =======================
const usePagination = (totalPages: number) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (
        isAnimating ||
        newPage < 0 ||
        newPage >= totalPages ||
        newPage === currentPage
      ) {
        return;
      }

      setIsAnimating(true);
      setCurrentPage(newPage);

      // Scroll to top of section smoothly
      const section = document.querySelector("[data-product-grid]");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
    },
    [isAnimating, totalPages, currentPage]
  );

  const handleNext = useCallback(() => {
    if (totalPages <= 1) return;
    handlePageChange((currentPage + 1) % totalPages);
  }, [currentPage, totalPages, handlePageChange]);

  const handlePrev = useCallback(() => {
    if (totalPages <= 1) return;
    handlePageChange(currentPage === 0 ? totalPages - 1 : currentPage - 1);
  }, [currentPage, totalPages, handlePageChange]);

  const handleDotClick = useCallback(
    (idx: number) => {
      if (idx !== currentPage && idx >= 0 && idx < totalPages) {
        handlePageChange(idx);
      }
    },
    [currentPage, totalPages, handlePageChange]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || totalPages <= 1) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isAnimating, totalPages]);

  return {
    currentPage,
    isAnimating,
    handleNext,
    handlePrev,
    handleDotClick,
  };
};

// =======================
// 🔹 Main Component
// =======================
const ProductGrid: React.FC<ProductGridProps> = ({
  section,
  showNavigation = true,
  itemsPerPage = 8,
}) => {
  const productPages = useMemo(() => {
    if (!section?.products?.length) return [];
    return chunkArray(section.products, itemsPerPage);
  }, [section?.products, itemsPerPage]);

  const totalPages = productPages.length;

  const { currentPage, isAnimating, handleNext, handlePrev, handleDotClick } =
    usePagination(totalPages);

  const currentProducts = useMemo(() => {
    return productPages[currentPage] || [];
  }, [productPages, currentPage]);

  if (!section?.products?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 text-center text-gray-500">
        <p className="text-sm md:text-base">No products to display.</p>
      </div>
    );
  }

  return (
    <div data-product-grid>
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 md:mb-12">
        <ProductGridDisplay
          products={currentProducts}
          isAnimating={isAnimating}
        />
      </div>

      {/* Navigation */}
      {showNavigation && totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 md:px-16 mt-8 md:mt-12 flex justify-center">
          <GridNavigation
            current={currentPage}
            total={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
            onDotClick={handleDotClick}
            isAnimating={isAnimating}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
