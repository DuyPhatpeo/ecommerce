import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiUser, FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import { useState } from "react";
import MiniCart from "../../../features/cart/MiniCart";

interface RightActionsProps {
  user: { name: string } | null;
  cartCount: number;
  searchOpen: boolean;
  mobileOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export default function RightActions({
  user,
  cartCount,
  searchOpen,
  mobileOpen,
  setSearchOpen,
  setMobileOpen,
}: RightActionsProps) {
  const [hoverCart, setHoverCart] = useState(false);
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";

  return (
    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 text-gray-800">
      {/* SEARCH */}
      <IconButton
        onClick={() => setSearchOpen(!searchOpen)}
        icon={<FiSearch size={20} />}
        ariaLabel="Search"
      />

      {/* CART - DESKTOP with Hover MiniCart */}
      <div
        className="relative hidden lg:block"
        onMouseEnter={() => !isCartPage && setHoverCart(true)}
        onMouseLeave={() => setHoverCart(false)}
      >
        <CartIcon cartCount={cartCount} />

        {/* MiniCart Dropdown */}
        {!isCartPage && hoverCart && (
          <div className="absolute right-0 top-full pt-2">
            <MiniCart />
          </div>
        )}
      </div>

      {/* CART - MOBILE (Simple Link) */}
      <div className="lg:hidden">
        <CartIcon cartCount={cartCount} />
      </div>

      {/* USER */}
      {user ? (
        <Link
          to="/account"
          className="hidden lg:block p-1 hover:text-orange-500 transition-colors"
          aria-label="User account"
        >
          <FiUser size={20} />
        </Link>
      ) : (
        <Link
          to="/login"
          className="hidden lg:inline-block px-3 py-1.5 border border-orange-500 rounded text-orange-500 font-semibold text-xs hover:bg-orange-500 hover:text-white transition-colors"
        >
          Login
        </Link>
      )}

      {/* MOBILE MENU TOGGLE */}
      <IconButton
        onClick={() => setMobileOpen(!mobileOpen)}
        icon={mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        ariaLabel={mobileOpen ? "Close menu" : "Open menu"}
        className="xl:hidden"
      />
    </div>
  );
}

// Reusable IconButton Component
const IconButton = ({
  onClick,
  icon,
  ariaLabel,
  className = "",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`hover:text-orange-500 transition-colors p-1 ${className}`}
    aria-label={ariaLabel}
  >
    {icon}
  </button>
);

// Cart Icon with Badge Component
const CartIcon = ({ cartCount }: { cartCount: number }) => (
  <Link
    to="/cart"
    className="relative p-1 block hover:text-orange-500 transition-colors"
    aria-label={`Shopping cart with ${cartCount} items`}
  >
    <FiShoppingBag size={20} />
    {cartCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-md flex items-center justify-center font-medium">
        {cartCount > 99 ? "99+" : cartCount}
      </span>
    )}
  </Link>
);
