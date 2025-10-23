import React from "react";
import { DollarSign } from "lucide-react";

interface PriceFilterProps {
  priceRange: { min: number; max: number };
  setPriceRange: (v: { min: number; max: number }) => void;
  min: number;
  max: number;
  step?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  setPriceRange,
  min,
  max,
  step = 100000,
}) => {
  const minGapClamped = Math.max(1, Math.floor(step));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (priceRange.max - newMin >= minGapClamped) {
      setPriceRange({ ...priceRange, min: newMin });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax - priceRange.min >= minGapClamped) {
      setPriceRange({ ...priceRange, max: newMax });
    }
  };

  return (
    <div className="bg-orange-50/60 rounded-lg border border-orange-200 p-3">
      <h4 className="flex items-center gap-2 font-semibold text-sm text-gray-800 mb-2">
        <DollarSign size={14} className="text-orange-600" /> Khoảng giá (VNĐ)
      </h4>
      <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
        <span>Min: {priceRange.min.toLocaleString()}₫</span>
        <span>Max: {priceRange.max.toLocaleString()}₫</span>
      </div>

      {/* Thanh kéo */}
      <div className="relative mb-2">
        <div className="absolute w-full h-1.5 bg-orange-100 rounded-full top-1/2 -translate-y-1/2" />
        <div
          className="absolute h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-md transition-all duration-200"
          style={{
            // guard against division by zero when min === max
            left: `${Math.max(
              0,
              Math.min(
                100,
                ((priceRange.min - min) / Math.max(max - min, 1)) * 100
              )
            )}%`,
            right: `${Math.max(
              0,
              Math.min(
                100,
                100 - ((priceRange.max - min) / Math.max(max - min, 1)) * 100
              )
            )}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={priceRange.min}
          onChange={handleMinChange}
          className="range-thumb absolute w-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
          }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={priceRange.max}
          onChange={handleMaxChange}
          className="range-thumb absolute w-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
          }}
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
