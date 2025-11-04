import api from "../lib/axios";

export interface Address {
  id?: string;
  recipientName: string;
  phone: string;
  street: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
  createdAt?: string;
}

// Lấy danh sách địa chỉ của user
export const getUserAddresses = async (userId: string) => {
  const res = await api.get(`/users/${userId}`);
  return { data: res.data.addresses || [] };
};

// Thêm địa chỉ mới
export const addUserAddress = async (userId: string, data: Address) => {
  const res = await api.get(`/users/${userId}`);
  const user = res.data;
  const newAddress: Address = {
    ...data,
    id: Date.now().toString(),
    isDefault: data.isDefault || false,
    createdAt: new Date().toISOString(),
  };
  const updatedUser = {
    ...user,
    addresses: [...(user.addresses || []), newAddress],
  };
  await api.put(`/users/${userId}`, updatedUser);
  return { data: newAddress };
};

// Cập nhật địa chỉ
export const updateUserAddress = async (
  userId: string,
  addressId: string,
  data: Partial<Address>
) => {
  const res = await api.get(`/users/${userId}`);
  const user = res.data;
  const updatedAddresses = (user.addresses || []).map((addr: Address) =>
    addr.id === addressId ? { ...addr, ...data } : addr
  );
  await api.put(`/users/${userId}`, { ...user, addresses: updatedAddresses });
  return { data: data };
};

// Xóa địa chỉ
export const deleteUserAddress = async (userId: string, addressId: string) => {
  const res = await api.get(`/users/${userId}`);
  const user = res.data;
  const updatedAddresses = (user.addresses || []).filter(
    (addr: Address) => addr.id !== addressId
  );
  await api.put(`/users/${userId}`, { ...user, addresses: updatedAddresses });
  return { data: addressId };
};

// Đặt địa chỉ mặc định
export const setDefaultUserAddress = async (
  userId: string,
  addressId: string
) => {
  const res = await api.get(`/users/${userId}`);
  const user = res.data;
  const updatedAddresses = (user.addresses || []).map((addr: Address) => ({
    ...addr,
    isDefault: addr.id === addressId,
  }));
  await api.put(`/users/${userId}`, { ...user, addresses: updatedAddresses });
  return { data: updatedAddresses };
};
