import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Address } from "../api/addressApi";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "../api/addressApi";

// ✅ Thêm kiểu mở rộng để dùng được field "line"
type AddressWithLine = Address & { line?: string };

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const userId = localStorage.getItem("userId") || "";

  const fetchAddresses = async () => {
    try {
      const res = await getUserAddresses(userId);
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 🔹 Parse 1 dòng địa chỉ thành các trường riêng
  const parseAddressString = (input: string) => {
    const [street, ward, district, city, country = "Việt Nam"] = input
      .split(",")
      .map((p) => p.trim());
    return { street, ward, district, city, country, postalCode: "" };
  };

  // 🔹 Gộp các trường thành 1 dòng địa chỉ
  const formatAddressLine = (addr: Address) =>
    [addr.street, addr.ward, addr.district, addr.city, addr.country]
      .filter(Boolean)
      .join(", ");

  // ✅ Thêm địa chỉ mới
  const addAddress = async (data: Partial<AddressWithLine>) => {
    if (!userId) return toast.error("User not found");

    const parsed = parseAddressString(data.line || data.street || "");
    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      recipientName: data.recipientName || "",
      phone: data.phone || "",
      ...parsed,
      isDefault: addresses.length === 0 ? true : data.isDefault || false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addUserAddress(userId, newAddress);
      toast.success("Address added!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    }
  };

  // ✅ Cập nhật hoặc thêm mới
  const handleSave = async (data: Partial<AddressWithLine>) => {
    if (data.id) {
      const updated = data.line
        ? { ...data, ...parseAddressString(data.line) }
        : data;
      try {
        await updateUserAddress(userId, data.id, updated);
        toast.success("Address updated!");
        fetchAddresses();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update address");
      }
    } else {
      await addAddress(data);
    }
  };

  // ✅ Xoá địa chỉ
  const handleDelete = async (id: string) => {
    try {
      const isDefaultDeleted = addresses.find(
        (addr) => addr.id === id
      )?.isDefault;
      await deleteUserAddress(userId, id);
      toast.success("Address deleted!");

      if (isDefaultDeleted && addresses.length > 1) {
        const remaining = addresses.filter((addr) => addr.id !== id);
        const newDefaultId = remaining[0].id!;
        await setDefaultUserAddress(userId, newDefaultId);
        toast.success("Default address updated!");
      }

      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  // ✅ Đặt mặc định
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultUserAddress(userId, id);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };

  // ✅ Trả về danh sách đã format
  const addressesFormatted = addresses.map((addr) => ({
    ...addr,
    line: formatAddressLine(addr),
  }));

  return {
    addresses,
    addressesFormatted,
    fetchAddresses,
    handleSave,
    handleDelete,
    handleSetDefault,
    addAddress,
  };
};
