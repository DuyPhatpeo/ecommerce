import React, { useState } from "react";
import { Wallet } from "lucide-react";

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
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
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

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newMin = value === "" ? min : Number(value);
    if (
      newMin >= min &&
      newMin <= max &&
      priceRange.max - newMin >= minGapClamped
    ) {
      setPriceRange({ ...priceRange, min: newMin });
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newMax = value === "" ? max : Number(value);
    if (
      newMax >= min &&
      newMax <= max &&
      newMax - priceRange.min >= minGapClamped
    ) {
      setPriceRange({ ...priceRange, max: newMax });
    }
  };

  return (
    <div className="bg-orange-50/60 rounded-lg border border-orange-200 p-3">
      <h4 className="flex items-center gap-2 font-semibold text-sm text-gray-800 mb-2">
        <Wallet size={16} className="text-orange-600" />
        Price Range (VND)
      </h4>

      <div className="flex justify-between text-xs font-medium mb-3 gap-2">
        <div
          className={`bg-white rounded-lg px-2.5 py-1.5 border-2 transition-all duration-200 ${
            isDragging === "min"
              ? "border-orange-400 shadow-md"
              : "border-orange-200/50"
          }`}
        >
          <div className="text-gray-500 text-[10px] mb-0.5">Min</div>
          <input
            type="text"
            value={priceRange.min.toLocaleString()}
            onChange={handleMinInputChange}
            className="text-orange-600 font-bold w-full bg-transparent border-none outline-none text-xs"
          />
        </div>
        <div
          className={`bg-white rounded-lg px-2.5 py-1.5 border-2 transition-all duration-200 ${
            isDragging === "max"
              ? "border-orange-400 shadow-md"
              : "border-orange-200/50"
          }`}
        >
          <div className="text-gray-500 text-[10px] mb-0.5">Max</div>
          <input
            type="text"
            value={priceRange.max.toLocaleString()}
            onChange={handleMaxInputChange}
            className="text-orange-600 font-bold w-full bg-transparent border-none outline-none text-xs"
          />
        </div>
      </div>

      {/* Thanh kéo */}
      <div className="relative mb-2">
        <div className="absolute w-full h-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full top-1/2 -translate-y-1/2 shadow-inner" />
        <div
          className="absolute h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-lg transition-all duration-200"
          style={{
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
            boxShadow: isDragging
              ? "0 0 20px rgba(251, 146, 60, 0.5)"
              : "0 2px 8px rgba(251, 146, 60, 0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse" />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={priceRange.min}
          onChange={handleMinChange}
          onMouseDown={() => setIsDragging("min")}
          onMouseUp={() => setIsDragging(null)}
          onTouchStart={() => setIsDragging("min")}
          onTouchEnd={() => setIsDragging(null)}
          className={`range-thumb absolute w-full bg-transparent appearance-none pointer-events-none ${
            isDragging === "min" ? "cursor-grabbing" : "cursor-grab"
          } [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-lg ${
            isDragging === "min"
              ? "[&::-webkit-slider-thumb]:cursor-grabbing"
              : "[&::-webkit-slider-thumb]:cursor-grab"
          } [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:shadow-lg ${
            isDragging === "min"
              ? "[&::-moz-range-thumb]:cursor-grabbing"
              : "[&::-moz-range-thumb]:cursor-grab"
          }`}
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
          onMouseDown={() => setIsDragging("max")}
          onMouseUp={() => setIsDragging(null)}
          onTouchStart={() => setIsDragging("max")}
          onTouchEnd={() => setIsDragging(null)}
          className={`range-thumb absolute w-full bg-transparent appearance-none pointer-events-none ${
            isDragging === "max" ? "cursor-grabbing" : "cursor-grab"
          } [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-lg ${
            isDragging === "max"
              ? "[&::-webkit-slider-thumb]:cursor-grabbing"
              : "[&::-webkit-slider-thumb]:cursor-grab"
          } [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:shadow-lg ${
            isDragging === "max"
              ? "[&::-moz-range-thumb]:cursor-grabbing"
              : "[&::-moz-range-thumb]:cursor-grab"
          }`}
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
