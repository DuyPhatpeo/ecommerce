import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  User,
  Home,
  Store,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useHeader } from "../../hooks/useHeader";
import type { MenuItem, TaskbarItem } from "../../hooks/useHeader";

// ==================== MAIN COMPONENT ====================
const Header = () => {
  const {
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    cartCount,
    searchQuery,
    user,
    menuItems,
    categoryMenuOpen,
    searchInputRef,
    searchBoxRef,
    mobileMenuRef,
    categoryMenuRef,
    setSearchOpen,
    setMobileOpen,
    setSearchQuery,
    setCategoryMenuOpen,
    handleSearchSubmit,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu,
    closeMobileMenu,
    taskbarItems,
    location,
    navigate,
  } = useHeader();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <div
          className={`relative mx-auto transition-all duration-500 ${
            isScrolled
              ? "bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] w-full"
              : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:w-[75%] xl:w-[65%] lg:mt-6"
          }`}
        >
          <div className="flex items-center justify-between max-w-[1200px] mx-auto h-[60px] xs:h-[65px] sm:h-[75px] lg:h-[80px] px-4 sm:px-6 gap-4 lg:gap-8">
            <Logo />

            {/* ========== DESKTOP NAV ========== */}
            <DesktopNav
              menuItems={menuItems}
              activeMenu={activeMenu}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              location={location}
            />

            {/* ========== RIGHT ACTIONS ========== */}
            <RightActions
              user={user ? { name: user.name ?? "Guest" } : null}
              cartCount={cartCount}
              searchOpen={searchOpen}
              mobileOpen={mobileOpen}
              setSearchOpen={setSearchOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>

          {/* ========== SEARCH BOX ========== */}
          <SearchBox
            searchOpen={searchOpen}
            searchBoxRef={searchBoxRef}
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            setSearchOpen={setSearchOpen}
          />

          {/* ========== MOBILE MENU ========== */}
          <MobileMenu
            mobileOpen={mobileOpen}
            mobileMenuRef={mobileMenuRef}
            menuItems={menuItems}
            activeMenu={activeMenu}
            toggleSubMenu={toggleSubMenu}
            navigate={navigate}
            closeMobileMenu={closeMobileMenu}
          />
        </div>
      </header>

      {/* ========== MOBILE BOTTOM TASKBAR ========== */}
      <MobileBottomBar
        taskbarItems={taskbarItems}
        location={location}
        navigate={navigate}
        categoryMenuOpen={categoryMenuOpen}
        setCategoryMenuOpen={setCategoryMenuOpen}
      />

      {/* ========== CATEGORY BOTTOM SHEET ========== */}
      <CategoryBottomSheet
        isOpen={categoryMenuOpen}
        onClose={() => setCategoryMenuOpen(false)}
        menuItems={menuItems}
        categoryMenuRef={categoryMenuRef}
        navigate={navigate}
      />
    </>
  );
};

// ==================== DESKTOP COMPONENTS ====================
const DesktopNav = ({
  menuItems,
  activeMenu,
  handleMouseEnter,
  handleMouseLeave,
  location,
}: {
  menuItems: MenuItem[];
  activeMenu: string | null;
  handleMouseEnter: (label: string) => void;
  handleMouseLeave: () => void;
  location: ReturnType<typeof useLocation>;
}) => (
  <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-semibold flex-1 justify-center">
    <div className="flex items-center gap-4 2xl:gap-6 min-w-max">
      {menuItems.map((item, i) => (
        <DesktopNavItem
          key={`${item.label}-${i}`}
          item={item}
          activeMenu={activeMenu}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          location={location}
        />
      ))}
    </div>
  </nav>
);

