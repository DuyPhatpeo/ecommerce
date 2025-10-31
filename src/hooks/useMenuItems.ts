import { useEffect, useState, useMemo } from "react";
import { getCategories } from "../api/categoryApi";

interface MenuItem {
  label: string;
  path?: string;
  subMenu?: MenuItem[];
}

export const useMenuItems = () => {
  // 🔹 Base menu tĩnh
  const baseMenu: MenuItem[] = useMemo(
    () => [
      { label: "HOME", path: "/" },
      { label: "SHOP", path: "/shop" },

      // ⭐⭐⭐ PAGES MENU (tạm ẩn, bật lại khi cần) ⭐⭐⭐
      // {
      //   label: "PAGES",
      //   subMenu: [
      //     { label: "SHOP CATEGORY", path: "/shop/category" },
      //     { label: "PRODUCT DETAILS", path: "/product/1" },
      //     { label: "CHECKOUT", path: "/checkout" },
      //     { label: "SHOPPING CART", path: "/cart" },
      //     { label: "CONFIRMATION", path: "/order-success" },
      //   ],
      // },

      { label: "CONTACT", path: "/contact" },
    ],
    []
  );

  const [menuItems, setMenuItems] = useState<MenuItem[]>(baseMenu);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        if (!Array.isArray(categories) || categories.length === 0) return;

        // 🔹 Tạo menu con cho CATEGORY
        const categoryMenu: MenuItem = {
          label: "CATEGORY",
          subMenu: categories.map((cat: string) => ({
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            path: `/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`,
          })),
        };

        setMenuItems((prev) => {
          // ⚡ Chỉ thêm nếu chưa tồn tại CATEGORY
          if (prev.some((item) => item.label === "CATEGORY")) return prev;

          const updated = [...prev];
          const shopIndex = updated.findIndex((m) => m.label === "SHOP");

          // ⚡ Chèn ngay sau SHOP
          if (shopIndex !== -1) updated.splice(shopIndex + 1, 0, categoryMenu);
          else updated.push(categoryMenu);

          return updated;
        });
      } catch (error) {
        console.error("❌ Fetch categories failed:", error);
      }
    };

    fetchCategories();
  }, []);

  return { menuItems };
};
