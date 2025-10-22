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
  brand?: string;
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
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Fetch products ---
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

  // --- Lock scroll when sidebar open ---
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
    setCategoryFilter([]);
    setBrandFilter([]);
    setPriceRange({ min: 0, max: 1000 });
    setCurrentPage(1);
  }, []);

  // --- Sorting logic (with out-of-stock pushed to end) ---
  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "discount-high":
        sorted.sort((a, b) => {
          const dA = a.oldPrice
            ? ((a.oldPrice - a.price) / a.oldPrice) * 100
            : 0;
          const dB = b.oldPrice
            ? ((b.oldPrice - b.price) / b.oldPrice) * 100
            : 0;
          return dB - dA;
        });
        break;
    }

    // Push out-of-stock items to the end
    return sorted.sort((a, b) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });
  }, [products, sortBy]);

  // --- Filtering logic ---
  const filteredProducts = useMemo(() => {
    let result = sortedProducts;

    // Stock
    if (stockFilter === "in") result = result.filter((p) => (p.stock ?? 0) > 0);
    else if (stockFilter === "out")
      result = result.filter((p) => (p.stock ?? 0) <= 0);

    // Category
    if (categoryFilter.length > 0) {
      result = result.filter((p) =>
        categoryFilter.includes(p.category?.toLowerCase() ?? "")
      );
    }

    // Brand
    if (brandFilter.length > 0) {
      result = result.filter((p) =>
        brandFilter.includes(p.brand?.toLowerCase() ?? "")
      );
    }

    // Price
    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    return result;
  }, [sortedProducts, stockFilter, categoryFilter, brandFilter, priceRange]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // --- Category options ---
  const categoryOptions = useMemo<string[]>(() => {
    const validCategories = products
      .map((p) => p.category?.toLowerCase())
      .filter((c): c is string => Boolean(c));
    return Array.from(new Set(validCategories));
  }, [products]);

  // --- Brand options ---
  const brandOptions = useMemo<string[]>(() => {
    const validBrands = products
      .map((p) => p.brand?.toLowerCase())
      .filter((b): b is string => Boolean(b));
    return Array.from(new Set(validBrands));
  }, [products]);

  // --- Active filter check ---
  const hasActiveFilters =
    sortBy !== "none" ||
    stockFilter !== "all" ||
    categoryFilter.length > 0 ||
    brandFilter.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 1000;

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

        {/* Overlay for mobile */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={toggleFilters}
          />
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-gray-700 text-sm"
          >
            <Filter size={18} />
            Filters
          </button>

          <div className="ml-auto flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <ArrowUpDown size={18} className="text-orange-500" />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
              <option value="discount-high">Biggest Discount (%)</option>
            </select>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="lg:w-64 shrink-0 self-start">
            <ShopFilter
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
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <div className="flex-1">
            <ShopList
              paginatedProducts={paginatedProducts}
              clearFilters={clearFilters}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
