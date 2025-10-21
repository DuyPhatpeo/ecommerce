import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowUpDown, Sparkles, PackageSearch, Tags } from "lucide-react";
import ProductCard from "../section/ProductCard";
import { getProducts } from "../../api/productApi";

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

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<
    | "none"
    | "name-asc"
    | "name-desc"
    | "price-asc"
    | "price-desc"
    | "discount-desc"
  >("none");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 📋 Handle filters
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(
        e.target.value as
          | "none"
          | "name-asc"
          | "name-desc"
          | "price-asc"
          | "price-desc"
          | "discount-desc"
      );
    },
    []
  );

  const handleStockChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStockFilter(e.target.value as "all" | "in" | "out");
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategoryFilter(e.target.value);
    },
    []
  );

  // 🔠 Sort logic
  const sortedProducts = useMemo(() => {
    if (sortBy === "none") return [...products];
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
      case "discount-desc":
        return sorted.sort((a, b) => {
          const discountA =
            a.oldPrice && a.oldPrice > a.price
              ? ((a.oldPrice - a.price) / a.oldPrice) * 100
              : 0;
          const discountB =
            b.oldPrice && b.oldPrice > b.price
              ? ((b.oldPrice - b.price) / b.oldPrice) * 100
              : 0;
          return discountB - discountA;
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

  const categoryOptions = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return cats;
  }, [products]);

  // 🕓 Loading / Error
  if (loading)
    return (
      <div className="w-full py-20 text-center text-gray-500">
        Loading products...
      </div>
    );
  if (error)
    return <div className="w-full py-20 text-center text-red-500">{error}</div>;
  if (products.length === 0)
    return (
      <div className="w-full py-20 text-center text-gray-500">
        No products available.
      </div>
    );

  return (
    <section className="w-full py-16 sm:py-20 px-3 sm:px-6 md:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-orange-100/40 rounded-full blur-3xl -z-10 hidden sm:block" />
      <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 hidden sm:block" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 sm:mb-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 sm:py-2 rounded-full text-sm font-semibold mb-3 sm:mb-4">
            <Sparkles size={16} />
            <span>All Products</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
            Our Collection
          </h2>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto md:mx-0 mt-2">
            Browse all our products. Designed with style, comfort, and
            performance in mind.
          </p>
        </div>

        {/* Sort & Filter */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 sm:gap-3 bg-white rounded-2xl px-3 sm:px-4 py-2 shadow-sm border border-gray-200 text-sm w-full md:w-auto">
          {/* Sort */}
          <div className="flex items-center gap-1">
            <ArrowUpDown size={16} className="text-gray-500" />
            <label className="hidden sm:inline text-gray-600 text-xs sm:text-sm font-medium">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-1 sm:px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-700 font-medium cursor-pointer text-xs sm:text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
              <option value="discount-desc">Discount High</option>
            </select>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1">
            <PackageSearch size={16} className="text-gray-500" />
            <label className="hidden sm:inline text-gray-600 text-xs sm:text-sm font-medium">
              Stock:
            </label>
            <select
              value={stockFilter}
              onChange={handleStockChange}
              className="px-1 sm:px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-700 font-medium cursor-pointer text-xs sm:text-sm"
            >
              <option value="all">All</option>
              <option value="in">In Stock</option>
              <option value="out">Out</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-1">
            <Tags size={16} className="text-gray-500" />
            <label className="hidden sm:inline text-gray-600 text-xs sm:text-sm font-medium">
              Category:
            </label>
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="px-1 sm:px-2 py-1 rounded-lg border-none outline-none bg-transparent text-gray-700 font-medium cursor-pointer text-xs sm:text-sm"
            >
              <option value="all">All</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8 justify-items-center">
          {filteredProducts.map((product) => (
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
      </div>
    </section>
  );
};

export default Shop;
