import api from "../lib/axios";

/**
 * Lấy danh sách category (tự động từ sản phẩm có stock > 0)
 */
export const getCategories = async () => {
  const res = await api.get("/products");
  const products = res.data;

  // 🔹 Lấy các category duy nhất (và còn hàng)
  const uniqueCategories: string[] = Array.from(
    new Set(
      products
        .filter((p: any) => p.stock > 0 && typeof p.category === "string")
        .map((p: any) => p.category)
    )
  );

  // 🔹 Chuẩn hóa dữ liệu để trả về cho UI
  return uniqueCategories.map((cat) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    path: `/shop/category/${cat}`,
  }));
};
