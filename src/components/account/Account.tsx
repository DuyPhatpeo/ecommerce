import React, { useEffect, useState, useMemo } from "react";
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
  const [activeTab, setActiveTab] = useState<string | null>(
    tab || (!isMobile ? "profile" : null)
  );

  // --- Handle window resize ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !activeTab) setActiveTab("profile");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // --- Sync URL param -> activeTab ---
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    } else if (!isMobile && !activeTab) {
      setActiveTab("profile");
    }
  }, [tab, isMobile, activeTab]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    navigate(`/account/${tabId}`);
  };

  const handleBack = () => {
    navigate("/account", { replace: true });
    if (!isMobile) setActiveTab("profile");
    else setActiveTab(null);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            You are not logged in
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to access your account and manage your orders,
            wishlist, and more.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-0.5"
          >
            Log in now
          </button>
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
    <section className="w-full min-h-screen py-8 px-3 sm:px-6 md:px-10 lg:px-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-16">
        <div className={`flex gap-6 ${isMobile ? "flex-col" : "lg:flex-row"}`}>
          {(isMobile ? !activeTab : true) && (
            <div className="w-full lg:w-80 lg:sticky lg:top-24 self-start">
              {sidebar}
            </div>
          )}

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

              <div key={activeTab}>{currentTab}</div>
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
    </section>
  );
};

export default Account;
