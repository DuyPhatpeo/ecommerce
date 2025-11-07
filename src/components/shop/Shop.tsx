import React, { useEffect, useState } from "react";
import { ArrowUpDown, Sparkles, Filter, ShoppingBag } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ShopFilter from "./ShopFilter";
import Button from "../ui/Button";
import ShopList from "./ShopList";
import { useShopFilter } from "../../hooks/useFilter";
import { useSort } from "../../hooks/useSort";

interface Product {
  id: string;
  title: string;
  salePrice: number;
  regularPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
  category?: string;
  brand?: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const dataFromApi = await getProducts();

        if (!Array.isArray(dataFromApi))
          throw new Error("Invalid product data");

        // --- normalize dữ liệu ---
        const normalized: Product[] = dataFromApi.map((p) => ({
          ...p,
          salePrice: p.salePrice ?? 0, // bắt buộc number
          regularPrice: p.regularPrice ?? 0,
          stock: p.stock ?? 0,
          status: p.status ?? "available",
        }));

        if (mounted) setProducts(normalized);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // --- FILTER ---
  const {
    stockFilter,
    setStockFilter,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    colorFilter,
    setColorFilter,
    sizeFilter,
    setSizeFilter,
    priceRange,
    setPriceRange,
    showFilters,
    isFiltering,
    debouncedFilters,
    toggleFilters,
    clearFilters,
    categoryOptions,
    brandOptions,
    hasActiveFilters,
    PRICE_MIN,
    PRICE_MAX,
  } = useShopFilter(products);

  // --- SORT + PAGINATION ---
  const { sortBy, setSortBy, paginatedProducts, hasMore, handleSeeMore } =
    useSort(products, debouncedFilters, { itemsPerLoad: 9 });

  if (loading)
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <section className="w-full min-h-screen py-8 px-3 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* --- Header --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
            <Sparkles size={18} />
            <span>All products</span>
            <ShoppingBag size={18} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
            Our Collection
          </h2>
        </div>

        {/* --- Backdrop Mobile Filter --- */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={toggleFilters}
          />
        )}

        {/* --- Toolbar --- */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-gray-700 text-sm"
            icon={<Filter size={18} />}
            label={"Filter"}
          />

          {/* --- Sort Selector --- */}
          <div className="ml-auto flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <ArrowUpDown size={18} className="text-orange-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
              <option value="discount-high">Biggest discount (%)</option>
            </select>
          </div>
        </div>

        {/* --- Main Layout --- */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Sidebar Filter */}
          <div className="lg:w-64 shrink-0 self-start">
            <ShopFilter
              context="shop"
              showFilters={showFilters}
              toggleFilters={toggleFilters}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categoryOptions={categoryOptions}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              sizeFilter={sizeFilter}
              setSizeFilter={setSizeFilter}
              brandOptions={brandOptions}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceMin={PRICE_MIN}
              priceMax={PRICE_MAX}
              priceStep={100000}
            />
          </div>

          {/* Product List */}
          <div className="flex-1 relative">
            {isFiltering && (
              <div className="absolute inset-0 flex justify-center pt-20 bg-white/60 z-10">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <ShopList
              paginatedProducts={paginatedProducts}
              clearFilters={clearFilters}
              hasMore={hasMore}
              onSeeMore={handleSeeMore}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
