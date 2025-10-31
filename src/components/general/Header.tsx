import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useHeader } from "../../hooks/useHeader";
import { useMenuItems } from "../../hooks/useMenuItems";

const Header = () => {
  const {
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    cartCount,
    searchQuery,
    user,
    searchInputRef,
    searchBoxRef,
    mobileMenuRef,
    setMobileOpen,
    setSearchOpen,
    setSearchQuery,
    handleSearchSubmit,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu,
    location,
    navigate,
  } = useHeader();

  const { menuItems } = useMenuItems();

  /** =============================
   * 🔹 Components nhỏ hơn
   ============================== */

  const NavItem = ({ item }: any) => (
    <div
      className="relative"
      onMouseEnter={() => handleMouseEnter(item.label)}
      onMouseLeave={handleMouseLeave}
    >
      {item.path ? (
        <Link
          to={item.path}
          className={`px-2 py-1 whitespace-nowrap transition-colors ${
            location.pathname === item.path
              ? "text-orange-500"
              : "text-gray-800 hover:text-orange-500"
          }`}
        >
          {item.label}
        </Link>
      ) : (
        <span className="px-2 py-1 text-gray-800 cursor-default whitespace-nowrap">
          {item.label}
        </span>
      )}

      {/* Submenu Desktop */}
      <AnimatePresence>
        {item.subMenu && activeMenu === item.label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-[45px] w-[220px] bg-white shadow-lg border border-gray-100 z-40 rounded-lg overflow-hidden"
          >
            {item.subMenu.map((sub: any, j: number) => (
              <LinkOrSpan
                key={j}
                item={sub}
                className="block px-5 py-2.5 text-[13px] border-t border-gray-100 first:border-t-0 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const LinkOrSpan = ({ item, className }: any) =>
    item.path ? (
      <Link to={item.path} className={className}>
        {item.label}
      </Link>
    ) : (
      <span className={`${className} text-gray-400 cursor-not-allowed`}>
        {item.label}
      </span>
    );

  /** =============================
   * 🔹 JSX chính
   ============================== */

  return (
    <header className="fixed left-0 top-0 w-full z-50">
      <div
        className={`relative mx-auto transition-all duration-500 ${
          isScrolled
            ? "w-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
            : "w-full lg:w-[75%] xl:w-[65%] lg:mt-6 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] lg:rounded-2xl"
        }`}
      >
        {/* Header Main */}
        <div className="flex items-center justify-between max-w-[1200px] mx-auto h-[60px] xs:h-[65px] sm:h-[75px] lg:h-[80px] px-4 sm:px-6 gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 sm:h-11 lg:h-12 object-contain cursor-pointer transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[13px] font-semibold flex-1 justify-center">
            {menuItems.map((item, i) => (
              <NavItem key={i} item={item} />
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 text-gray-800">
            {!user && (
              <Link
                to="/login"
                className="hidden lg:inline-block px-3 py-1.5 border border-orange-500 rounded text-orange-500 font-semibold text-xs hover:bg-orange-500 hover:text-white"
              >
                Login
              </Link>
            )}

            <IconButton
              onClick={() => setSearchOpen((prev) => !prev)}
              icon={<Search size={20} />}
            />

            {user && (
              <Link
                to="/account"
                className="hover:text-orange-500 transition-colors"
              >
                <User size={20} />
              </Link>
            )}

            <CartButton count={cartCount} />

            <MobileToggle
              open={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </div>

        {/* Search Box */}
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
              <div className="flex justify-center bg-orange-50 py-3 shadow-md rounded-b-lg">
                <div className="relative w-full sm:w-3/5 lg:w-1/2 px-4">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="Search products..."
                    autoFocus
                    className="w-full pl-12 pr-10 py-2.5 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  />

                  <Button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                    icon={<X size={18} />}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden bg-white border-t border-gray-100 shadow-md max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              {menuItems.map((item, i) => (
                <div key={i} className="border-b border-gray-100">
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className="w-full flex justify-between items-center px-5 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500"
                      >
                        {item.label}
                        {activeMenu === item.label ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <AnimatePresence>
                        {activeMenu === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50"
                          >
                            {item.subMenu.map((sub: any, j: number) => (
                              <LinkOrSpan
                                key={j}
                                item={sub}
                                className="block px-8 py-2.5 text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white"
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.path) navigate(item.path);
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

/** =============================
 * 🔹 Các component phụ
 ============================== */

const IconButton = ({ onClick, icon }: any) => (
  <button
    onClick={onClick}
    className="hover:text-orange-500 transition-colors p-1"
  >
    {icon}
  </button>
);

const CartButton = ({ count }: { count: number }) => (
  <Link
    to="/cart"
    className="relative hover:text-orange-500 transition-colors p-1"
  >
    <ShoppingBag size={20} />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

const MobileToggle = ({ open, onClick }: any) => {
  const Icon = open ? X : Menu;
  return (
    <Icon
      size={20}
      onClick={onClick}
      className="cursor-pointer hover:text-orange-500 transition-colors xl:hidden"
    />
  );
};

export default Header;
