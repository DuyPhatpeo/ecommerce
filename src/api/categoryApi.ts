import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export const getCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const categories: string[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category) categories.push(data.category);
    });

    return Array.from(new Set(categories));
  } catch {
    return [];
  }
};
