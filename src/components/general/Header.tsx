import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCart } from "../../api/cartApi";
import Button from "../ui/Button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

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

  // 🛒 Lấy số lượng sản phẩm trong giỏ hàng
  const fetchCartCount = async () => {
    try {
      const { data } = await getCart();
      setCartCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  // ⌨️ Khi nhấn Enter → điều hướng sang /search
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 300);
  };
  const toggleSubMenu = (label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 120);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideSearch =
        searchBoxRef.current && !searchBoxRef.current.contains(target);
      const outsideMobile =
        mobileMenuRef.current && !mobileMenuRef.current.contains(target);

      if (searchOpen && outsideSearch) setSearchOpen(false);
      if (mobileOpen && outsideMobile) setMobileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen, mobileOpen]);

  return (
    <header className="fixed left-0 top-0 w-full z-50">
      <div
        className={`relative mx-auto transition-all duration-500 ease-in-out ${
          isScrolled
            ? "w-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
            : "lg:w-[65%] lg:mt-6 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
        }`}
      >
        <div className="flex items-center justify-between max-w-[1200px] mx-auto h-[70px] sm:h-[80px] px-4 sm:px-6 gap-8">
          {/* 🔸 Logo */}
          <Link to="/" className="flex items-center mr-auto">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 sm:h-11 md:h-12 object-contain cursor-pointer"
            />
          </Link>

          {/* 🔸 Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold tracking-wide">
            {menuItems.map((item, i) => (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.path ?? "/"}
                  className={`px-2 transition-colors ${
                    location.pathname === item.path
                      ? "text-orange-500"
                      : "text-gray-800 hover:text-orange-500"
                  }`}
                >
                  {item.label}
                </Link>
                {/* Submenu (Desktop) */}
                <AnimatePresence>
                  {item.subMenu && activeMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-[50px] w-[220px] bg-white shadow-lg border border-gray-100 z-40 rounded"
                    >
                      {item.subMenu.map((sub, j) => (
                        <Link
                          key={j}
                          to={sub.path}
                          className="block px-5 py-2 text-[13px] border-t border-gray-100 first:border-t-0 text-gray-700 hover:bg-orange-500 hover:text-white"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* 🔸 Icons + Login */}
          <div className="flex items-center gap-4 lg:gap-8 text-gray-800">
            {/* Login Button (Desktop) */}
            <Link
              to="/login"
              className="hidden lg:inline-block px-4 py-2 border border-orange-500 rounded text-orange-500 font-semibold text-sm hover:bg-orange-500 hover:text-white transition-colors"
            >
              Đăng nhập
            </Link>

            {/* Search */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="group hover:text-orange-500 transition-colors"
            >
              <Search
                size={22}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative group hover:text-orange-500 transition-colors"
            >
              <ShoppingBag
                size={22}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              {mobileOpen ? (
                <X
                  size={22}
                  className="cursor-pointer hover:text-orange-500"
                  onClick={() => setMobileOpen(false)}
                />
              ) : (
                <Menu
                  size={22}
                  className="cursor-pointer hover:text-orange-500"
                  onClick={() => setMobileOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* 🔸 Search Bar (Animated) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchBoxRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex justify-center bg-orange-50 py-4 shadow-md rounded-b-lg">
                <div className="relative w-full px-4 md:w-3/5">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="Tìm sản phẩm..."
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                  />
                  <Button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                    icon={<X size={20} />}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔸 Mobile Menu (Animated) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-md max-h-[calc(100vh-70px)] sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              {menuItems.map((item, i) => (
                <div key={i} className="border-b border-gray-100">
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className="w-full text-left px-5 py-3 text-[14px] font-semibold text-gray-800 hover:text-orange-500 flex justify-between items-center"
                      >
                        <span>{item.label}</span>
                        {activeMenu === item.label ? (
                          <ChevronDown size={18} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-400" />
                        )}
                      </button>
                      <AnimatePresence>
                        {activeMenu === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50"
                          >
                            {item.subMenu.map((sub, j) => (
                              <Link
                                key={j}
                                to={sub.path}
                                onClick={() => setMobileOpen(false)}
                                className="block px-8 py-2 text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 text-[14px] font-semibold text-gray-800 hover:text-orange-500"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}

              {/* 🔹 Login Mobile */}
              <div className="border-b border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-left px-5 py-3 text-[14px] font-semibold text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Đăng nhập
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
