// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../api/cartApi";
import { getProductById } from "../api/productApi";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  /* =====================
     🛒 FETCH CART
  ===================== */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const cart = await getCart();

      if (!cart || cart.length === 0) {
        setCartItems([]);
        return;
      }

      const products = await Promise.allSettled(
        cart.map((item: any) => getProductById(item.productId))
      );

      const merged = cart.map((item: any, i: number) => ({
        ...item,
        id: String(item.id),
        product:
          products[i].status === "fulfilled"
            ? products[i].value
            : { name: "Unknown", price: 0, stock: 0 },
      }));

      setCartItems(merged);
      setSelectedItems([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* =====================
     🔄 UPDATE QUANTITY
  ===================== */
  const updateQuantity = async (id: string, change: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);
    if (newQty === item.quantity) return;

    setUpdating(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );

    try {
      await updateCartItem(id, newQty);
      toast.success("Quantity updated successfully.");
    } catch {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
      );
      toast.error("Failed to update quantity.");
    } finally {
      setUpdating(null);
    }
  };

  /* =====================
     ❌ REMOVE ITEM
  ===================== */
  const removeItem = async (id: string) => {
    const prev = [...cartItems];
    setCartItems((c) => c.filter((i) => i.id !== id));
    setSelectedItems((s) => s.filter((sid) => sid !== id));

    try {
      await deleteCartItem(id);
      toast.success("Item removed from cart.");
    } catch {
      setCartItems(prev);
      toast.error("Failed to remove item.");
    }
  };

  /* =====================
     🧹 CLEAR CART
  ===================== */
  const removeAll = async () => {
    if (cartItems.length === 0) return;
    setClearing(true);
    const prev = [...cartItems];
    setCartItems([]);
    setSelectedItems([]);

    try {
      await clearCart();
      toast.success("All items removed from cart.");
    } catch {
      setCartItems(prev);
      toast.error("Failed to clear cart.");
    } finally {
      setClearing(false);
    }
  };

  /* =====================
     ✅ SELECT ITEMS
  ===================== */
  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const validIds = cartItems
      .filter((i) => i.product?.stock > 0 && i.quantity <= i.product.stock)
      .map((i) => String(i.id));

    setSelectedItems((prev) =>
      validIds.every((id) => prev.includes(id)) ? [] : validIds
    );
  };

  return {
    cartItems,
    selectedItems,
    loading,
    updating,
    clearing,
    fetchCart,
    updateQuantity,
    removeItem,
    removeAll,
    toggleSelect,
    toggleSelectAll,
  };
};
