import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([
    { label: "HOME", path: "/" },
    { label: "SHOP", path: "/shop" },
    {
      label: "PAGES",
      subMenu: [
        { label: "SHOP CATEGORY", path: "/shop/category" },
        { label: "PRODUCT DETAILS", path: "/product/1" },
        { label: "CHECKOUT", path: "/checkout" },
        { label: "SHOPPING CART", path: "/cart" },
        { label: "CONFIRMATION", path: "/order-success" },
      ],
    },
    { label: "CONTACT", path: "/contact" },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        if (!Array.isArray(categories) || categories.length === 0) return;

        const categoryMenu = {
          label: "CATEGORY",
          subMenu: categories,
        };

        setMenuItems((prev) => {
          // ❗ Kiểm tra xem đã có CATEGORY chưa
          if (prev.some((item) => item.label === "CATEGORY")) {
            return prev; // Không thêm nữa
          }

          const newMenu = [...prev];
          const shopIndex = newMenu.findIndex((m) => m.label === "SHOP");
          newMenu.splice(shopIndex + 1, 0, categoryMenu);
          return newMenu;
        });
      } catch (error) {
        console.error("❌ Lỗi khi fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return { menuItems };
};
