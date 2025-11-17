import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";

const TAB_COMPONENTS: Record<string, () => React.ReactElement> = {
  profile: () => <ProfileTab />,
  order: () => <OrdersTab />,
  addresses: () => <AddressesTab />,
  wishlist: () => <WishlistTab />,
};

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const userId = localStorage.getItem("userId");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize activeTab:
  // Desktop -> default "profile"
  // Mobile -> show tab if URL param exists, otherwise null
  const initialTab = tab || (!isMobile ? "profile" : null);
  const [activeTab, setActiveTab] = useState<string | null>(initialTab);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // If switching from mobile -> desktop and no activeTab, set profile
      if (!mobile && !activeTab) setActiveTab("profile");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // Sync URL param -> activeTab
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else if (!isMobile && !activeTab) {
      setActiveTab("profile"); // Desktop default
    }
  }, [tab, isMobile, activeTab]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    // Start transition
    setIsTransitioning(true);

    // Small delay for smooth fade out
    setTimeout(() => {
      navigate(`/account/${tabId}`);
      setActiveTab(tabId);

      // End transition after content loads
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const handleBack = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      navigate("/account", { replace: true });
      if (!isMobile) setActiveTab("profile");
      else setActiveTab(null);

      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const sidebar = useMemo(
    () => (
      <AccountSidebar
        activeTab={activeTab || "profile"}
        onTabChange={handleTabChange}
      />
    ),
    [activeTab]
  );

  const currentTab = useMemo(() => {
    if (!activeTab) return null;
    const TabComponent = TAB_COMPONENTS[activeTab] || TAB_COMPONENTS["profile"];
    return <TabComponent />;
  }, [activeTab]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 pt-24 pb-24">
        <div className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-10 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-orange-100 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2zm0 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z"
              />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            You are not logged in
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to access your account and manage your orders,
            wishlist, and more.
          </p>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-0.5"
          >
            Log in now
          </button>

          {/* Register Link */}
          <div className="mt-6 text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-orange-600 font-semibold hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="py-10 sm:py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className={`flex gap-6 ${isMobile ? "flex-col" : "lg:flex-row"}`}>
          {/* Sidebar */}
          {(isMobile ? !activeTab : true) && (
            <div className="w-full lg:w-80">
              <div className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl border border-orange-100 overflow-hidden">
                {sidebar}
              </div>
            </div>
          )}

          {/* Tab content */}
          {activeTab && (
            <div className="flex-1 w-full">
              {isMobile && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 mb-4 px-4 py-2.5 font-semibold text-white shadow-md bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl transition-all hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={18} />
                  My Account
                </button>
              )}

              <div
                key={activeTab}
                className={`transition-all duration-300 ${
                  isTransitioning
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {currentTab}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Need help?{" "}
          <button className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
