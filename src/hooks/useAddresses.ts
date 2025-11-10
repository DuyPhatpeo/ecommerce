import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import type { Address } from "../api/addressApi";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "../api/addressApi";

// 🔹 Extend type with "line" for formatted display
type AddressWithLine = Address & { line?: string };

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const userId = localStorage.getItem("userId") || "";

  // 🔹 Fetch all addresses from Firestore
  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const res = await getUserAddresses(userId);
      setAddresses(res.data);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 🔹 Parse one-line address into separate fields
  const parseAddressString = (input: string) => {
    const [street, ward, district, city, country = "Vietnam"] = input
      .split(",")
      .map((p) => p.trim());
    return { street, ward, district, city, country, postalCode: "" };
  };

  // 🔹 Combine fields into one-line address
  const formatAddressLine = (addr: Address) =>
    [addr.street, addr.ward, addr.district, addr.city, addr.country]
      .filter(Boolean)
      .join(", ");

  // ✅ Add new address
  const addAddress = async (data: Partial<AddressWithLine>) => {
    if (!userId) return toast.error("User not found");

    const parsed = parseAddressString(data.line || data.street || "");
    const newAddress: Address = {
      id: `${Date.now()}`,
      recipientName: data.recipientName || "",
      phone: data.phone || "",
      ...parsed,
      isDefault: addresses.length === 0 ? true : data.isDefault || false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addUserAddress(userId, newAddress);
      toast.success("Address added!");
      await fetchAddresses();
    } catch {
      toast.error("Failed to add address");
    }
  };

  // ✅ Update existing or add new
  const handleSave = async (data: Partial<AddressWithLine>) => {
    if (!userId) return toast.error("User not found");

    if (data.id) {
      const updated = data.line
        ? { ...data, ...parseAddressString(data.line) }
        : data;
      try {
        await updateUserAddress(userId, data.id, updated);
        toast.success("Address updated!");
        await fetchAddresses();
      } catch {
        toast.error("Failed to update address");
      }
    } else {
      await addAddress(data);
    }
  };

  // ✅ Delete address
  const handleDelete = async (id: string) => {
    if (!userId) return toast.error("User not found");

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

      await fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  // ✅ Set default address
  const handleSetDefault = async (id: string) => {
    if (!userId) return toast.error("User not found");

    try {
      await setDefaultUserAddress(userId, id);
      toast.success("Default address updated!");
      await fetchAddresses();
    } catch {
      toast.error("Failed to set default address");
    }
  };

  // ✅ Format addresses for display
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
