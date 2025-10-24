import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowUpDown, Sparkles, Filter, ShoppingBag } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ShopFilter from "./ShopFilter";
import Button from "../ui/Button";
import ShopList from "./ShopList";

interface Product {
  id: number;
  title: string;
  salePrice: number; // VNĐ
  regularPrice?: number;
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

const ITEMS_PER_LOAD = 9;

const Shop: React.FC = () => {
  const PRICE_MIN = 0;
  const PRICE_MAX = 100_000_000;

  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({
    min: PRICE_MIN,
    max: PRICE_MAX,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  // --- Fetch products once ---
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: Product[] = await getProducts();
        if (!Array.isArray(data)) throw new Error("Invalid product data");
        if (mounted) setProducts(data);
      } catch {
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

  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  const toggleFilters = useCallback(() => setShowFilters((p) => !p), []);

  const clearFilters = useCallback(() => {
    setSortBy("none");
    setStockFilter("all");
    setCategoryFilter([]);
    setBrandFilter([]);
    setColorFilter([]);
    setSizeFilter([]);
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
    setVisibleCount(ITEMS_PER_LOAD);
  }, [PRICE_MIN, PRICE_MAX]);

  const handleSeeMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  }, []);

  const [debouncedFilters, setDebouncedFilters] = useState({
    price: priceRange,
    category: categoryFilter,
    brand: brandFilter,
    stock: stockFilter,
  });

  useEffect(() => {
    setIsFiltering(true);
    const handler = setTimeout(() => {
      setDebouncedFilters({
        price: priceRange,
        category: categoryFilter,
        brand: brandFilter,
        stock: stockFilter,
      });
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [priceRange, categoryFilter, brandFilter, stockFilter]);

  // --- Sorting ---
  const sortedProducts = useMemo(() => {
    let sorted = [...products];

    // --- Hàm tính giá thực tế (ưu tiên salePrice, fallback regularPrice) ---
    const getFinalPrice = (p: Product) => {
      if (p.salePrice && p.salePrice > 0) return p.salePrice;
      if (p.regularPrice && p.regularPrice > 0) return p.regularPrice;
      return 0;
    };

    // --- Hàm tính phần trăm giảm giá (nếu có) ---
    const getDiscountPercent = (p: Product) => {
      if (
        p.regularPrice &&
        p.salePrice &&
        p.regularPrice > p.salePrice &&
        p.regularPrice > 0
      ) {
        return ((p.regularPrice - p.salePrice) / p.regularPrice) * 100;
      }
      return 0;
    };

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case "price-asc":
        sorted.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
        break;

      case "price-desc":
        sorted.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
        break;

      case "discount-high":
        const discounted = sorted.filter((p) => getDiscountPercent(p) > 0);
        discounted.sort(
          (a, b) => getDiscountPercent(b) - getDiscountPercent(a)
        );

        const nonDiscounted = sorted.filter((p) => getDiscountPercent(p) === 0);
        sorted = [...discounted, ...nonDiscounted];
        break;
    }

    // --- Ưu tiên sản phẩm còn hàng ---
    sorted.sort((a, b) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });

    return sorted;
  }, [products, sortBy]);

  // --- Filtering ---
  const filteredProducts = useMemo(() => {
    let result = sortedProducts;

    if (debouncedFilters.stock === "in") {
      result = result.filter((p) => (p.stock ?? 0) > 0);
    } else if (debouncedFilters.stock === "out") {
      result = result.filter((p) => (p.stock ?? 0) <= 0);
    }

    if (debouncedFilters.category.length) {
      result = result.filter((p) =>
        debouncedFilters.category.includes(p.category?.toLowerCase() ?? "")
      );
    }

    if (debouncedFilters.brand.length) {
      result = result.filter((p) =>
        debouncedFilters.brand.includes(p.brand?.toLowerCase() ?? "")
      );
    }

    result = result.filter(
      (p) =>
        (p.salePrice ?? 0) >= debouncedFilters.price.min &&
        (p.salePrice ?? 0) <= debouncedFilters.price.max
    );

    return result;
  }, [sortedProducts, debouncedFilters]);

  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const categoryOptions = useMemo(() => {
    const valid = products
      .map((p) => p.category?.toLowerCase())
      .filter(Boolean) as string[];
    return Array.from(new Set(valid));
  }, [products]);

  const brandOptions = useMemo(() => {
    const valid = products
      .map((p) => p.brand?.toLowerCase())
      .filter(Boolean) as string[];
    return Array.from(new Set(valid));
  }, [products]);

  const hasActiveFilters =
    sortBy !== "none" ||
    stockFilter !== "all" ||
    categoryFilter.length > 0 ||
    brandFilter.length > 0 ||
    colorFilter.length > 0 ||
    sizeFilter.length > 0 ||
    priceRange.min > PRICE_MIN ||
    priceRange.max < PRICE_MAX;

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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
            <Sparkles size={18} />
            <span>Tất cả sản phẩm</span>
            <ShoppingBag size={18} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 bg-clip-text text-transparent">
            Bộ Sưu Tập Của Chúng Tôi
          </h2>
        </div>

        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={toggleFilters}
          />
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-gray-700 text-sm"
            icon={<Filter size={18} />}
            label={"Bộ lọc"}
          />

          <div className="ml-auto flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <ArrowUpDown size={18} className="text-orange-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-800 font-medium cursor-pointer text-sm"
            >
              <option value="none">Mặc định</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="name-desc">Tên Z → A</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
              <option value="discount-high">Giảm giá nhiều nhất (%)</option>
            </select>
          </div>
        </div>

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
