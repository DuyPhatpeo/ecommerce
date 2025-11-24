import { create } from "zustand";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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

type StockFilter = "all" | "in" | "out";

const PRICE_MIN = 0;
const PRICE_MAX = 100_000_000;

interface FilterState {
  // Filter states
  stockFilter: StockFilter;
  categoryFilter: string[];
  brandFilter: string[];
  colorFilter: string[];
  sizeFilter: string[];
  priceRange: { min: number; max: number };

  // UI states
  showFilters: boolean;
  isFiltering: boolean;

  // Debounced filters
  debouncedFilters: {
    price: { min: number; max: number };
    category: string[];
    brand: string[];
    color: string[];
    size: string[];
    stock: StockFilter;
  };

  // Actions
  setStockFilter: (value: StockFilter) => void;
  setCategoryFilter: (value: string[]) => void;
  setBrandFilter: (value: string[]) => void;
  setColorFilter: (value: string[]) => void;
  setSizeFilter: (value: string[]) => void;
  setPriceRange: (value: { min: number; max: number }) => void;
  setShowFilters: (value: boolean) => void;
  toggleFilters: () => void;
  setIsFiltering: (value: boolean) => void;
  updateDebouncedFilters: () => void;
  clearFilters: () => void;
  loadFiltersFromURL: (params: URLSearchParams) => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial states
  stockFilter: "all",
  categoryFilter: [],
  brandFilter: [],
  colorFilter: [],
  sizeFilter: [],
  priceRange: { min: PRICE_MIN, max: PRICE_MAX },
  showFilters: false,
  isFiltering: false,
  debouncedFilters: {
    price: { min: PRICE_MIN, max: PRICE_MAX },
    category: [],
    brand: [],
    color: [],
    size: [],
    stock: "all",
  },

  // Actions
  setStockFilter: (value) => set({ stockFilter: value }),
  setCategoryFilter: (value) => set({ categoryFilter: value }),
  setBrandFilter: (value) => set({ brandFilter: value }),
  setColorFilter: (value) => set({ colorFilter: value }),
  setSizeFilter: (value) => set({ sizeFilter: value }),
  setPriceRange: (value) => set({ priceRange: value }),
  setShowFilters: (value) => set({ showFilters: value }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  setIsFiltering: (value) => set({ isFiltering: value }),

  updateDebouncedFilters: () => {
    const state = get();
    set({
      debouncedFilters: {
        price: state.priceRange,
        category: state.categoryFilter,
        brand: state.brandFilter,
        color: state.colorFilter,
        size: state.sizeFilter,
        stock: state.stockFilter,
      },
    });
  },

  clearFilters: () =>
    set({
      stockFilter: "all",
      categoryFilter: [],
      brandFilter: [],
      colorFilter: [],
      sizeFilter: [],
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
    }),

  loadFiltersFromURL: (params) => {
    const stock = (params.get("stock") as StockFilter) || "all";
    const cat = params.get("category")?.split(",").filter(Boolean) || [];
    const brand = params.get("brand")?.split(",").filter(Boolean) || [];
    const color = params.get("color")?.split(",").filter(Boolean) || [];
    const size = params.get("size")?.split(",").filter(Boolean) || [];
    const min = Number(params.get("min") ?? PRICE_MIN);
    const max = Number(params.get("max") ?? PRICE_MAX);

    set({
      stockFilter: stock,
      categoryFilter: cat,
      brandFilter: brand,
      colorFilter: color,
      sizeFilter: size,
      priceRange: { min, max },
    });
  },
}));

// Hook to sync filters with URL and provide computed values
export const useShopFilter = (products: Product[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get state and actions from store
  const {
    stockFilter,
    categoryFilter,
    brandFilter,
    colorFilter,
    sizeFilter,
    priceRange,
    showFilters,
    isFiltering,
    debouncedFilters,
    setStockFilter,
    setCategoryFilter,
    setBrandFilter,
    setColorFilter,
    setSizeFilter,
    setPriceRange,
    toggleFilters,
    setIsFiltering,
    updateDebouncedFilters,
    clearFilters: storeClearFilters,
    loadFiltersFromURL,
  } = useFilterStore();

  // Load filters from URL on mount
  useEffect(() => {
    loadFiltersFromURL(searchParams);
  }, [searchParams, loadFiltersFromURL]);

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};

    if (stockFilter !== "all") params.stock = stockFilter;
    if (categoryFilter.length) params.category = categoryFilter.join(",");
    if (brandFilter.length) params.brand = brandFilter.join(",");
    if (colorFilter.length) params.color = colorFilter.join(",");
    if (sizeFilter.length) params.size = sizeFilter.join(",");
    if (priceRange.min > PRICE_MIN) params.min = String(priceRange.min);
    if (priceRange.max < PRICE_MAX) params.max = String(priceRange.max);

    setSearchParams(params, { replace: true });
  }, [
    stockFilter,
    categoryFilter,
    brandFilter,
    colorFilter,
    sizeFilter,
    priceRange,
    setSearchParams,
  ]);

  // Debounce logic
  useEffect(() => {
    setIsFiltering(true);
    const handler = setTimeout(() => {
      updateDebouncedFilters();
      setIsFiltering(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [
    priceRange,
    categoryFilter,
    brandFilter,
    colorFilter,
    sizeFilter,
    stockFilter,
    setIsFiltering,
    updateDebouncedFilters,
  ]);

  // Prevent scrolling when filters are open
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Clear filters (also clears URL)
  const clearFilters = () => {
    storeClearFilters();
    setSearchParams({});
  };

  // Computed options
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

  const colorOptions = useMemo(() => {
    const valid = products
      .map((p) => p.color?.toLowerCase())
      .filter(Boolean) as string[];
    return Array.from(new Set(valid));
  }, [products]);

  const sizeOptions = useMemo(() => {
    const valid = products
      .flatMap((p) =>
        Array.isArray(p.size)
          ? p.size.map((s) => s.toString().toLowerCase())
          : p.size
          ? [p.size.toString().toLowerCase()]
          : []
      )
      .filter(Boolean);
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
    colorOptions,
    sizeOptions,
    hasActiveFilters,

    // Constants
    PRICE_MIN,
    PRICE_MAX,
  };
};
