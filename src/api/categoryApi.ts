import api from "../lib/axios";

export const getCategories = async (): Promise<string[]> => {
  const res = await api.get("/products");
  return Array.from(
    new Set(res.data.map((p: any) => p.category).filter(Boolean))
  );
};
