import { useLocation, useNavigate } from "react-router-dom";
import { Home, Store, LayoutGrid, User } from "lucide-react";
import type { TaskbarItem } from "../../../stores/headerStore";

interface MobileBottomBarProps {
  taskbarItems: TaskbarItem[];
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  categoryMenuOpen: boolean;
  setCategoryMenuOpen: (open: boolean) => void;
}

const MobileBottomBar = ({
  taskbarItems,
  location,
  navigate,
  categoryMenuOpen,
  setCategoryMenuOpen,
}: MobileBottomBarProps) => {
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

export default MobileBottomBar;
