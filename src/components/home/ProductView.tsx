import React, { useEffect, useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ProductSlider from "./ProductSlider";
import ProductGrid from "./ProductGrid";

interface Product {
  id: string;
  title: string;
  price?: number;
  salePrice?: number | null;
  regularPrice?: number | null;
  oldPrice?: number | null;
  stock?: number;
  images?: string[];
  status?: string;
}

export interface Section {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  swiperClass: string;
}

type ViewMode = "slider" | "grid";

interface ProductViewProps {
  viewMode?: ViewMode;
  status?: string | string[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxProducts?: number;
  showNavigation?: boolean;
  itemsPerPage?: number;
}

// Config tiêu đề / icon theo status
const STATUS_CONFIG: Record<
  string,
  { title: string; subtitle: string; icon: React.ReactNode }
> = {
  latest: {
    title: "Latest Products",
    subtitle: "Discover our newest arrivals with exclusive deals",
    icon: <TrendingUp size={18} />,
  },
  coming: {
    title: "Coming Soon",
    subtitle: "Pre-order exclusive releases",
    icon: <Sparkles size={18} />,
  },
};

// Lọc sản phẩm theo status, stock > 0 và maxProducts
const filterProductsByStatus = (
  products: Product[],
  status?: string | string[],
  maxProducts?: number
) => {
  if (!products.length) return [];

  let filtered = products;

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    filtered = products.filter(
      (p) => p.status && statuses.includes(p.status) && (p.stock ?? 0) > 0
    );
  } else {
    filtered = products.filter((p) => (p.stock ?? 0) > 0);
  }

  return maxProducts ? filtered.slice(0, maxProducts) : filtered;
};

// Hook fetch sản phẩm và tạo section
const useSectionData = (
  status?: string | string[],
  maxProducts?: number,
  title?: string,
  subtitle?: string,
  icon?: React.ReactNode
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

        const filteredProducts = filterProductsByStatus(
          data,
          status,
          maxProducts
        );
        if (!filteredProducts.length) return setSection(null);

        const defaultConfig =
          status && !Array.isArray(status) ? STATUS_CONFIG[status] : null;

        setSection({
          title: title || defaultConfig?.title || "Products",
          subtitle:
            subtitle || defaultConfig?.subtitle || "Browse our collection",
          icon: icon || defaultConfig?.icon || <Sparkles size={18} />,
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
  }, [status, maxProducts, title, subtitle, icon]);

  return { section, isLoading };
};

// Loading / Empty states
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

// Header hiển thị tiêu đề, icon, subtitle
const SectionHeaderContent = ({ section }: { section: Section }) => (
  <div className="flex-1 text-center md:text-left">
    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
      {section.icon}
      <span>Special Collection</span>
    </div>
    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-800 bg-clip-text text-transparent">
      {section.title}
    </h2>
    <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto md:mx-0 mt-2">
      {section.subtitle}
    </p>
  </div>
);

const ProductView: React.FC<ProductViewProps> = ({
  viewMode = "slider",
  status,
  title,
  subtitle,
  icon,
  maxProducts,
  showNavigation = true,
  itemsPerPage = 8,
}) => {
  const { section, isLoading } = useSectionData(
    status,
    maxProducts,
    title,
    subtitle,
    icon
  );

  if (isLoading) return <LoadingState />;
  if (!section || !section.products.length) return <EmptyState />;

  return (
    <section className="w-full py-8 md:py-16 bg-gradient-to-br from-gray-50 via-white to-white-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-9 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 md:mb-12">
        <SectionHeaderContent section={section} />
      </div>

      {/* View Mode */}
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
