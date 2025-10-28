import React, { memo } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../section/ProductCard";
import type { Section } from "./ProductView";

interface ProductSliderProps {
  section: Section;
  showNavigation?: boolean;
}

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
  onClick?: () => void;
}>(({ direction, onClick }) => {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:border-transparent rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center"
      aria-label={direction === "prev" ? "Previous" : "Next"}
    >
      <Icon className="md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
    </button>
  );
});
NavButton.displayName = "NavButton";

const ProductSlider: React.FC<ProductSliderProps> = ({
  section,
  showNavigation = true,
}) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: section.products.length > 4,
    slides: {
      perView: 2,
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 480px)": { slides: { perView: 2, spacing: 12 } },
      "(min-width: 640px)": { slides: { perView: 3, spacing: 16 } },
      "(min-width: 768px)": { slides: { perView: 3, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
      "(min-width: 1280px)": { slides: { perView: 5, spacing: 24 } },
      "(min-width: 1536px)": { slides: { perView: 6, spacing: 28 } },
    },
  });

  return (
    <div className="relative px-6 md:px-14">
      <div ref={sliderRef} className="keen-slider">
        {section.products.map((p) => (
          <div key={p.id} className="keen-slider__slide">
            <ProductCard data={mapProductData(p)} />
          </div>
        ))}
      </div>

      {showNavigation && (
        <div className="max-w-7xl mx-auto px-4 md:px-16 mt-8 md:mt-12 flex justify-center gap-2 md:gap-4">
          <NavButton
            onClick={() => instanceRef.current?.prev()}
            direction="prev"
          />
          <NavButton
            onClick={() => instanceRef.current?.next()}
            direction="next"
          />
        </div>
      )}
    </div>
  );
};

export default ProductSlider;
