import React, { useMemo, useState } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import Button from "../ui/Button";
import CategoryFilter from "./filters/CategoryFilter";
import BrandFilter from "./filters/BrandFilter";
import ColorFilter from "./filters/ColorFilter";
import SizeFilter from "./filters/SizeFilter";
import AvailabilityFilter from "./filters/AvailabilityFilter";
import PriceFilter from "./filters/PriceFilter";

interface Props {
  context?: "shop" | "category"; // 👈 thêm context
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
  priceMin: number;
  priceMax: number;
  priceStep?: number;
  brandFilter: string[];
  setBrandFilter: (v: string[]) => void;
  brandOptions: string[];
  colorFilter: string[];
  setColorFilter: (v: string[]) => void;
  sizeFilter: string[];
  setSizeFilter: (v: string[]) => void;
}

const Filter: React.FC<Props> = ({
  context = "shop",
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
  priceMin,
  priceMax,
  priceStep = 100000,
  brandFilter,
  setBrandFilter,
  brandOptions,
  colorFilter,
  setColorFilter,
  sizeFilter,
  setSizeFilter,
}) => {
  const MIN = priceMin;
  const MAX = priceMax;

  const [open, setOpen] = useState({
    category: context === "shop",
    brand: true,
    color: false,
    size: false,
    availability: false,
  });

  const toggleSection = (name: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));

  // --- Tổng hợp các filter đang được chọn ---
  const activeFilters = useMemo(
    () => [
      ...(context === "shop"
        ? categoryFilter.map((c) => ({ label: c, type: "category" }))
        : []),
      ...brandFilter.map((b) => ({ label: b, type: "brand" })),
      ...colorFilter.map((c) => ({ label: c, type: "color" })),
      ...sizeFilter.map((s) => ({ label: s, type: "size" })),
      ...(stockFilter !== "all"
        ? [
            {
              label: stockFilter === "in" ? "In Stock" : "Out of Stock",
              type: "stock",
            },
          ]
        : []),
      ...(priceRange.min !== MIN || priceRange.max !== MAX
        ? [
            {
              label: `${priceRange.min.toLocaleString()}₫ - ${priceRange.max.toLocaleString()}₫`,
              type: "price",
            },
          ]
        : []),
    ],
    [
      context,
      categoryFilter,
      brandFilter,
      colorFilter,
      sizeFilter,
      stockFilter,
      priceRange,
      MIN,
      MAX,
    ]
  );

  // --- Xử lý xóa từng filter ---
  const handleRemoveFilter = (f: { label: string; type: string }) => {
    if (f.type === "category")
      setCategoryFilter(categoryFilter.filter((c) => c !== f.label));
    else if (f.type === "brand")
      setBrandFilter(brandFilter.filter((b) => b !== f.label));
    else if (f.type === "color")
      setColorFilter(colorFilter.filter((c) => c !== f.label));
    else if (f.type === "size")
      setSizeFilter(sizeFilter.filter((s) => s !== f.label));
    else if (f.type === "stock") setStockFilter("all");
    else if (f.type === "price") setPriceRange({ min: MIN, max: MAX });
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 w-full lg:w-64 bg-white z-50 lg:z-0 transform ${
        showFilters ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-out shadow-xl lg:shadow-md rounded-none lg:rounded-xl border border-orange-100 flex flex-col`}
    >
      {/* --- Header --- */}
      <div className="flex justify-between items-center p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/60">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <FilterIcon size={18} className="text-orange-500" /> Filters
        </h3>
        <Button
          onClick={toggleFilters}
          icon={<X size={18} />}
          className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
          aria-label="Close filters"
        />
      </div>

      {/* --- Active Filters --- */}
      {hasActiveFilters && (
        <div className="p-3 border-b border-orange-100 bg-orange-50/50">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Active Filters
            </p>
            <Button
              onClick={clearFilters}
              label={"Clear All"}
              className="text-xs text-orange-600 hover:underline font-medium"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full border border-orange-200"
              >
                {f.label}
                <Button
                  onClick={() => handleRemoveFilter(f)}
                  icon={<X size={12} />}
                  className="hover:text-red-500 transition-colors"
                  aria-label={`Remove ${f.label} filter`}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* --- Filters --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
        {/* Giá */}
        <PriceFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          min={priceMin}
          max={priceMax}
          step={priceStep}
        />

        {/* Danh mục (ẩn khi context=category) */}
        {context === "shop" && (
          <CategoryFilter
            open={open.category}
            toggle={() => toggleSection("category")}
            options={categoryOptions}
            selected={categoryFilter}
            onChange={setCategoryFilter}
          />
        )}

        {/* Thương hiệu */}
        <BrandFilter
          open={open.brand}
          toggle={() => toggleSection("brand")}
          options={brandOptions}
          selected={brandFilter}
          onChange={setBrandFilter}
        />

        {/* Màu sắc */}
        <ColorFilter
          open={open.color}
          toggle={() => toggleSection("color")}
          selected={colorFilter}
          onChange={setColorFilter}
        />

        {/* Kích thước */}
        <SizeFilter
          open={open.size}
          toggle={() => toggleSection("size")}
          selected={sizeFilter}
          onChange={setSizeFilter}
        />

        {/* Tình trạng hàng */}
        <AvailabilityFilter
          open={open.availability}
          toggle={() => toggleSection("availability")}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
        />
      </div>
    </aside>
  );
};

export default Filter;
