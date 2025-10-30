// components/Header.tsx
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

  return (
    <header className="fixed left-0 top-0 w-full z-50">
      <div
        className={`relative mx-auto transition-all duration-500 ease-in-out ${
          isScrolled
            ? "w-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
            : "w-full lg:w-[75%] xl:w-[65%] lg:mt-6 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] lg:rounded-2xl"
        }`}
      >
        <div className="flex items-center justify-between max-w-[1200px] mx-auto h-[60px] xs:h-[65px] sm:h-[75px] lg:h-[80px] px-3 xs:px-4 sm:px-6 gap-2 xs:gap-4 sm:gap-6 lg:gap-8">
          {/* Logo - Responsive sizing */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 xs:h-9 sm:h-10 md:h-11 lg:h-12 object-contain cursor-pointer transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu - Hidden on tablet and below */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[13px] font-semibold tracking-wide flex-1 justify-center">
            {menuItems.map((item, i) => (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`px-2 py-1 transition-colors whitespace-nowrap ${
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

                {/* Submenu (Desktop) */}
                <AnimatePresence>
                  {item.subMenu && activeMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-[45px] w-[220px] bg-white shadow-lg border border-gray-100 z-40 rounded-lg overflow-hidden"
                    >
                      {item.subMenu.map((sub, j) => (
                        <Link
                          key={j}
                          to={sub.path}
                          className="block px-5 py-2.5 text-[13px] border-t border-gray-100 first:border-t-0 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
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

          {/* Right Icons - Responsive spacing and sizing */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 lg:gap-5 xl:gap-6 text-gray-800">
            {/* Login Button (Desktop - only if not logged in) */}
            {!user && (
              <Link
                to="/login"
                className="hidden lg:inline-block px-3 xl:px-4 py-1.5 xl:py-2 border border-orange-500 rounded text-orange-500 font-semibold text-xs xl:text-sm hover:bg-orange-500 hover:text-white transition-colors whitespace-nowrap"
              >
                Login
              </Link>
            )}

            {/* Search - Responsive icon size */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="group hover:text-orange-500 transition-colors p-1"
              aria-label="Search"
            >
              <Search
                size={18}
                className="xs:w-5 xs:h-5 sm:w-[22px] sm:h-[22px] transition-transform duration-200 group-hover:scale-110"
              />
            </button>

            {/* User Icon (Desktop - click to go to /account) */}
            {user && (
              <Link
                to="/account"
                className="flex hover:text-orange-500 transition-colors p-1"
                aria-label="Account"
              >
                <User
                  size={18}
                  className="xs:w-5 xs:h-5 sm:w-[22px] sm:h-[22px]"
                />
              </Link>
            )}

            {/* Cart - Responsive sizing */}
            <Link
              to="/cart"
              className="relative group hover:text-orange-500 transition-colors p-1"
              aria-label="Shopping cart"
            >
              <ShoppingBag
                size={18}
                className="xs:w-5 xs:h-5 sm:w-[22px] sm:h-[22px] transition-transform duration-200 group-hover:scale-110"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-[9px] xs:text-[10px] w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle - Show on tablet and below */}
            <div className="xl:hidden">
              {mobileOpen ? (
                <X
                  size={18}
                  className="xs:w-5 xs:h-5 sm:w-[22px] sm:h-[22px] cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                />
              ) : (
                <Menu
                  size={18}
                  className="xs:w-5 xs:h-5 sm:w-[22px] sm:h-[22px] cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={() => setMobileOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Search Bar (Animated) - Responsive padding and sizing */}
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
              <div className="flex justify-center bg-orange-50 py-3 sm:py-4 shadow-md rounded-b-lg">
                <div className="relative w-full px-3 xs:px-4 sm:w-4/5 md:w-3/5 lg:w-1/2">
                  <Search className="absolute left-5 xs:left-6 sm:left-7 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="Search products..."
                    autoFocus
                    className="w-full pl-10 xs:pl-11 sm:pl-12 pr-10 xs:pr-11 sm:pr-12 py-2.5 sm:py-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-xs xs:text-sm sm:text-base"
                  />
                  <Button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-5 xs:right-6 sm:right-7 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                    icon={<X size={16} className="sm:w-5 sm:h-5" />}
                    aria-label="Close search"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu (Animated) - Responsive height and padding */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden bg-white border-t border-gray-100 shadow-md max-h-[calc(100vh-60px)] xs:max-h-[calc(100vh-65px)] sm:max-h-[calc(100vh-75px)] lg:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              {menuItems.map((item, i) => (
                <div key={i} className="border-b border-gray-100">
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className="w-full text-left px-4 xs:px-5 py-2.5 xs:py-3 text-[13px] xs:text-[14px] font-semibold text-gray-800 hover:text-orange-500 hover:bg-orange-50 flex justify-between items-center transition-colors"
                      >
                        <span>{item.label}</span>
                        {activeMenu === item.label ? (
                          <ChevronDown
                            size={16}
                            className="xs:w-[18px] xs:h-[18px] text-gray-500"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="xs:w-[18px] xs:h-[18px] text-gray-400"
                          />
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
                            {item.subMenu.map((sub, j) => (
                              <Link
                                key={j}
                                to={sub.path}
                                onClick={() => setMobileOpen(false)}
                                className="block px-6 xs:px-8 py-2 xs:py-2.5 text-[12px] xs:text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
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
                      className="w-full text-left px-4 xs:px-5 py-2.5 xs:py-3 text-[13px] xs:text-[14px] font-semibold text-gray-800 hover:text-orange-500 hover:bg-orange-50 transition-colors"
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

export default Header;
