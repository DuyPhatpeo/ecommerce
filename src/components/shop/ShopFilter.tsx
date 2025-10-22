import React from "react";
import { Filter, Tags, PackageSearch, X } from "lucide-react";

interface Props {
  showFilters: boolean;
  toggleFilters: () => void;
  stockFilter: "all" | "in" | "out";
  setStockFilter: (v: any) => void;
  categoryFilter: string;
  setCategoryFilter: (v: any) => void;
  categoryOptions: string[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
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
}) => {
  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 w-[85%] sm:w-2/3 lg:w-72 bg-white z-50 lg:z-0 transform ${
        showFilters ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-out shadow-2xl lg:shadow-lg rounded-l-3xl lg:rounded-2xl border-2 border-gray-100 overflow-hidden flex flex-col`}
    >
      <div className="flex justify-between items-center p-5 border-b-2 border-gray-100 bg-gradient-to-r from-orange-50 to-pink-50">
        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
          <Filter size={20} className="text-orange-500" /> Filters
        </h3>
        <button
          onClick={toggleFilters}
          className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Category */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border-2 border-blue-200">
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Tags size={16} className="text-blue-600" />
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border-2 border-blue-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border-2 border-green-200">
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <PackageSearch size={16} className="text-green-600" />
            Availability
          </label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full border-2 border-green-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white transition-all"
          >
            <option value="all">All</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-xl border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-800">
                Active Filters
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {categoryFilter !== "all" && (
                <span className="bg-white px-3 py-1 rounded-full border">
                  {categoryFilter}
                </span>
              )}
              {stockFilter !== "all" && (
                <span className="bg-white px-3 py-1 rounded-full border">
                  {stockFilter === "in" ? "In Stock" : "Out of Stock"}
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
