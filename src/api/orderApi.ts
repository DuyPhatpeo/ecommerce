// src/api/orderApi.ts
import api from "../lib/axios";

export const createOrder = async (orderData: any) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};
