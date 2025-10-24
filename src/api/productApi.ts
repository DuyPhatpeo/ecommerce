import api from "../lib/axios";

/**
 * Lấy danh sách sản phẩm
 * @param params các bộ lọc: search, category, brand, color, size, ...
 */
export const getProducts = async (params?: {
  search?: string;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

/**
 * Lấy chi tiết sản phẩm theo ID
 */
export const getProductById = async (id: string | number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
