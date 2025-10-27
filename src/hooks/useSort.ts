import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// ======================
// 🔹 Types
// ======================
export type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-high";

export interface DebouncedFilters {
  price: { min: number; max: number };
  category: string[];
  brand: string[];
  stock: "all" | "in" | "out";
}

export interface UseSortOptions {
  itemsPerLoad?: number;
  syncWithUrl?: boolean;
}

// ======================
// 🔹 Generic Hook
// ======================
/**
 * Hook xử lý sort, filter và pagination cho danh sách (Product hoặc type khác)
 * @param products - Danh sách items (Product[])
 * @param debouncedFilters - Filters (optional)
 * @param options - Cấu hình (itemsPerLoad, syncWithUrl)
 */
export const useSort = <T extends Record<string, any>>(
  products: T[],
  debouncedFilters?: DebouncedFilters,
  options: UseSortOptions = {}
) => {
  const { itemsPerLoad = 9, syncWithUrl = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);

  // ======================
  // 🔸 Đồng bộ sort với URL
  // ======================
  useEffect(() => {
    if (!syncWithUrl) return;
    const sort = searchParams.get("sort") as SortOption | null;
    if (sort) setSortBy(sort);
  }, [searchParams, syncWithUrl]);

  useEffect(() => {
    if (!syncWithUrl) return;
    const params = Object.fromEntries(searchParams);
    if (sortBy !== "none") params.sort = sortBy;
    else delete params.sort;
    setSearchParams(params, { replace: true });
  }, [sortBy, searchParams, setSearchParams, syncWithUrl]);

  // ======================
  // 🔸 Helper functions
  // ======================
  const getFinalPrice = useCallback((p: any) => {
    if (p.salePrice && p.salePrice > 0) return p.salePrice;
    if (p.regularPrice && p.regularPrice > 0) return p.regularPrice;
    return 0;
  }, []);

  const getDiscountPercent = useCallback((p: any) => {
    if (p.regularPrice && p.salePrice && p.regularPrice > p.salePrice) {
      return ((p.regularPrice - p.salePrice) / p.regularPrice) * 100;
    }
    return 0;
  }, []);

  // ======================
  // 🔸 SORT logic
  // ======================
  const sortedProducts = useMemo(() => {
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
        const discounted = sorted.filter((p) => getDiscountPercent(p) > 0);
        discounted.sort(
          (a, b) => getDiscountPercent(b) - getDiscountPercent(a)
        );
        const nonDiscounted = sorted.filter((p) => getDiscountPercent(p) === 0);
        sorted = [...discounted, ...nonDiscounted];
        break;
    }

    // Ưu tiên sản phẩm còn hàng (nếu có field `stock`)
    sorted.sort((a: any, b: any) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });

    return sorted;
  }, [products, sortBy, getFinalPrice, getDiscountPercent]);

  // ======================
  // 🔸 FILTER logic
  // ======================
  const filteredProducts = useMemo(() => {
    if (!debouncedFilters) return sortedProducts;
    let result = [...sortedProducts];

    // Stock
    if (debouncedFilters.stock === "in")
      result = result.filter((p: any) => (p.stock ?? 0) > 0);
    else if (debouncedFilters.stock === "out")
      result = result.filter((p: any) => (p.stock ?? 0) <= 0);

    // Category
    if (debouncedFilters.category.length)
      result = result.filter((p: any) =>
        debouncedFilters.category.includes((p.category || "").toLowerCase())
      );

    // Brand
    if (debouncedFilters.brand.length)
      result = result.filter((p: any) =>
        debouncedFilters.brand.includes((p.brand || "").toLowerCase())
      );

    // Price range
    result = result.filter(
      (p: any) =>
        getFinalPrice(p) >= debouncedFilters.price.min &&
        getFinalPrice(p) <= debouncedFilters.price.max
    );

    return result;
  }, [sortedProducts, debouncedFilters, getFinalPrice]);

  // ======================
  // 🔸 PAGINATION
  // ======================
  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const handleSeeMore = useCallback(
    () => setVisibleCount((prev) => prev + itemsPerLoad),
    [itemsPerLoad]
  );

  const resetPagination = useCallback(
    () => setVisibleCount(itemsPerLoad),
    [itemsPerLoad]
  );

  // ======================
  // 🔸 Return API
  // ======================
  return {
    sortBy,
    setSortBy,
    sortedProducts,
    filteredProducts,
    paginatedProducts,
    hasMore,
    handleSeeMore,
    resetPagination,
    visibleCount,
  };
};
