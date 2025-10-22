import React from "react";
import { Filter, Tags, PackageSearch, X, DollarSign } from "lucide-react";

interface Props {
  showFilters: boolean;
  toggleFilters: () => void;
  stockFilter: "all" | "in" | "out";
  setStockFilter: (v: any) => void;
  categoryFilter: string[];
  setCategoryFilter: (v: string[]) => void;
  categoryOptions: string[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  priceRange: { min: number; max: number };
  setPriceRange: (v: { min: number; max: number }) => void;
}

const ShopFilter: React.FC<Props> = ({
  showFilters,
  toggleFilters,
  stockFilter,
  setStockFilter,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  hasActiveFilters,
  clearFilters,
  priceRange,
  setPriceRange,
}) => {
  const MIN = 0;
  const MAX = 1000;
  const STEP = 10;
  const minGap = 10;

  const handleCategoryChange = (cat: string) => {
    if (categoryFilter.includes(cat)) {
      setCategoryFilter(categoryFilter.filter((c) => c !== cat));
    } else {
      setCategoryFilter([...categoryFilter, cat]);
    }
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (priceRange.max - newMin >= minGap) {
      setPriceRange({ ...priceRange, min: newMin });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax - priceRange.min >= minGap) {
      setPriceRange({ ...priceRange, max: newMax });
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 w-[85%] sm:w-2/3 lg:w-64 bg-white z-50 lg:z-0 transform ${
        showFilters ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-out shadow-xl lg:shadow-md rounded-l-2xl lg:rounded-xl border border-orange-100 flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/60">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Filter size={18} className="text-orange-500" /> Filters
        </h3>
        <button
          onClick={toggleFilters}
          className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[80vh]">
        {/* Category */}
        <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-200">
          <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Tags size={14} className="text-orange-600" />
            Category
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {categoryOptions.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={categoryFilter.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-200 cursor-pointer accent-orange-500"
                />
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-200">
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <DollarSign size={14} className="text-orange-600" />
            Price Range
          </label>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Min: ${priceRange.min}</span>
              <span>Max: ${priceRange.max}</span>
            </div>

            <div className="relative">
              <div className="absolute w-full h-1.5 bg-orange-100 rounded-full top-1/2 -translate-y-1/2" />
              <div
                className="absolute h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-md transition-all duration-200"
                style={{
                  left: `${((priceRange.min - MIN) / (MAX - MIN)) * 100}%`,
                  right: `${
                    100 - ((priceRange.max - MIN) / (MAX - MIN)) * 100
                  }%`,
                }}
              />
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={priceRange.min}
                onChange={handleMinChange}
                className="range-thumb absolute w-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 30,
                }}
              />
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={priceRange.max}
                onChange={handleMaxChange}
                className="range-thumb absolute w-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                }}
              />

              <style jsx>{`
                .range-thumb::-webkit-slider-thumb {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: white;
                  border: 2px solid #f97316;
                  cursor: pointer;
                  transition: all 0.2s ease;
                }
                .range-thumb::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-200">
          <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
            <PackageSearch size={14} className="text-orange-600" />
            Availability
          </label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm font-semibold focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none bg-white transition-all cursor-pointer"
          >
            <option value="all">All</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default ShopFilter;
