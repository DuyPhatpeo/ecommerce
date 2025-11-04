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

  const handleSave = async (data: Partial<Address>) => {
    try {
      if (data.id) {
        await updateUserAddress(userId, data.id, data);
        toast.success("Address updated!");
      } else {
        await addUserAddress(userId, data as Address);
        toast.success("Address added!");
      }
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserAddress(userId, id);
      toast.success("Address deleted!");
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

  return {
    addresses,
    fetchAddresses,
    handleSave,
    handleDelete,
    handleSetDefault,
  };
};
