import React, { useState } from "react";
import {
  Filter,
  Tags,
  PackageSearch,
  X,
  DollarSign,
  ChevronDown,
} from "lucide-react";

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
  brandFilter: string[];
  setBrandFilter: (v: string[]) => void;
  brandOptions: string[];
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
  brandFilter,
  setBrandFilter,
  brandOptions,
}) => {
  const MIN = 0;
  const MAX = 1000;
  const STEP = 10;
  const minGap = 10;

  // ✅ Mở nhiều section độc lập
  const [open, setOpen] = useState({
    category: true,
    brand: false,
    availability: false,
  });

  const toggleSection = (name: keyof typeof open) => {
    setOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // --- Category ---
  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(
      categoryFilter.includes(cat)
        ? categoryFilter.filter((c) => c !== cat)
        : [...categoryFilter, cat]
    );
  };

  // --- Brand ---
  const handleBrandChange = (brand: string) => {
    setBrandFilter(
      brandFilter.includes(brand)
        ? brandFilter.filter((b) => b !== brand)
        : [...brandFilter, brand]
    );
  };

  // --- Price ---
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

  // --- Active filters ---
  const activeFilters = [
    ...categoryFilter.map((c) => ({ label: c, type: "category" })),
    ...brandFilter.map((b) => ({ label: b, type: "brand" })),
    ...(stockFilter !== "all"
      ? [
          {
            label: stockFilter === "in" ? "In Stock" : "Out of Stock",
            type: "stock",
          },
        ]
      : []),
    ...(priceRange.min !== MIN || priceRange.max !== MAX
      ? [{ label: `$${priceRange.min} - $${priceRange.max}`, type: "price" }]
      : []),
  ];

  const handleRemoveFilter = (f: { label: string; type: string }) => {
    if (f.type === "category")
      setCategoryFilter(categoryFilter.filter((c) => c !== f.label));
    else if (f.type === "brand")
      setBrandFilter(brandFilter.filter((b) => b !== f.label));
    else if (f.type === "stock") setStockFilter("all");
    else if (f.type === "price") setPriceRange({ min: MIN, max: MAX });
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 w-full lg:w-64 bg-white z-50 lg:z-0 transform ${
        showFilters ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-out shadow-xl lg:shadow-md rounded-none lg:rounded-xl border border-orange-100 flex flex-col`}
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

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="p-3 border-b border-orange-100 bg-orange-50/50">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Active Filters
            </p>
            <button
              onClick={clearFilters}
              className="text-xs text-orange-600 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full border border-orange-200"
              >
                {f.label}
                <button
                  onClick={() => handleRemoveFilter(f)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* --- PRICE RANGE --- */}
        <div className="bg-orange-50/60 rounded-lg border border-orange-200 p-3">
          <h4 className="flex items-center gap-2 font-semibold text-sm text-gray-800 mb-2">
            <DollarSign size={14} className="text-orange-600" /> Price Range
          </h4>
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Min: ${priceRange.min}</span>
            <span>Max: ${priceRange.max}</span>
          </div>
          <div className="relative mb-2">
            <div className="absolute w-full h-1.5 bg-orange-100 rounded-full top-1/2 -translate-y-1/2" />
            <div
              className="absolute h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-md transition-all duration-200"
              style={{
                left: `${((priceRange.min - MIN) / (MAX - MIN)) * 100}%`,
                right: `${100 - ((priceRange.max - MIN) / (MAX - MIN)) * 100}%`,
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
          </div>
        </div>

        {/* --- Category --- */}
        <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
          <button
            onClick={() => toggleSection("category")}
            className="w-full flex justify-between items-center px-3 py-2 font-semibold text-sm text-gray-800 bg-orange-100 hover:bg-orange-200/70 transition"
          >
            <span className="flex items-center gap-2">
              <Tags size={14} className="text-orange-600" /> Category
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                open.category ? "rotate-180" : ""
              }`}
            />
          </button>
          {open.category && (
            <div className="p-3 space-y-1.5 max-h-36 overflow-y-auto">
              {categoryOptions.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
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
          )}
        </div>

        {/* --- Brand --- */}
        <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
          <button
            onClick={() => toggleSection("brand")}
            className="w-full flex justify-between items-center px-3 py-2 font-semibold text-sm text-gray-800 bg-orange-100 hover:bg-orange-200/70 transition"
          >
            <span className="flex items-center gap-2">
              <Tags size={14} className="text-orange-600" /> Brand
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                open.brand ? "rotate-180" : ""
              }`}
            />
          </button>
          {open.brand && (
            <div className="p-3 space-y-1.5">
              {brandOptions.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={brandFilter.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-200 cursor-pointer accent-orange-500"
                  />
                  <span className="capitalize group-hover:translate-x-0.5 transition-transform">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* --- Availability --- */}
        <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
          <button
            onClick={() => toggleSection("availability")}
            className="w-full flex justify-between items-center px-3 py-2 font-semibold text-sm text-gray-800 bg-orange-100 hover:bg-orange-200/70 transition"
          >
            <span className="flex items-center gap-2">
              <PackageSearch size={14} className="text-orange-600" />{" "}
              Availability
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                open.availability ? "rotate-180" : ""
              }`}
            />
          </button>
          {open.availability && (
            <div className="p-3">
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
          )}
        </div>
      </div>
    </aside>
  );
};

export default ShopFilter;
