import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

import type { MenuItem } from "../../../stores/headerStore";

interface MobileMenuProps {
  mobileOpen: boolean;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  activeMenu: string | null;
  toggleSubMenu: (label: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  closeMobileMenu: () => void;
}

const MobileMenu = ({
  mobileOpen,
  mobileMenuRef,
  menuItems,
  activeMenu,
  toggleSubMenu,
  navigate,
  closeMobileMenu,
}: MobileMenuProps) => (
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
        {isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
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

export default MobileMenu;
