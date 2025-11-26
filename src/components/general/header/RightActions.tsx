import { Link, useLocation } from "react-router-dom";
import { Search, User, Menu, X, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import MiniCart from "../../shopingcart/MiniCart";

interface RightActionsProps {
  user: { name: string } | null;
  cartCount: number;
  searchOpen: boolean;
  mobileOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

const RightActions = ({
  user,
  cartCount,
  searchOpen,
  mobileOpen,
  setSearchOpen,
  setMobileOpen,
}: RightActionsProps) => {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";

  // Xử lý phím ESC để đóng MiniCart
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cartOpen) {
        setCartOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [cartOpen]);

  // Đóng MiniCart khi chuyển sang trang cart
  useEffect(() => {
    if (isCartPage) {
      setCartOpen(false);
    }
  }, [isCartPage]);

  return (
    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 text-gray-800">
      {/* Search button */}
      <IconButton
        onClick={() => setSearchOpen(!searchOpen)}
        icon={<Search size={20} />}
        ariaLabel="Search"
      />

      {/* Cart - Desktop */}
      <div className="hidden lg:block relative">
        {!isCartPage ? (
          // Nếu KHÔNG ở trang cart: hiện button với MiniCart
          <>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative hover:text-orange-500 transition-colors p-1"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            {cartOpen && <MiniCart onClose={() => setCartOpen(false)} />}
          </>
        ) : (
          // Nếu Ở trang cart: chỉ hiện link
          <Link
            to="/cart"
            className="relative hover:text-orange-500 transition-colors p-1 block"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Cart - Mobile: luôn là link tới /cart */}
      <div className="lg:hidden">
        <Link
          to="/cart"
          className="relative hover:text-orange-500 transition-colors p-1 block"
          aria-label="Shopping cart"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* User */}
      {user ? (
        <Link
          to="/account"
          className="hover:text-orange-500 transition-colors lg:block hidden p-1"
          aria-label="User account"
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

      {/* Mobile menu toggle */}
      <MobileToggle
        open={mobileOpen}
        onClick={() => setMobileOpen(!mobileOpen)}
      />
    </div>
  );
};

const IconButton = ({
  onClick,
  icon,
  ariaLabel,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel?: string;
}) => (
  <button
    onClick={onClick}
    className="hover:text-orange-500 transition-colors p-1"
    aria-label={ariaLabel}
  >
    {icon}
  </button>
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
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <Icon size={20} />
    </button>
  );
};

export default RightActions;
