import api from "../lib/axios";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getProductById = async (id: string | number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
