import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  salePrice: number;
  regularPrice?: number;
  stock?: number;
  category?: string;
  brand?: string;
}

export type SortOption =
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

interface UseSortOptions {
  itemsPerLoad?: number;
  syncWithUrl?: boolean;
}

/**
 * Hook để xử lý sort, filter và pagination cho products
 * @param products - Danh sách products
 * @param debouncedFilters - Filters (optional, nếu không có thì chỉ sort)
 * @param options - Cấu hình (itemsPerLoad, syncWithUrl)
 */
export const useSort = (
  products: Product[],
  debouncedFilters?: DebouncedFilters,
  options: UseSortOptions = {}
) => {
  const { itemsPerLoad = 9, syncWithUrl = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);

  // Khôi phục sort từ URL (nếu bật syncWithUrl)
  useEffect(() => {
    if (!syncWithUrl) return;
    const sort = searchParams.get("sort") as SortOption | null;
    if (sort) setSortBy(sort);
  }, [searchParams, syncWithUrl]);

  // Cập nhật URL khi sort thay đổi (nếu bật syncWithUrl)
  useEffect(() => {
    if (!syncWithUrl) return;
    const params = Object.fromEntries(searchParams);
    if (sortBy !== "none") {
      params.sort = sortBy;
    } else {
      delete params.sort;
    }
    setSearchParams(params, { replace: true });
  }, [sortBy, searchParams, setSearchParams, syncWithUrl]);

  // Helper: Lấy giá cuối cùng
  const getFinalPrice = useCallback((p: Product) => {
    if (p.salePrice && p.salePrice > 0) return p.salePrice;
    if (p.regularPrice && p.regularPrice > 0) return p.regularPrice;
    return 0;
  }, []);

  // Helper: Tính % giảm giá
  const getDiscountPercent = useCallback((p: Product) => {
    if (
      p.regularPrice &&
      p.salePrice &&
      p.regularPrice > p.salePrice &&
      p.regularPrice > 0
    ) {
      return ((p.regularPrice - p.salePrice) / p.regularPrice) * 100;
    }
    return 0;
  }, []);

  // SORT logic
  const sortedProducts = useMemo(() => {
    let sorted = [...products];

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

    // Luôn ưu tiên sản phẩm còn hàng
    sorted.sort((a, b) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });

    return sorted;
  }, [products, sortBy, getFinalPrice, getDiscountPercent]);

  // FILTER logic (chỉ khi có debouncedFilters)
  const filteredProducts = useMemo(() => {
    // Nếu không có filters, trả về sortedProducts
    if (!debouncedFilters) return sortedProducts;

    let result = sortedProducts;

    // Filter theo stock
    if (debouncedFilters.stock === "in") {
      result = result.filter((p) => (p.stock ?? 0) > 0);
    } else if (debouncedFilters.stock === "out") {
      result = result.filter((p) => (p.stock ?? 0) <= 0);
    }

    // Filter theo category
    if (debouncedFilters.category.length) {
      result = result.filter((p) =>
        debouncedFilters.category.includes(p.category?.toLowerCase() ?? "")
      );
    }

    // Filter theo brand
    if (debouncedFilters.brand.length) {
      result = result.filter((p) =>
        debouncedFilters.brand.includes(p.brand?.toLowerCase() ?? "")
      );
    }

    // Filter theo price range
    result = result.filter(
      (p) =>
        getFinalPrice(p) >= debouncedFilters.price.min &&
        getFinalPrice(p) <= debouncedFilters.price.max
    );

    return result;
  }, [sortedProducts, debouncedFilters, getFinalPrice]);

  // PAGINATION
  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const handleSeeMore = useCallback(() => {
    setVisibleCount((prev) => prev + itemsPerLoad);
  }, [itemsPerLoad]);

  const resetPagination = useCallback(() => {
    setVisibleCount(itemsPerLoad);
  }, [itemsPerLoad]);

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
