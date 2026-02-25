import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import { getProductById } from "../../api/productApi";
import Loader from "../../components/layout/Loader";

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

interface ProductDetailProps {
  onLoadTitle?: (title: string) => void;
}

export default function ProductDetail({ onLoadTitle }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("No product ID");

        const data = await getProductById(id);

        if (!data || Object.keys(data).length === 0) {
          navigate("/404", { replace: true });
          return;
        }

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
        if (onLoadTitle) onLoadTitle(normalized.title);
      } catch (err) {
        console.error(err);
        navigate("/404", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id, navigate, onLoadTitle]);

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f8f6f3] py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-16">
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
  );
}