const DesktopNavItem = ({
  item,
  activeMenu,
  handleMouseEnter,
  handleMouseLeave,
  location,
}: {
  item: MenuItem;
  activeMenu: string | null;
  handleMouseEnter: (label: string) => void;
  handleMouseLeave: () => void;
  location: ReturnType<typeof useLocation>;
}) => {
  const isActive = location.pathname === item.path;
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasSubMenu && handleMouseEnter(item.label)}
      onMouseLeave={hasSubMenu ? handleMouseLeave : undefined}
    >
      {item.path ? (
        <Link
          to={item.path}
          className={`px-2 py-1 whitespace-nowrap transition-colors ${
            isActive ? "text-orange-500" : "text-gray-800 hover:text-orange-500"
          }`}
        >
          {item.label}
        </Link>
      ) : (
        <span className="px-2 py-1 whitespace-nowrap text-gray-800 cursor-default">
          {item.label}
        </span>
      )}

      <AnimatePresence>
        {hasSubMenu && activeMenu === item.label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-[45px] w-[max-content] max-w-[600px] bg-white shadow-lg border border-gray-100 z-40 rounded-lg overflow-hidden p-2"
          >
            <div
              className={`grid gap-1 ${
                item.subMenu!.length > 6
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              } auto-rows-min`}
            >
              {item.subMenu!.map((sub, j) => (
                <Link
                  key={`${sub.label}-${j}`}
                  to={sub.path!}
                  className="block px-3 py-1 text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white rounded transition-colors"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== MOBILE COMPONENTS ====================
const MobileMenu = ({
  mobileOpen,
  mobileMenuRef,
  menuItems,
  activeMenu,
  toggleSubMenu,
  navigate,
  closeMobileMenu,
}: {
  mobileOpen: boolean;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  activeMenu: string | null;
  toggleSubMenu: (label: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  closeMobileMenu: () => void;
}) => (
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
          <div
            key={`${item.label}-${i}`}
            className="border-b border-gray-100 last:border-b-0"
          >
            {item.subMenu ? (
              <MobileMenuWithSub
                item={item}
                activeMenu={activeMenu}
                toggleSubMenu={toggleSubMenu}
                closeMobileMenu={closeMobileMenu}
              />
            ) : (
              <MobileMenuItem
                item={item}
                navigate={navigate}
                closeMobileMenu={closeMobileMenu}
              />
            )}
          </div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const MobileMenuWithSub = ({
  item,
  activeMenu,
  toggleSubMenu,
  closeMobileMenu,
}: {
  item: MenuItem;
  activeMenu: string | null;
  toggleSubMenu: (label: string) => void;
  closeMobileMenu: () => void;
}) => {
  const isOpen = activeMenu === item.label;

  return (
    <>
      <button
        onClick={() => toggleSubMenu(item.label)}
        className="w-full flex justify-between items-center px-5 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500 transition-colors"
      >
        {item.label}
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 overflow-hidden"
          >
            {item.subMenu!.map((sub, j) => (
              <Link
                key={`${sub.label}-${j}`}
                to={sub.path!}
                onClick={closeMobileMenu}
                className="block px-8 py-2.5 text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileMenuItem = ({
  item,
  navigate,
  closeMobileMenu,
}: {
  item: MenuItem;
  navigate: ReturnType<typeof useNavigate>;
  closeMobileMenu: () => void;
}) => (
  <button
    onClick={() => {
      if (item.path) {
        navigate(item.path);
        closeMobileMenu();
      }
    }}
    className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500 transition-colors"
  >
    {item.label}
  </button>
);

const MobileBottomBar = ({
  taskbarItems,
  location,
  navigate,
  categoryMenuOpen,
  setCategoryMenuOpen,
}: {
  taskbarItems: TaskbarItem[];
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  categoryMenuOpen: boolean;
  setCategoryMenuOpen: (open: boolean) => void;
}) => {
  const iconMap = { Home, Store, LayoutGrid, User };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex items-center justify-around h-16">
        {taskbarItems.map((item, i) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = item.activeCheck
            ? item.activeCheck.some((path) => location.pathname === path)
            : location.pathname === item.path;

          const isCategory = item.label === "Category";

          return (
            <button
              key={`${item.label}-${i}`}
              onClick={() => {
                if (isCategory) {
                  setCategoryMenuOpen(!categoryMenuOpen);
                } else {
                  navigate(item.path);
                }
              }}
              className={`flex-1 ${
                isActive || (isCategory && categoryMenuOpen)
                  ? "text-orange-500"
                  : "text-gray-600"
              } hover:text-orange-500 transition-colors active:scale-95`}
            >
              <div className="flex flex-col items-center justify-center gap-1 py-2">
                <div className="relative">
                  <Icon size={22} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==================== SHARED COMPONENTS ====================
const Logo = () => (
  <Link to="/" className="flex-shrink-0">
    <img
      src="/logo.png"
      alt="Logo"
      className="h-10 sm:h-11 lg:h-12 object-contain cursor-pointer transition-transform hover:scale-105"
    />
  </Link>
);

const RightActions = ({
  user,
  cartCount,
  searchOpen,
  mobileOpen,
  setSearchOpen,
  setMobileOpen,
}: {
  user: { name: string } | null;
  cartCount: number;
  searchOpen: boolean;
  mobileOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}) => (
  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 text-gray-800">
    <IconButton
      onClick={() => setSearchOpen(!searchOpen)}
      icon={<Search size={20} />}
    />

    <CartIcon count={cartCount} />

    {user ? (
      <Link
        to="/account"
        className="hover:text-orange-500 transition-colors lg:block hidden"
      >
        <User size={20} />
      </Link>
    ) : (
      <Link
        to="/login"
        className="hidden lg:inline-block px-3 py-1.5 border border-orange-500 rounded text-orange-500 font-semibold text-xs hover:bg-orange-500 hover:text-white transition-colors"
      >
        Login
      </Link>
    )}

    <MobileToggle
      open={mobileOpen}
      onClick={() => setMobileOpen(!mobileOpen)}
    />
  </div>
);

const SearchBox = ({
  searchOpen,
  searchBoxRef,
  searchInputRef,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  setSearchOpen,
}: {
  searchOpen: boolean;
  searchBoxRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setSearchOpen: (open: boolean) => void;
}) => (
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
          <div className="relative px-4 w-full max-w-[500px]">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none"
              size={20}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search products..."
              className="w-full pl-12 pr-10 py-2.5 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const IconButton = ({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="hover:text-orange-500 transition-colors p-1"
  >
    {icon}
  </button>
);

const CartIcon = ({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) => (
  <Link
    to="/cart"
    className={`relative hover:text-orange-500 transition-colors p-1 ${className}`}
  >
    <ShoppingBag size={20} />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

const MobileToggle = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => {
  const Icon = open ? X : Menu;
  return (
    <button
      onClick={onClick}
      className="xl:hidden hover:text-orange-500 transition-colors p-1"
    >
      <Icon size={20} />
    </button>
  );
};

// ==================== CATEGORY BOTTOM SHEET ====================
const CategoryBottomSheet = ({
  isOpen,
  onClose,
  menuItems,
  categoryMenuRef,
  navigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  categoryMenuRef: React.RefObject<HTMLDivElement | null>;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const categoryItem = menuItems.find((item) => item.label === "CATEGORY");

  if (!categoryItem || !categoryItem.subMenu) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={categoryMenuRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[70vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Categories</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Categories Grid */}
            <div className="overflow-y-auto max-h-[calc(70vh-80px)] px-4 py-4 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categoryItem.subMenu.map((category, index) => (
                  <button
                    key={`${category.label}-${index}`}
                    onClick={() => {
                      if (category.path) {
                        navigate(category.path);
                        onClose();
                      }
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl transition-all active:scale-95 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                      <Store size={24} className="text-orange-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 text-center">
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
