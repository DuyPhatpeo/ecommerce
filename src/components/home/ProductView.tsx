import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ProductSlider from "./ProductSlider";
import ProductGrid from "./ProductGrid";

interface Product {
  id: number;
  title: string;
  price?: number;
  salePrice?: number | null;
  regularPrice?: number;
  oldPrice?: number;
  stock?: number;
  images?: string[];
  status?: string;
  category?: string;
}

export interface Section {
  title: string;
  products: Product[];
  swiperClass: string;
}

type ViewMode = "slider" | "grid";

interface ProductViewProps {
  viewMode?: ViewMode;
  status?: string | string[];
  category?: string | string[];
  title?: string;
  maxProducts?: number;
  showNavigation?: boolean;
  itemsPerPage?: number;
}

const STATUS_CONFIG: Record<string, { title: string }> = {
  latest: { title: "Latest Products" },
  coming: { title: "Coming Soon" },
};

const filterProducts = (
  products: Product[],
  options?: {
    status?: string | string[];
    category?: string | string[];
    maxProducts?: number;
  }
) => {
  if (!products.length) return [];

  let filtered = products.filter((p) => (p.stock ?? 0) > 0);

  if (options?.status) {
    const statuses = Array.isArray(options.status)
      ? options.status
      : [options.status];
    filtered = filtered.filter((p) => p.status && statuses.includes(p.status));
  }

  if (options?.category) {
    const categories = Array.isArray(options.category)
      ? options.category
      : [options.category];
    filtered = filtered.filter(
      (p) => p.category && categories.includes(p.category)
    );
  }

  return options?.maxProducts
    ? filtered.slice(0, options.maxProducts)
    : filtered;
};

const useSectionData = (
  status?: string | string[],
  category?: string | string[],
  maxProducts?: number,
  title?: string
) => {
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        if (!isMounted) return;
        if (!Array.isArray(data)) throw new Error("Invalid product data");

        const filteredProducts = filterProducts(data, {
          status,
          category,
          maxProducts,
        });
        if (!filteredProducts.length) return setSection(null);

        const defaultTitle =
          status && !Array.isArray(status)
            ? STATUS_CONFIG[status]?.title
            : undefined;

        setSection({
          title: title || defaultTitle || "Products",
          products: filteredProducts,
          swiperClass: `product-swiper-${status || "default"}`,
        });
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (isMounted) setSection(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [status, category, maxProducts, title]);

  return { section, isLoading };
};

const LoadingState = () => (
  <div className="w-full py-12 md:py-20 text-center text-gray-500">
    <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-sm md:text-base">Loading products...</p>
  </div>
);

const EmptyState = () => (
  <div className="w-full py-12 md:py-20 text-center text-gray-500">
    <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
    <p className="text-sm md:text-base">No products available.</p>
  </div>
);

const SectionHeaderContent = ({ section }: { section: Section }) => (
  <div className="flex-1 text-center md:text-left overflow-visible">
    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight pb-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-800 bg-clip-text text-transparent">
      {section.title}
    </h2>
  </div>
);

const ProductView: React.FC<ProductViewProps> = ({
  viewMode = "slider",
  status,
  category,
  title,
  maxProducts,
  showNavigation = true,
  itemsPerPage = 8,
}) => {
  const { section, isLoading } = useSectionData(
    status,
    category,
    maxProducts,
    title
  );

  if (isLoading) return <LoadingState />;
  if (!section || !section.products.length) return <EmptyState />;

  return (
    <section className="w-full py-8 md:py-16 bg-gradient-to-br from-gray-50 via-white to-white-50/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-9 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 md:mb-12">
        <SectionHeaderContent section={section} />
      </div>

      {viewMode === "slider" ? (
        <ProductSlider section={section} showNavigation={showNavigation} />
      ) : (
        <ProductGrid
          section={section}
          showNavigation={showNavigation}
          itemsPerPage={itemsPerPage}
        />
      )}
    </section>
  );
};

export default ProductView;
