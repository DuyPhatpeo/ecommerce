import React, { useState, useEffect, memo } from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
}

const AccountSidebar: React.FC<AccountSidebarProps> = memo(
  ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const res = await getUserProfile(userId);
          setUser({
            id: res.id,
            fullName: res.fullName || "",
            email: res.email || "",
            phone: res.phone || "",
          });
        } catch (err) {
          console.error(err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      if (!user) fetchUser();
      else setLoading(false);
    }, [user]);

    const tabs: Tab[] = [
      { id: "profile", label: "Profile", icon: User },
      { id: "order", label: "Order", icon: Package },
      { id: "addresses", label: "Addresses", icon: MapPin },
      { id: "wishlist", label: "Wishlist", icon: Heart },
    ];

    const getInitials = (name: string) =>
      name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");

    if (loading)
      return (
        <div className="sticky top-20">
          <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl p-6 text-center">
            <div className="inline-block w-12 h-12 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your profile...
            </p>
          </div>
        </div>
      );

    if (!user)
      return (
        <div className="sticky top-20">
          <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl p-6 text-center">
            <User className="text-orange-600 w-16 h-16 mx-auto mb-4" />
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              Welcome Back!
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Please login to access your account
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            >
              Login Now
            </button>
          </div>
        </div>
      );

    return (
      <div className="sticky top-6">
        <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />
          <div className="relative p-6">
            {/* User Info */}
            <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-100">
              <div className="relative flex items-center justify-center w-24 h-24 text-2xl font-bold text-white shadow-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl">
                {getInitials(user.fullName)}
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                {user.fullName}
              </h3>
              <p className="text-sm font-medium text-gray-500">{user.email}</p>
            </div>

            {/* Tabs */}
            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`group relative w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "text-white shadow-lg shadow-orange-200"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-orange-600"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600" />
                    )}
                    <div className="relative flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-100 group-hover:bg-orange-100"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`relative transition-all duration-300 ${
                        isActive
                          ? "text-white translate-x-1"
                          : "text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1"
                      }`}
                    />
                  </button>
                );
              })}

              <div className="my-4 border-t border-gray-100" />

              {/* Logout */}
              <button
                onClick={() => logout(navigate)}
                className="relative flex items-center justify-between w-full gap-3 px-5 py-3.5 overflow-hidden font-semibold text-red-600 transition-all duration-300 group rounded-xl hover:text-white"
              >
                <div className="absolute inset-0 transition-all duration-300 scale-x-0 origin-left bg-gradient-to-r from-red-500 to-red-600 group-hover:scale-x-100" />
                <div className="relative flex items-center gap-3">
                  <div className="p-2 transition-all duration-300 bg-red-100 rounded-lg group-hover:bg-white/20">
                    <LogOut size={20} />
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
