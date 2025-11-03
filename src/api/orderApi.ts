// src/api/orderApi.ts
import api from "../lib/axios";

// Create a new order
export const createOrder = async (orderData: any) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

// Get all orders
export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// Get order details by ID
export const getOrderById = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};
