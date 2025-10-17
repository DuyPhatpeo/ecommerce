import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionBanner from "../section/SectionBanner";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import { getProductById } from "../../api/productApi";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  title: string;
  images: string[];
  category: string;
  brand: string;
  status: string;
  price: number;
  oldPrice?: number;
  description?: string;
  specs?: Record<string, string>;
  reviews?: Review[];
  stock: number; // ✅ thêm stock để khớp với ProductInfo
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
        if (!id) throw new Error("Không có ID sản phẩm");
        const data = await getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  /** ======= Trạng thái loading ======= */
  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">
          Đang tải sản phẩm...
        </p>
      </div>
    );

  /** ======= Lỗi hoặc không có sản phẩm ======= */
  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
          <p className="text-red-600 text-lg font-semibold text-center">
            {error || "Sản phẩm không tồn tại."}
          </p>
        </div>
      </div>
    );

  /** ======= Giao diện chi tiết sản phẩm ======= */
  return (
    <div>
      {/* ======= Banner ======= */}
      <SectionBanner
        bgImage="/banner-bg.jpg"
        title={product.title}
        subtitle="Explore featured product details"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ======= Main Product Section ======= */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-300 hover:shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
              <ProductGallery images={product.images} title={product.title} />
              <ProductInfo
                id={product.id}
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice}
                category={product.category}
                brand={product.brand}
                images={product.images}
                stock={product.stock}
              />
            </div>
          </div>

          {/* ======= Tabs (Mô tả / Thông số / Đánh giá) ======= */}
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
