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

  // Parse string 1 dòng thành các field
  const parseAddressString = (input: string) => {
    const [street, ward, district, city, country = "Việt Nam"] = input
      .split(",")
      .map((p) => p.trim());
    return { street, ward, district, city, country, postalCode: "" };
  };

  // Format các field thành 1 dòng
  const formatAddressLine = (addr: Address) =>
    [addr.street, addr.ward, addr.district, addr.city, addr.country]
      .filter(Boolean)
      .join(", ");

  const addAddress = async (data: Partial<Address>) => {
    if (!userId) return toast.error("User not found");

    // Nếu nhập 1 dòng, tách ra các field
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

  const handleSave = async (data: Partial<Address>) => {
    if (data.id) {
      // Nếu có line, parse lại trước khi update
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

  // Trả về addresses với line gộp
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
