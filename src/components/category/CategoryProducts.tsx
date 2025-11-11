import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Filter, ShoppingBag, ArrowUpDown } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ShopFilter from "../section/Filter";
import Button from "../ui/Button";
import ShopList from "../section/ProductList";
import { useShopFilter } from "../../hooks/useFilter";
import { useSort } from "../../hooks/useSort";

interface Product {
  id: string;
  title: string;
  salePrice: number;
  regularPrice?: number;
  stock?: number;
  status?: string;
  images?: string[];
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
}

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // --- Fetch sản phẩm theo category ---
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ category });

        if (!data || data.length === 0) {
          // ✅ Nếu không có sản phẩm trong category → chuyển về trang 404
          navigate("/404", { replace: true });
          return;
        }

        const normalized: Product[] = (data || []).map((p: any) => ({
          ...p,
          salePrice: p.salePrice ?? p.price ?? 0,
          regularPrice: p.regularPrice ?? p.oldPrice ?? p.salePrice ?? 0,
          stock: p.stock ?? 0,
          status: p.status ?? "available",
          images: Array.isArray(p.images)
            ? p.images
            : p.image
            ? [p.image]
            : ["/placeholder.jpg"],
          category: p.category,
          brand: p.brand,
          color: p.color,
          size: p.size ?? "",
        }));

        if (mounted) setProducts(normalized);
      } catch (err) {
        console.error(err);
        if (mounted) navigate("/404", { replace: true }); // ✅ lỗi cũng về 404
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [category, navigate]);

  // --- FILTER logic ---
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

  // --- SORT + PAGINATION logic ---
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

  const capitalize = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <section className="w-full min-h-screen py-8 px-3 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* --- Header --- */}
        <div className="text-center mb-10 px-2 sm:px-0 overflow-visible">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow mb-4">
            <Sparkles size={16} />
            <span className="whitespace-normal">
              {capitalize(category) || "All products"}
            </span>
            <ShoppingBag size={16} />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-snug sm:leading-snug md:leading-normal break-words bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
            {category ? `${capitalize(category)} Collection` : "Our Collection"}
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
              context="category"
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

export default CategoryProducts;
