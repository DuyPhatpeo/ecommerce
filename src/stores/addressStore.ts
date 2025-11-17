import { create } from "zustand";
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

interface AddressState {
  addresses: Address[];
  loading: boolean;

  // Actions
  fetchAddresses: (userId: string) => Promise<void>;
  addAddress: (userId: string, data: Partial<AddressWithLine>) => Promise<void>;
  handleSave: (userId: string, data: Partial<AddressWithLine>) => Promise<void>;
  handleDelete: (userId: string, id: string) => Promise<void>;
  handleSetDefault: (userId: string, id: string) => Promise<void>;

  // Getters
  getAddressesFormatted: () => AddressWithLine[];
  getDefaultAddress: () => Address | undefined;
}

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

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,

  // 🔹 Fetch all addresses from Firestore
  fetchAddresses: async (userId: string) => {
    if (!userId) return;

    set({ loading: true });
    try {
      const res = await getUserAddresses(userId);
      set({ addresses: res.data, loading: false });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
      set({ loading: false });
    }
  },

  // ✅ Add new address
  addAddress: async (userId: string, data: Partial<AddressWithLine>) => {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    const { addresses } = get();
    const parsed = parseAddressString(data.line || data.street || "");
    const newAddress: Address = {
      id: `${Date.now()}`,
      recipientName: data.recipientName || "",
      phone: data.phone || "",
      ...parsed,
      isDefault: addresses.length === 0 ? true : data.isDefault || false,
      createdAt: new Date().toISOString(),
    };

    set({ loading: true });
    try {
      await addUserAddress(userId, newAddress);
      toast.success("Address added!");
      await get().fetchAddresses(userId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add address");
      set({ loading: false });
    }
  },

  // ✅ Update existing or add new
  handleSave: async (userId: string, data: Partial<AddressWithLine>) => {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    if (data.id) {
      const updated = data.line
        ? { ...data, ...parseAddressString(data.line) }
        : data;

      set({ loading: true });
      try {
        await updateUserAddress(userId, data.id, updated);
        toast.success("Address updated!");
        await get().fetchAddresses(userId);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update address");
        set({ loading: false });
      }
    } else {
      await get().addAddress(userId, data);
    }
  },

  // ✅ Delete address
  handleDelete: async (userId: string, id: string) => {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    const { addresses } = get();

    set({ loading: true });
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

      await get().fetchAddresses(userId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
      set({ loading: false });
    }
  },

  // ✅ Set default address
  handleSetDefault: async (userId: string, id: string) => {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    set({ loading: true });
    try {
      await setDefaultUserAddress(userId, id);
      toast.success("Default address updated!");
      await get().fetchAddresses(userId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to set default address");
      set({ loading: false });
    }
  },

  // ✅ Format addresses for display
  getAddressesFormatted: () => {
    const { addresses } = get();
    return addresses.map((addr) => ({
      ...addr,
      line: formatAddressLine(addr),
    }));
  },

  // ✅ Get default address
  getDefaultAddress: () => {
    const { addresses } = get();
    return addresses.find((addr) => addr.isDefault);
  },
}));
