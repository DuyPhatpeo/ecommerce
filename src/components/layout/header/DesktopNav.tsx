import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItem } from "../../../stores/headerStore";

interface DesktopNavProps {
  menuItems: MenuItem[];
  activeMenu: string | null;
  handleMouseEnter: (label: string) => void;
  handleMouseLeave: () => void;
  location: ReturnType<typeof useLocation>;
}

const DesktopNav = ({
  menuItems,
  activeMenu,
  handleMouseEnter,
  handleMouseLeave,
  location,
}: DesktopNavProps) => (
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
          className={`px-2 py-1 whitespace-nowrap transition-colors cursor-pointer ${
            isActive ? "text-orange-500" : "text-gray-800 hover:text-orange-500"
          }`}
        >
          {item.label}
        </Link>
      ) : (
        <span className="px-2 py-1 whitespace-nowrap text-gray-800 hover:text-orange-500 cursor-pointer">
          {item.label}
        </span>
      )}

      {/* Submenu */}
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
                  className="block px-3 py-1 text-[13px] text-gray-700 hover:bg-orange-500 hover:text-white rounded transition-colors cursor-pointer"
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

export default DesktopNav;
