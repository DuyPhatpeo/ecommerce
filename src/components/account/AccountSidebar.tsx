import React, { memo } from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = memo(
  ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const { profile } = useUserStore();

    const tabs: Tab[] = [
      { id: "profile", label: "Profile", icon: User },
      { id: "order", label: "Order", icon: Package },
      { id: "addresses", label: "Addresses", icon: MapPin },
      { id: "wishlist", label: "Wishlist", icon: Heart },
    ];

    const handleTabClick = (tabId: string) => {
      if (tabId === activeTab) return;
      onTabChange(tabId);
    };

    const handleLogout = () => {
      logout(navigate);
    };

    // Lấy tên viết tắt từ fullName
    const getInitials = (name: string): string => {
      if (!name) return "U";
      const names = name.trim().split(" ");
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return (
        names[0].charAt(0).toUpperCase() +
        names[names.length - 1].charAt(0).toUpperCase()
      );
    };

    return (
      <div className="sticky top-6">
        <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />
          <div className="relative p-6">
            {/* User Profile Card */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {getInitials(profile.fullName)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate">
                    {profile.fullName || "User Name"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`group relative w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ease-out overflow-hidden ${
                      isActive
                        ? "text-white shadow-lg shadow-orange-200"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-orange-600"
                    }`}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                    />

                    {/* Tab content */}
                    <div className="relative flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-100 group-hover:bg-orange-100"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={`transition-transform duration-300 ${
                            isActive ? "scale-110" : "group-hover:scale-105"
                          }`}
                        />
                      </div>
                      <span className="transition-all duration-300">
                        {tab.label}
                      </span>
                    </div>

                    {/* Chevron icon */}
                    <ChevronRight
                      size={20}
                      className={`relative transition-all duration-300 ease-out ${
                        isActive
                          ? "text-white translate-x-1 opacity-100"
                          : "text-gray-400 opacity-60 group-hover:text-orange-500 group-hover:translate-x-1 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}

              {/* Divider */}
              <div className="my-4 border-t border-gray-100" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="relative flex items-center justify-between w-full gap-3 px-5 py-3.5 overflow-hidden font-semibold text-red-600 transition-all duration-300 group rounded-xl hover:text-white"
              >
                <div className="absolute inset-0 transition-all duration-300 scale-x-0 origin-left bg-gradient-to-r from-red-500 to-red-600 group-hover:scale-x-100" />
                <div className="relative flex items-center gap-3">
                  <div className="p-2 transition-all duration-300 bg-red-100 rounded-lg group-hover:bg-white/20">
                    <LogOut
                      size={20}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span>Logout</span>
                </div>
                <ChevronRight
                  size={20}
                  className="relative transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }
);

export default AccountSidebar;
