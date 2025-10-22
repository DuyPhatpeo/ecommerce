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

  const handleCategoryChange = (cat: string) => {
    if (categoryFilter.includes(cat)) {
      setCategoryFilter(categoryFilter.filter((c) => c !== cat));
    } else {
      setCategoryFilter([...categoryFilter, cat]);
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 w-[85%] sm:w-2/3 lg:w-72 bg-white z-50 lg:z-0 transform ${
        showFilters ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-out shadow-2xl lg:shadow-lg rounded-l-3xl lg:rounded-2xl border-2 border-orange-100 overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b-2 border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/60">
        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
          <Filter size={20} className="text-orange-500" /> Filters
        </h3>
        <button
          onClick={toggleFilters}
          className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Category */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border-2 border-orange-200">
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Tags size={16} className="text-orange-600" />
            Category
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {categoryOptions.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={categoryFilter.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="w-4 h-4 rounded border-2 border-orange-300 text-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer accent-orange-500"
                />
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border-2 border-orange-200">
          <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-orange-600" />
            Price Range
          </label>

          <div className="space-y-4">
            {/* Display */}
            <div className="flex justify-between items-center">
              <div className="bg-white px-3 py-2 rounded-lg border-2 border-orange-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium">Min</span>
                <p className="text-sm font-bold text-orange-600">
                  ${priceRange.min}
                </p>
              </div>
              <div className="h-[2px] flex-1 mx-2 bg-orange-200"></div>
              <div className="bg-white px-3 py-2 rounded-lg border-2 border-orange-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium">Max</span>
                <p className="text-sm font-bold text-orange-600">
                  ${priceRange.max}
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="relative pt-2 pb-2">
              <div className="absolute w-full h-2 bg-orange-100 rounded-full top-1/2 -translate-y-1/2"></div>

              <div
                className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-md transition-all duration-200"
                style={{
                  left: `${((priceRange.min - MIN) / (MAX - MIN)) * 100}%`,
                  right: `${
                    100 - ((priceRange.max - MIN) / (MAX - MIN)) * 100
                  }%`,
                }}
              ></div>

              {/* Min Slider */}
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={priceRange.min}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  if (newMin < priceRange.max - STEP) {
                    setPriceRange({ ...priceRange, min: newMin });
                  }
                }}
                className="absolute w-full appearance-none bg-transparent z-30 range-slider"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />

              {/* Max Slider */}
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={priceRange.max}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  if (newMax > priceRange.min + STEP) {
                    setPriceRange({ ...priceRange, max: newMax });
                  }
                }}
                className="absolute w-full appearance-none bg-transparent z-20 range-slider"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />

              <style jsx>{`
                .range-slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: white;
                  border: 3px solid #f97316;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                  transition: all 0.2s ease;
                }
                .range-slider::-webkit-slider-thumb:hover {
                  transform: scale(1.15);
                  box-shadow: 0 3px 8px rgba(249, 115, 22, 0.4);
                }
                .range-slider::-webkit-slider-thumb:active {
                  transform: scale(1.05);
                  border-width: 4px;
                }
                .range-slider::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: white;
                  border: 3px solid #f97316;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                  transition: all 0.2s ease;
                }
              `}</style>
            </div>

            <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>${MIN}</span>
              <span>${MAX}</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border-2 border-orange-200">
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <PackageSearch size={16} className="text-orange-600" />
            Availability
          </label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full border-2 border-orange-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white transition-all cursor-pointer hover:border-orange-300"
          >
            <option value="all">All</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border-2 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <Filter size={14} className="text-orange-600" />
                Active Filters
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-all"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {categoryFilter.map((cat) => (
                <span
                  key={cat}
                  className="bg-white px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 flex items-center gap-1 shadow-sm"
                >
                  <Tags size={12} />
                  {cat}
                </span>
              ))}
              {stockFilter !== "all" && (
                <span className="bg-white px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 flex items-center gap-1 shadow-sm">
                  <PackageSearch size={12} />
                  {stockFilter === "in" ? "In Stock" : "Out of Stock"}
                </span>
              )}
              {(priceRange.min > MIN || priceRange.max < MAX) && (
                <span className="bg-white px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 flex items-center gap-1 shadow-sm">
                  <DollarSign size={12} />${priceRange.min} - ${priceRange.max}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ShopFilter;
