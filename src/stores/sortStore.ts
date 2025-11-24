import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tất cả type nằm trong store luôn
type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-high";

interface DebouncedFilters {
  price: { min: number; max: number };
  category: string[];
  brand: string[];
  stock: "all" | "in" | "out";
}

interface SortState<T> {
  products: T[];
  debouncedFilters?: DebouncedFilters;
  sortBy: SortOption;
  visibleCount: number;
  itemsPerLoad: number;

  setProducts: (products: T[]) => void;
  setFilters: (filters: DebouncedFilters) => void;
  setSortBy: (sort: SortOption) => void;
  handleSeeMore: () => void;
  resetPagination: () => void;

  getFinalPrice: (p: any) => number;
  getDiscountPercent: (p: any) => number;
  sortedProducts: () => T[];
  filteredProducts: () => T[];
  paginatedProducts: () => T[];
  hasMore: () => boolean;
}

export const useSortStore = create<SortState<any>>()(
  persist(
    (set, get) => ({
      products: [],
      debouncedFilters: undefined,
      sortBy: "none",
      visibleCount: 9,
      itemsPerLoad: 9,

      setProducts: (products) => set({ products }),
      setFilters: (filters) => set({ debouncedFilters: filters }),
      setSortBy: (sortBy) => set({ sortBy }),
      handleSeeMore: () =>
        set((s) => ({ visibleCount: s.visibleCount + s.itemsPerLoad })),
      resetPagination: () => set((s) => ({ visibleCount: s.itemsPerLoad })),

      getFinalPrice: (p) => {
        if (p.salePrice && p.salePrice > 0) return p.salePrice;
        if (p.regularPrice && p.regularPrice > 0) return p.regularPrice;
        return 0;
      },

      getDiscountPercent: (p) => {
        if (p.regularPrice && p.salePrice && p.regularPrice > p.salePrice) {
          return ((p.regularPrice - p.salePrice) / p.regularPrice) * 100;
        }
        return 0;
      },

      sortedProducts: () => {
        const { products, sortBy, getFinalPrice, getDiscountPercent } = get();
        let sorted = [...products];

        switch (sortBy) {
          case "name-asc":
            sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            break;
          case "name-desc":
            sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
            break;
          case "price-asc":
            sorted.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
            break;
          case "price-desc":
            sorted.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
            break;
          case "discount-high":
            const discounted = sorted
              .filter((p) => getDiscountPercent(p) > 0)
              .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
            const nonDiscounted = sorted.filter(
              (p) => getDiscountPercent(p) === 0
            );
            sorted = [...discounted, ...nonDiscounted];
            break;
        }

        sorted.sort((a, b) => {
          const aStock = a.stock ?? 0;
          const bStock = b.stock ?? 0;
          if (aStock > 0 && bStock <= 0) return -1;
          if (aStock <= 0 && bStock > 0) return 1;
          return 0;
        });

        return sorted;
      },

      filteredProducts: () => {
        const { debouncedFilters, getFinalPrice, sortedProducts } = get();
        const sorted = sortedProducts();
        if (!debouncedFilters) return sorted;

        let result = [...sorted];

        if (debouncedFilters.stock === "in")
          result = result.filter((p) => (p.stock ?? 0) > 0);
        else if (debouncedFilters.stock === "out")
          result = result.filter((p) => (p.stock ?? 0) <= 0);

        if (debouncedFilters.category.length)
          result = result.filter((p) =>
            debouncedFilters.category.includes((p.category || "").toLowerCase())
          );

        if (debouncedFilters.brand.length)
          result = result.filter((p) =>
            debouncedFilters.brand.includes((p.brand || "").toLowerCase())
          );

        result = result.filter(
          (p) =>
            getFinalPrice(p) >= debouncedFilters.price.min &&
            getFinalPrice(p) <= debouncedFilters.price.max
        );

        return result;
      },

      paginatedProducts: () => {
        const { visibleCount } = get();
        return get().filteredProducts().slice(0, visibleCount);
      },

      hasMore: () => {
        const filtered = get().filteredProducts();
        return get().visibleCount < filtered.length;
      },
    }),
    { name: "sort-store" }
  )
);
