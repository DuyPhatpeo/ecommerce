import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ArrowUpDown,
  Sparkles,
  PackageSearch,
  Tags,
  Filter,
  X,
  ShoppingBag,
} from "lucide-react";
import ProductCard from "../section/ProductCard";
import { getProducts } from "../../api/productApi";
import Pagination from "../ui/Pagination";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
  category?: string;
}

const ITEMS_PER_PAGE = 9;

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<
    | "none"
    | "name-asc"
    | "name-desc"
    | "price-asc"
    | "price-desc"
    | "discount-high"
  >("none");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const listRef = useRef<HTMLDivElement>(null);

  // 🔄 Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: Product[] = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid product data");
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🚫 Lock scroll when filter is open
  useEffect(() => {
    if (showFilters) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // 📋 Handlers
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value as any);
  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setStockFilter(e.target.value as any);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setCategoryFilter(e.target.value);

  const clearFilters = useCallback(() => {
    setSortBy("none");
    setStockFilter("all");
    setCategoryFilter("all");
  }, []);

  // 🔠 Sort logic
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "discount-high":
        return sorted.sort((a, b) => {
          const dA = a.oldPrice ? a.oldPrice - a.price : 0;
          const dB = b.oldPrice ? b.oldPrice - b.price : 0;
          return dB - dA;
        });
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // 🧮 Filter logic
  const filteredProducts = useMemo(() => {
    let result = [...sortedProducts];
    if (stockFilter === "in") result = result.filter((p) => (p.stock ?? 0) > 0);
    if (stockFilter === "out")
      result = result.filter((p) => (p.stock ?? 0) <= 0);
    if (categoryFilter !== "all")
      result = result.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    return result;
  }, [sortedProducts, stockFilter, categoryFilter]);

  // 📖 Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const hasActiveFilters =
    sortBy !== "none" || stockFilter !== "all" || categoryFilter !== "all";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <section className="w-full min-h-screen py-10 sm:py-14 px-3 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md mb-4">
            <Sparkles size={16} className="animate-pulse" />
            <span>All Products</span>
            <ShoppingBag size={16} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 bg-clip-text text-transparent">
            Our Collection
          </h2>
        </div>

        {/* Overlay when filter is open */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Sort */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 shadow-md hover:shadow-lg transition h-10 sm:h-11">
            <ArrowUpDown size={16} className="text-orange-500" />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-1 sm:px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
              <option value="discount-high">Discount High</option>
            </select>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden ml-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 px-3 py-2 rounded-xl shadow-md font-semibold text-gray-700 text-sm transition-all active:scale-95"
          >
            <Filter size={16} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div
            className={`fixed lg:static inset-y-0 right-0 w-4/5 sm:w-2/3 lg:w-72 bg-white z-50 lg:z-0 transform ${
              showFilters ? "translate-x-0" : "translate-x-full"
            } lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none rounded-l-2xl lg:rounded-2xl border-l-2 lg:border-2 border-gray-100 p-6 overflow-y-auto px-5 sm:px-6`}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Filter size={20} className="text-orange-500" />
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Tags size={14} className="text-blue-500" />
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:border-orange-500 outline-none"
              >
                <option value="all">All</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <PackageSearch size={14} className="text-green-500" />
                Availability
              </label>
              <select
                value={stockFilter}
                onChange={handleStockChange}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:border-orange-500 outline-none"
              >
                <option value="all">All Products</option>
                <option value="in">✓ In Stock</option>
                <option value="out">✗ Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div ref={listRef}>
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200">
                  <PackageSearch
                    size={36}
                    className="text-gray-400 mx-auto mb-3"
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    No products found
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all text-sm mt-3"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 justify-items-center">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      data={{
                        id: product.id,
                        img: product.images?.[0] || "no-image.png",
                        title: product.title,
                        price: product.price,
                        oldPrice: product.oldPrice,
                        stock: product.stock,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  listRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
