import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    phone?: string;
  } | null>(null);

  // ✅ Lấy thông tin user từ localStorage an toàn
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      setUser(null);
    }
  }, []);

  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    if (onLogout) onLogout();
    navigate("/");
  };

  // ⛔ Fallback khi chưa có user
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-2xl bg-white/70">
        <p className="mb-3">You are not logged in.</p>
        <button
          onClick={() => navigate("/login")}
          className="text-orange-600 font-semibold hover:underline"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-200 shadow-sm rounded-2xl bg-white/70 backdrop-blur-sm">
      {/* 🔹 Profile Info */}
      <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-200">
        <div className="flex items-center justify-center w-20 h-20 text-xl font-bold text-white rounded-full shadow-md bg-gradient-to-br from-orange-500 to-orange-600">
          {getInitials(user.fullName)}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-gray-800">
          {user.fullName}
        </h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* 🔹 Tabs */}
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
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

        <div className="my-4 border-t border-gray-200" />

        {/* 🔹 Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-colors rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;
