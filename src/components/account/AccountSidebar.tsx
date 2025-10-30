import React from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  icon: any;
}

interface AccountSidebarProps {
  profile: {
    name: string;
    email: string;
    phone: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  profile,
  activeTab,
  onTabChange,
}) => {
  const navigate = useNavigate();

  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ];

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // 🔹 Xử lý logout trực tiếp trong component
  const handleLogout = () => {
    // Xóa thông tin user
    localStorage.removeItem("user");
    // Có thể xóa thêm token nếu bạn có
    localStorage.removeItem("token");

    // Redirect về home hoặc login
    navigate("/"); // hoặc "/login"
  };

  return (
    <div className="p-6 border border-gray-200 shadow-sm rounded-2xl bg-white/70 backdrop-blur-sm">
      {/* 🔹 Profile Header */}
      <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-200">
        <div className="flex items-center justify-center w-20 h-20 text-xl font-bold text-white rounded-full shadow-md bg-gradient-to-br from-orange-500 to-orange-600">
          {getInitials(profile.name)}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-gray-800">
          {profile.name}
        </h3>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>

      {/* 🔹 Navigation Tabs */}
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span>{tab.label}</span>
              </div>
              <ChevronRight
                size={18}
                className={`${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-orange-500"
                } transition-colors duration-200`}
              />
            </button>
          );
        })}

        {/* 🔹 Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* 🔹 Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-colors rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
          {isMobile && <ChevronRight size={18} className="text-gray-400" />}
        </button>
      </nav>

      {/* 🔹 Footer */}
      <div className="flex justify-center mt-8 text-sm text-gray-400">
        <Sparkles size={16} className="mr-1 text-orange-400" />
        <span>Stay stylish, {profile.name.split(" ")[0]} ✨</span>
      </div>
    </div>
  );
};

export default AccountSidebar;
