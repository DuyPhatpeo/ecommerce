import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionBanner from "../section/SectionBanner";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import { getProductById } from "../../api/productApi";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  title: string;
  images: string[];
  category: string;
  brand: string;
  status?: string;
  salePrice?: number;
  regularPrice?: number;
  description?: string;
  specs?: Record<string, string>;
  reviews?: Review[];
  stock?: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("No product ID");

        const data = await getProductById(id);

        // Normalize data để tránh undefined và lỗi TS
        const normalized: Product = {
          id: data.id,
          title: data.title || "Untitled",
          salePrice: data.salePrice ?? 0,
          regularPrice: data.regularPrice ?? data.salePrice ?? 0,
          stock: data.stock ?? 0,
          status: data.status ?? "available",
          images: Array.isArray(data.images)
            ? data.images
            : data.images
            ? [data.images]
            : ["/placeholder.jpg"],
          category: data.category || "Uncategorized",
          brand: data.brand || "No Brand",
          description: data.description,
          specs: data.specs,
          reviews: data.reviews ?? [],
        };

        setProduct(normalized);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading product...</p>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
          <p className="text-red-600 text-lg font-semibold text-center">
            {error || "Product not found."}
          </p>
        </div>
      </div>
    );

  return (
    <div>
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title={product.title}
        subtitle="Explore featured product details"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-300 hover:shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
              <ProductGallery images={product.images} title={product.title} />
              <ProductInfo
                id={product.id}
                title={product.title}
                salePrice={product.salePrice!}
                regularPrice={product.regularPrice!}
                category={product.category}
                brand={product.brand}
                images={product.images}
                stock={product.stock!}
              />
            </div>
          </div>

          <ProductTabs
            description={product.description}
            specs={product.specs}
            reviews={product.reviews || []}
          />
        </div>
      </div>
    </div>
  );
}
