import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  salePrice: number;
  regularPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
  category?: string;
  brand?: string;
}

type StockFilter = "all" | "in" | "out";

const PRICE_MIN = 0;
const PRICE_MAX = 100_000_000;

export const useShopFilter = (products: Product[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({
    min: PRICE_MIN,
    max: PRICE_MAX,
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Debounced filters
  const [debouncedFilters, setDebouncedFilters] = useState({
    price: priceRange,
    category: categoryFilter,
    brand: brandFilter,
    stock: stockFilter,
  });

  // Khôi phục filter từ URL
  useEffect(() => {
    const stock = (searchParams.get("stock") as StockFilter) || "all";
    const cat = searchParams.get("category")?.split(",").filter(Boolean) || [];
    const brand = searchParams.get("brand")?.split(",").filter(Boolean) || [];
    const min = Number(searchParams.get("min") ?? PRICE_MIN);
    const max = Number(searchParams.get("max") ?? PRICE_MAX);

    setStockFilter(stock);
    setCategoryFilter(cat);
    setBrandFilter(brand);
    setPriceRange({ min, max });
  }, [searchParams]);

  // Cập nhật URL khi filter thay đổi
  useEffect(() => {
    const params: Record<string, string> = {};
    if (stockFilter !== "all") params.stock = stockFilter;
    if (categoryFilter.length) params.category = categoryFilter.join(",");
    if (brandFilter.length) params.brand = brandFilter.join(",");
    if (priceRange.min > PRICE_MIN) params.min = String(priceRange.min);
    if (priceRange.max < PRICE_MAX) params.max = String(priceRange.max);
    setSearchParams(params, { replace: true });
  }, [stockFilter, categoryFilter, brandFilter, priceRange, setSearchParams]);

  // Debounce logic
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
    }, 400);
    return () => clearTimeout(handler);
  }, [priceRange, categoryFilter, brandFilter, stockFilter]);

  // Ngăn cuộn khi mở bộ lọc
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Actions
  const toggleFilters = useCallback(() => setShowFilters((p) => !p), []);

  const clearFilters = useCallback(() => {
    setStockFilter("all");
    setCategoryFilter([]);
    setBrandFilter([]);
    setColorFilter([]);
    setSizeFilter([]);
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
    setSearchParams({});
  }, [setSearchParams]);

  // Computed values
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
    stockFilter !== "all" ||
    categoryFilter.length > 0 ||
    brandFilter.length > 0 ||
    colorFilter.length > 0 ||
    sizeFilter.length > 0 ||
    priceRange.min > PRICE_MIN ||
    priceRange.max < PRICE_MAX;

  return {
    // States
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

    // Actions
    toggleFilters,
    clearFilters,

    // Computed
    categoryOptions,
    brandOptions,
    hasActiveFilters,

    // Constants
    PRICE_MIN,
    PRICE_MAX,
  };
};
