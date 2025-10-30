import React from "react";
import {
  User,
  Package,
  MapPin,
  Settings,
  Heart,
  LogOut,
  Sparkles,
} from "lucide-react";

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
  onLogout?: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  profile,
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="p-6 border border-gray-100 shadow-md rounded-2xl bg-white/60 backdrop-blur-sm">
      {/* 🔹 Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-20 h-20 text-xl font-bold text-white bg-orange-500 rounded-full shadow-lg">
          {getInitials(profile.name)}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-orange-600">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="my-3 border-t border-gray-100"></div>

        {/* 🔹 Logout */}
        <button
          onClick={onLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-colors rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      {/* 🔹 Footer flair */}
      <div className="flex justify-center mt-8 text-sm text-gray-400">
        <Sparkles size={16} className="mr-1 text-orange-400" />
        <span>Stay stylish, {profile.name.split(" ")[0]} ✨</span>
      </div>
    </div>
  );
};

export default AccountSidebar;
