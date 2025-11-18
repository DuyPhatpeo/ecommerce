import { Link } from "react-router-dom";
import { Search, User, Menu, X, ShoppingBag } from "lucide-react";

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
}: RightActionsProps) => (
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

export default RightActions;
