import React, { useEffect, useState } from "react";
import { Sparkles, Filter, ShoppingBag } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ProductFilters from "../section/ProductFilters";
import Button from "../ui/Button";
import ShopList from "../section/ProductList";
import { useShopFilter } from "../../stores/filterStore";
import Loader from "../general/Loader";
import Select from "../ui/Select";
import { useSortStore } from "../../stores/sortStore";

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
  color?: string;
  size?: string | string[];
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   Sort Store
  const {
    sortBy,
    setSortBy,
    paginatedProducts,
    hasMore,
    handleSeeMore,
    setProducts: setStoreProducts,
    setFilters: setStoreFilters,
  } = useSortStore();

  //   Filter Store
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
    debouncedFilters,
    toggleFilters,
    clearFilters,
    categoryOptions,
    brandOptions,
    hasActiveFilters,
    PRICE_MIN,
    PRICE_MAX,
  } = useShopFilter(products);

  //   Fetch products
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const dataFromApi = await getProducts();

        if (!Array.isArray(dataFromApi))
          throw new Error("Invalid product data");

        const normalized: Product[] = dataFromApi.map((p) => ({
          ...p,
          salePrice: p.salePrice ?? 0,
          regularPrice: p.regularPrice ?? 0,
          stock: p.stock ?? 0,
          status: p.status ?? "available",
        }));

        if (mounted) {
          setProducts(normalized);
          setStoreProducts(normalized);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    // Fixed: cleanup function should return void, not boolean
    return () => {
      mounted = false;
    };
  }, [setStoreProducts]);

  //   Sync filters → sortStore
  useEffect(() => {
    setStoreFilters(debouncedFilters);
  }, [debouncedFilters, setStoreFilters]);

  //   Loading initial
  if (loading && products.length === 0) return <Loader />;

  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <section className="w-full min-h-screen py-8 px-3 sm:px-6 md:px-10 lg:px-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        {/* ================= HEADER ================= */}
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

        {/* ================= Mobile Backdrop ================= */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={toggleFilters}
          />
        )}

        {/* ================= TOOLBAR ================= */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-gray-700 text-sm"
            icon={<Filter size={18} />}
            label="Filter"
          />

          <Select
            value={sortBy}
            onChange={(v) => setSortBy(v as any)}
            className="ml-auto"
            options={[
              { label: "Default", value: "none" },
              { label: "A → Z", value: "name-asc" },
              { label: "Z → A", value: "name-desc" },
              { label: "Low → High", value: "price-asc" },
              { label: "High → Low", value: "price-desc" },
              { label: "Biggest discount (%)", value: "discount-high" },
            ]}
          />
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* -------- FILTERS (LEFT) -------- */}
          <aside className="lg:sticky lg:top-22 lg:w-64 shrink-0 self-start">
            <ProductFilters
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
              brandOptions={brandOptions}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              sizeFilter={sizeFilter}
              setSizeFilter={setSizeFilter}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceMin={PRICE_MIN}
              priceMax={PRICE_MAX}
              priceStep={100000}
            />
          </aside>

          {/* -------- PRODUCT LIST -------- */}
          <div className="flex-1 relative">
            {/* Loading overlay when filters or sort update */}
            {loading && products.length > 0 && (
              <div className="absolute inset-0 flex justify-center pt-20 bg-white/60 z-10">
                <Loader />
              </div>
            )}

            <ShopList
              paginatedProducts={paginatedProducts()}
              clearFilters={clearFilters}
              hasMore={hasMore()}
              onSeeMore={handleSeeMore}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
