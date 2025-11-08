import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Sparkles, Filter, ShoppingBag, ArrowUpDown } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ShopFilter from "../shop/ShopFilter";
import Button from "../ui/Button";
import ProductCard from "../section/ProductCard";

interface Product {
  id: string;
  title: string;
  salePrice?: number;
  regularPrice?: number;
  status?: string;
  images?: string[];
  stock?: number;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
}

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const [brandFilter, setBrandFilter] = useState<string[]>(
    searchParams.getAll("brand")
  );
  const [colorFilter, setColorFilter] = useState<string[]>(
    searchParams.getAll("color")
  );
  const [sizeFilter, setSizeFilter] = useState<string[]>(
    searchParams.getAll("size")
  );
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">(
    (searchParams.get("stock") as "all" | "in" | "out") || "all"
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") || "none"
  );
  const [priceRange, setPriceRange] = useState({
    min: Number(searchParams.get("min")) || 0,
    max: Number(searchParams.get("max")) || 100000000,
  });

  // --- Fetch sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts({ category });

        const normalizedData: Product[] = (data || []).map((p: any) => ({
          id: p.id,
          title: p.title || "Untitled",
          salePrice: p.salePrice ?? p.price ?? 0,
          regularPrice: p.regularPrice ?? p.oldPrice ?? p.salePrice ?? 0,
          stock: p.stock ?? 0,
          status: p.status,
          images: Array.isArray(p.images)
            ? p.images
            : p.image
            ? [p.image]
            : ["/placeholder.jpg"],
          category: p.category,
          brand: p.brand,
          color: p.color,
          size: p.size ?? "",
        }));

        setProducts(normalizedData);
      } catch {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const brandOptions = [
    ...new Set(
      products.map((p) => p.brand).filter((b): b is string => Boolean(b))
    ),
  ];

  useEffect(() => {
    const params: Record<string, string | string[]> = {};
    if (brandFilter.length) params.brand = brandFilter;
    if (colorFilter.length) params.color = colorFilter;
    if (sizeFilter.length) params.size = sizeFilter;
    if (stockFilter !== "all") params.stock = stockFilter;
    if (sortBy !== "none") params.sort = sortBy;
    if (priceRange.min > 0) params.min = String(priceRange.min);
    if (priceRange.max < 100000000) params.max = String(priceRange.max);
    setSearchParams(params as any, { replace: true });
  }, [brandFilter, colorFilter, sizeFilter, stockFilter, priceRange, sortBy]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchBrand =
        brandFilter.length === 0 || brandFilter.includes(p.brand || "");
      const matchColor =
        colorFilter.length === 0 || colorFilter.includes(p.color || "");
      const matchSize =
        sizeFilter.length === 0 || sizeFilter.includes(p.size || "");
      const matchStock =
        stockFilter === "all"
          ? true
          : stockFilter === "in"
          ? (p.stock ?? 0) > 0
          : (p.stock ?? 0) <= 0;
      const matchPrice =
        (p.salePrice ?? 0) >= priceRange.min &&
        (p.salePrice ?? 0) <= priceRange.max;

      return matchBrand && matchColor && matchSize && matchStock && matchPrice;
    });
  }, [products, brandFilter, colorFilter, sizeFilter, stockFilter, priceRange]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortBy) {
      case "name-asc":
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        items.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        items.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0));
        break;
      case "price-desc":
        items.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0));
        break;
      case "discount-high":
        items.sort(
          (a, b) =>
            (b.regularPrice ?? 0) -
            (b.salePrice ?? 0) -
            ((a.regularPrice ?? 0) - (a.salePrice ?? 0))
        );
        break;
    }
    // Ưu tiên còn hàng
    items.sort((a, b) => {
      const stockA = a.stock ?? 0;
      const stockB = b.stock ?? 0;
      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      return 0;
    });
    return items;
  }, [filteredProducts, sortBy]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const clearFilters = () => {
    setBrandFilter([]);
    setColorFilter([]);
    setSizeFilter([]);
    setStockFilter("all");
    setSortBy("none");
    setPriceRange({ min: 0, max: 100000000 });
    setSearchParams({});
  };

  const capitalize = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <section className="w-full min-h-screen py-5 px-2 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow mb-3">
            <Sparkles size={16} />
            <span>{capitalize(category) || "All Products"}</span>
            <ShoppingBag size={16} />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
            {category ? `${capitalize(category)} Collection` : "Our Collection"}
          </h2>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm text-sm"
            icon={<Filter size={16} />}
            label={"Filter"}
          />

          <div className="ml-auto flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1.5 shadow-sm">
            <ArrowUpDown size={16} className="text-orange-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-1 py-1 border-none outline-none bg-transparent text-gray-800 text-sm"
            >
              <option value="none">Default</option>
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
              <option value="discount-high">Biggest discount</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* SIDEBAR */}
          <div className="lg:w-60 shrink-0">
            <ShopFilter
              context="category"
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              categoryFilter={[]}
              setCategoryFilter={() => {}}
              categoryOptions={[]}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              sizeFilter={sizeFilter}
              setSizeFilter={setSizeFilter}
              brandOptions={brandOptions}
              hasActiveFilters={Boolean(
                brandFilter.length ||
                  colorFilter.length ||
                  sizeFilter.length ||
                  stockFilter !== "all"
              )} // ✅ ép kiểu boolean đúng chuẩn
              clearFilters={clearFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceMin={0}
              priceMax={100000000}
              priceStep={100000}
            />
          </div>

          {/* PRODUCT GRID */}
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {visibleProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  data={{
                    id: p.id,
                    img: p.images?.[0] || "/placeholder.jpg",
                    title: p.title,
                    salePrice: p.salePrice ?? 0,
                    regularPrice: p.regularPrice ?? 0,
                    stock: p.stock ?? 0,
                  }}
                />
              ))}
            </div>

            {visibleCount < sortedProducts.length && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  label="See More"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts;
