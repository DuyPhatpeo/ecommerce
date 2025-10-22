import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowUpDown, Sparkles, Filter, ShoppingBag } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ShopFilter from "./ShopFilter";
import ShopList from "./ShopList";

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

type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-high";
type StockFilter = "all" | "in" | "out";

const ITEMS_PER_PAGE = 9;

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: Product[] = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid product data");
        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Disable body scroll when filter sidebar is open
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // --- Handlers ---
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as SortOption);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const toggleFilters = useCallback(() => setShowFilters((p) => !p), []);
  const clearFilters = useCallback(() => {
    setSortBy("none");
    setStockFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  }, []);

  // --- Sorting logic ---
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

  // --- Filtering logic ---
  const filteredProducts = useMemo(() => {
    let result = sortedProducts;
    if (stockFilter === "in") result = result.filter((p) => (p.stock ?? 0) > 0);
    else if (stockFilter === "out")
      result = result.filter((p) => (p.stock ?? 0) <= 0);

    if (categoryFilter !== "all")
      result = result.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      );

    return result;
  }, [sortedProducts, stockFilter, categoryFilter]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // --- Category options ---
  const categoryOptions = useMemo<string[]>(() => {
    const validCategories = products
      .map((p) => p.category)
      .filter((c): c is string => Boolean(c));
    return Array.from(new Set(validCategories));
  }, [products]);

  const hasActiveFilters =
    sortBy !== "none" || stockFilter !== "all" || categoryFilter !== "all";

  // --- Render ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
            <Sparkles size={18} />
            <span>All Products</span>
            <ShoppingBag size={18} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 bg-clip-text text-transparent">
            Our Collection
          </h2>
        </div>

        {/* Overlay for mobile filters */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={toggleFilters}
          />
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Filter button - Mobile */}
          <button
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-gray-700 text-sm"
          >
            <Filter size={18} />
            Filters
          </button>

          {/* Sort - Desktop */}
          <div className="ml-auto flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <ArrowUpDown size={18} className="text-orange-500" />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="discount-high">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          <ShopFilter
            showFilters={showFilters}
            toggleFilters={toggleFilters}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categoryOptions={categoryOptions}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />
          <ShopList
            paginatedProducts={paginatedProducts}
            clearFilters={clearFilters}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default Shop;
