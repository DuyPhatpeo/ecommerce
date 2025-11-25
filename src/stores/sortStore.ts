import { create } from "zustand";
import { persist } from "zustand/middleware";

// -------------------- TYPES --------------------
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

// -------------------- STORE --------------------
export const useSortStore = create<SortState<any>>()(
  persist(
    (set, get) => ({
      products: [],
      debouncedFilters: undefined,
      sortBy: "none",
      visibleCount: 9,
      itemsPerLoad: 9,

      // -------------------- SETTERS --------------------
      setProducts: (products) => set({ products }),
      setFilters: (filters) => {
        set({ debouncedFilters: filters, visibleCount: get().itemsPerLoad });
      },
      setSortBy: (sortBy) => {
        set({ sortBy, visibleCount: get().itemsPerLoad });
      },
      handleSeeMore: () =>
        set((s) => ({ visibleCount: s.visibleCount + s.itemsPerLoad })),
      resetPagination: () => set((s) => ({ visibleCount: s.itemsPerLoad })),

      // -------------------- HELPERS --------------------
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

      // -------------------- SORT --------------------
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

        // Stock sắp xếp: luôn ưu tiên còn hàng
        sorted.sort((a, b) => {
          const aStock = a.stock ?? 0;
          const bStock = b.stock ?? 0;
          if (aStock > 0 && bStock <= 0) return -1;
          if (aStock <= 0 && bStock > 0) return 1;
          return 0;
        });

        return sorted;
      },

      // -------------------- FILTER --------------------
      filteredProducts: () => {
        const { debouncedFilters, sortedProducts, getFinalPrice } = get();
        let result = sortedProducts();

        if (!debouncedFilters) return result;

        // Stock
        if (debouncedFilters.stock === "in") {
          result = result.filter((p) => (p.stock ?? 0) > 0);
        } else if (debouncedFilters.stock === "out") {
          result = result.filter((p) => (p.stock ?? 0) <= 0);
        }

        // Category
        if (debouncedFilters.category.length > 0) {
          const categorySet = new Set(
            debouncedFilters.category.map((c) => c.toLowerCase())
          );
          result = result.filter((p) =>
            categorySet.has((p.category || "").toLowerCase())
          );
        }

        // Brand
        if (debouncedFilters.brand.length > 0) {
          const brandSet = new Set(
            debouncedFilters.brand.map((b) => b.toLowerCase())
          );
          result = result.filter((p) =>
            brandSet.has((p.brand || "").toLowerCase())
          );
        }

        // Price
        result = result.filter(
          (p) =>
            getFinalPrice(p) >= (debouncedFilters.price?.min ?? 0) &&
            getFinalPrice(p) <= (debouncedFilters.price?.max ?? Infinity)
        );

        return result;
      },

      // -------------------- PAGINATION --------------------
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
