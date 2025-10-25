// hooks/useMenuItems.ts
export const useMenuItems = () => {
  const menuItems = [
    { label: "HOME", path: "/" },
    { label: "SHOP", path: "/shop" },
    { label: "BLOG", path: "/blog" },
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

  return { menuItems };
};
