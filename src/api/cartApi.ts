import api from "../lib/axios";

// 🛒 Lấy toàn bộ giỏ hàng
export const getCart = () => api.get("/cart");

// 🛒 Lấy 1 item trong giỏ hàng theo id
export const getCartItem = (id: number) => api.get(`/cart/${id}`);

// 🔄 Cập nhật số lượng của 1 item
export const updateCartItem = (id: number, quantity: number) => {
  return api.patch(`/cart/${id}`, { quantity });
};

// ❌ Xóa 1 item khỏi giỏ hàng
export const deleteCartItem = (id: number) => api.delete(`/cart/${id}`);

// ➕ Thêm sản phẩm vào giỏ hàng (hoặc tăng số lượng nếu đã tồn tại)
export const addToCart = async (productId: number, quantity = 1) => {
  const { data: cart } = await api.get("/cart");
  const existingItem = cart.find((item: any) => item.productId === productId);

  if (existingItem) {
    // Nếu sản phẩm đã có -> chỉ tăng số lượng
    return api.patch(`/cart/${existingItem.id}`, {
      quantity: existingItem.quantity + quantity,
    });
  } else {
    // Nếu chưa có -> thêm mới
    return api.post("/cart", { productId, quantity });
  }
};

// 🧹 Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  const { data: cart } = await api.get("/cart");
  const deleteRequests = cart.map((item: any) =>
    api.delete(`/cart/${item.id}`)
  );
  await Promise.all(deleteRequests);
  return [];
};
