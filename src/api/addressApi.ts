import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

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
// Helper: find user by field "id"

const getUserDocById = async (userId: string) => {
  const q = query(collection(db, "users"), where("id", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");
  return snapshot.docs[0];
};

// Get user's address list
export const getUserAddresses = async (userId: string) => {
  const userDoc = await getUserDocById(userId);
  const userData = userDoc.data();
  const addresses = userData.addresses || [];
  return { data: addresses };
};
// Add new address

export const addUserAddress = async (userId: string, data: Address) => {
  const userDoc = await getUserDocById(userId);
  const userData = userDoc.data();

  const newAddress: Address = {
    ...data,
    id: uuidv4(),
    isDefault: data.isDefault || false,
    createdAt: new Date().toISOString(),
  };

  const updatedAddresses = [...(userData.addresses || []), newAddress];

  await updateDoc(userDoc.ref, { addresses: updatedAddresses });

  return { data: newAddress };
};

// Update address

export const updateUserAddress = async (
  userId: string,
  addressId: string,
  data: Partial<Address>
) => {
  const userDoc = await getUserDocById(userId);
  const userData = userDoc.data();

  const updatedAddresses = (userData.addresses || []).map((addr: Address) =>
    addr.id === addressId ? { ...addr, ...data } : addr
  );

  await updateDoc(userDoc.ref, { addresses: updatedAddresses });

  return { data };
};

// Delete address
export const deleteUserAddress = async (userId: string, addressId: string) => {
  const userDoc = await getUserDocById(userId);
  const userData = userDoc.data();

  const updatedAddresses = (userData.addresses || []).filter(
    (addr: Address) => addr.id !== addressId
  );

  await updateDoc(userDoc.ref, { addresses: updatedAddresses });

  return { data: addressId };
};

// Set default address
export const setDefaultUserAddress = async (
  userId: string,
  addressId: string
) => {
  const userDoc = await getUserDocById(userId);
  const userData = userDoc.data();

  const updatedAddresses = (userData.addresses || []).map((addr: Address) => ({
    ...addr,
    isDefault: addr.id === addressId,
  }));

  await updateDoc(userDoc.ref, { addresses: updatedAddresses });

  return { data: updatedAddresses };
};
