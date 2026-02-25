import React, { memo, useEffect, useState } from "react";

import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiHeart,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";

/* -------------------- Hook xác định Desktop -------------------- */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

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

    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const tabs: Tab[] = [
      { id: "profile", label: "Profile", icon: FiUser },
      { id: "order", label: "Order", icon: FiPackage },
      { id: "addresses", label: "Addresses", icon: FiMapPin },
      { id: "wishlist", label: "Wishlist", icon: FiHeart },
    ];

    const handleTabClick = (tabId: string) => {
      onTabChange(tabId);
    };

    const handleLogout = () => logout(navigate);

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
      <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl backdrop-blur-md rounded-3xl h-[90vh]">
        <div className="absolute inset-0 opacity-50 bg-[#f8f6f3]" />

        <div className="relative p-6 flex flex-col h-full overflow-y-auto">
          {/* Profile */}
          <div className="pb-6 mb-6 border-b border-gray-100">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-gray-900 rounded-2xl shadow-md bg-gray-100">
                  {getInitials(profile.fullName)}
                </div>
                <div className="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-md -bottom-1 -right-1" />
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                {profile.fullName || "User Name"}
              </h3>
            </div>
          </div>

          {/* Navigation + Logout */}
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = isDesktop && activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`group relative w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ease-out overflow-hidden ${
                      isActive
                        ? "text-white shadow-md shadow-orange-500/30"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gray-900 transition-all duration-300 ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                    />

                    <div className="relative flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 group-hover:bg-orange-100 group-hover:text-orange-500 text-gray-500"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={`transition-transform duration-300 ${
                            isActive ? "scale-110" : "group-hover:scale-105"
                          }`}
                        />
                      </div>
                      <span>{tab.label}</span>
                    </div>

                    <FiChevronRight
                      size={20}
                      className={`relative transition-all duration-300 ${
                        isActive
                          ? "text-white translate-x-1 opacity-100"
                          : "text-gray-400 opacity-60 group-hover:text-orange-500 group-hover:translate-x-1 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="relative flex items-center justify-between w-full px-5 py-3.5 font-semibold text-gray-700 transition-all duration-300 group rounded-xl hover:text-white mt-auto overflow-hidden"
            >
              <div className="absolute inset-0 transition-all duration-300 origin-left scale-x-0 bg-gray-900 group-hover:scale-x-100" />

              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-500 rounded-lg transition-all duration-300 group-hover:bg-white/20 group-hover:text-white">
                  <FiLogOut size={20} className="group-hover:scale-110" />
                </div>
                <span>Logout</span>
              </div>

              <FiChevronRight
                size={20}
                className="relative opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default AccountSidebar;
