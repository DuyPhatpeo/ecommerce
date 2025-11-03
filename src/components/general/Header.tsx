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

  // 🎯 Taskbar items (chỉ hiển thị trên mobile)
  const taskbarItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/shop", icon: Store, label: "Shop" },
    { path: "/cart", icon: ShoppingBag, label: "Cart", badge: cartCount },
    {
      path: user ? "/account" : "/login",
      icon: User,
      label: "Account",
      activeCheck: ["/account", "/login"],
    },
  ];

  // 🎯 Mobile menu items
  // CHỈ loại bỏ taskbar items khi màn hình < lg (khi taskbar thực sự hiển thị)
  const taskbarPaths = taskbarItems.map((item) => item.path);
  const mobileMenuItems = menuItems;

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

            {/* Desktop Navigation - Hiển thị tất cả menu items */}
            <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-semibold flex-1 justify-center">
              <div className="flex items-center gap-4 2xl:gap-6 min-w-max">
                {menuItems.map((item, i) => (
                  <NavItem
                    key={i}
                    item={item}
                    activeMenu={activeMenu}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    location={location}
                  />
                ))}
              </div>
            </nav>

            {/* Right Actions */}
            <RightActions
              user={user}
              cartCount={cartCount}
              searchOpen={searchOpen}
              mobileOpen={mobileOpen}
              setSearchOpen={setSearchOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>

          {/* Search Box */}
          <SearchBox
            searchOpen={searchOpen}
            searchBoxRef={searchBoxRef}
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            setSearchOpen={setSearchOpen}
          />

          {/* Mobile Menu - Hiển thị items không có trong taskbar (hoặc tất cả nếu màn hình lg+) */}
          <MobileMenu
            mobileOpen={mobileOpen}
            mobileMenuRef={mobileMenuRef}
            menuItems={mobileMenuItems}
            activeMenu={activeMenu}
            toggleSubMenu={toggleSubMenu}
            navigate={navigate}
            setMobileOpen={setMobileOpen}
          />
        </div>
      </header>

      {/* Mobile Bottom Taskbar */}
      <MobileBottomBar
        taskbarItems={taskbarItems}
        location={location}
        navigate={navigate}
      />
    </>
  );
};

// ========== SUB COMPONENTS ==========

const Logo = () => (
  <Link to="/" className="flex-shrink-0">
    <img
      src="/logo.png"
      alt="Logo"
      className="h-10 sm:h-11 lg:h-12 object-contain cursor-pointer transition-transform hover:scale-105"
    />
  </Link>
);

const DesktopNav = ({
  menuItems,
  activeMenu,
  handleMouseEnter,
  handleMouseLeave,
  location,
}) => null; // Component không còn được sử dụng

const NavItem = ({
  item,
  activeMenu,
  handleMouseEnter,
  handleMouseLeave,
  location,
}) => {
  const isActive = location.pathname === item.path;
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasSubMenu && handleMouseEnter(item.label)}
      onMouseLeave={hasSubMenu ? handleMouseLeave : undefined}
    >
      <SmartLink
        path={item.path}
        className={`px-2 py-1 whitespace-nowrap transition-colors ${
          isActive ? "text-orange-500" : "text-gray-800 hover:text-orange-500"
        }`}
      >
        {item.label}
      </SmartLink>

      <AnimatePresence>
        {hasSubMenu && activeMenu === item.label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-[45px] w-[220px] bg-white shadow-lg border border-gray-100 z-40 rounded-lg overflow-hidden"
          >
            {item.subMenu.map((sub, j) => (
              <SmartLink
                key={j}
                path={sub.path}
                className="block px-5 py-2.5 text-[13px] border-t border-gray-100 first:border-t-0 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
              >
                {sub.label}
              </SmartLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SmartLink = ({ path, className, children }) =>
  path ? (
    <Link to={path} className={className}>
      {children}
    </Link>
  ) : (
    <span className={`${className} text-gray-400 cursor-not-allowed`}>
      {children}
    </span>
  );

const RightActions = ({
  user,
  cartCount,
  searchOpen,
  mobileOpen,
  setSearchOpen,
  setMobileOpen,
}) => (
  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 text-gray-800">
    {!user && (
      <Link
        to="/login"
        className="hidden lg:inline-block px-3 py-1.5 border border-orange-500 rounded text-orange-500 font-semibold text-xs hover:bg-orange-500 hover:text-white transition-colors"
      >
        Login
      </Link>
    )}

    <IconButton
      onClick={() => setSearchOpen(!searchOpen)}
      icon={<Search size={20} />}
    />

    {user && (
      <Link
        to="/account"
        className="hover:text-orange-500 transition-colors lg:block hidden"
      >
        <User size={20} />
      </Link>
    )}

    <CartIcon count={cartCount} className="hidden lg:block" />

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
);

const MobileMenu = ({
  mobileOpen,
  mobileMenuRef,
  menuItems,
  activeMenu,
  toggleSubMenu,
  navigate,
  setMobileOpen,
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
          <div key={i} className="border-b border-gray-100">
            {item.subMenu ? (
              <MobileMenuWithSub
                item={item}
                activeMenu={activeMenu}
                toggleSubMenu={toggleSubMenu}
              />
            ) : (
              <MobileMenuItem
                item={item}
                navigate={navigate}
                setMobileOpen={setMobileOpen}
              />
            )}
          </div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const MobileMenuWithSub = ({ item, activeMenu, toggleSubMenu }) => {
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
            {item.subMenu.map((sub, j) => (
              <SmartLink
                key={j}
                path={sub.path}
                className="block px-8 py-2.5 text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
              >
                {sub.label}
              </SmartLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileMenuItem = ({ item, navigate, setMobileOpen }) => (
  <button
    onClick={() => {
      if (item.path) navigate(item.path);
      setMobileOpen(false);
    }}
    className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500 transition-colors"
  >
    {item.label}
  </button>
);

const MobileBottomBar = ({ taskbarItems, location, navigate }) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
    <div className="flex items-center justify-around h-16">
      {taskbarItems.map((item, i) => {
        const Icon = item.icon;
        const isActive = item.activeCheck
          ? item.activeCheck.includes(location.pathname)
          : location.pathname === item.path;

        return (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex-1 ${
              isActive ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500 transition-colors active:scale-95`}
          >
            <div className="flex flex-col items-center justify-center gap-1 py-2">
              <div className="relative">
                <Icon size={22} />
                {item.badge > 0 && (
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

const IconButton = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="hover:text-orange-500 transition-colors p-1"
  >
    {icon}
  </button>
);

const CartIcon = ({ count, className = "" }) => (
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

const MobileToggle = ({ open, onClick }) => {
  const Icon = open ? X : Menu;
  return (
    <Icon
      size={20}
      onClick={onClick}
      className="xl:hidden cursor-pointer hover:text-orange-500 transition-colors"
    />
  );
};

export default Header;
