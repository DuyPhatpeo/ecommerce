import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";

export const useMenuItems = () => {
  const baseMenu = [
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
  ];

  const [menuItems, setMenuItems] = useState(baseMenu);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        if (!Array.isArray(categories) || categories.length === 0) return;

        // 🔹 Format lại category thành { label, path }
        const categoryMenu = {
          label: "CATEGORY",
          subMenu: categories.map((cat) => ({
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            path: `/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`,
          })),
        };

        setMenuItems((prev) => {
          // Nếu đã có CATEGORY thì không thêm nữa
          if (prev.some((item) => item.label === "CATEGORY")) return prev;

          const updated = [...prev];
          const shopIndex = updated.findIndex((m) => m.label === "SHOP");
          updated.splice(shopIndex + 1, 0, categoryMenu);
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
