import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";

// Mapping tabId -> component factory để giữ state riêng
const TAB_COMPONENTS: Record<string, () => JSX.Element> = {
  profile: () => <ProfileTab />,
  orders: () => <OrdersTab />,
  addresses: () => <AddressesTab />,
  wishlist: () => <WishlistTab />,
};

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const userId = localStorage.getItem("userId");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLoading, setIsLoading] = useState(false);

  // Nếu chưa login
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800">
            Bạn chưa đăng nhập
          </h2>
          <p className="mt-2 text-gray-500">
            Vui lòng đăng nhập để truy cập tài khoản.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // Responsive: update isMobile khi resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop default tab
  useEffect(() => {
    if (!isMobile && !tab) {
      navigate("/account/profile", { replace: true });
    }
  }, [isMobile, tab, navigate]);

  const handleTabChange = (tabId: string) => {
    if (tabId === tab) return;
    setIsLoading(true);
    navigate(`/account/${tabId}`);
    // Dùng effect để dừng loading khi tab thay đổi
    // setTimeout được thay bằng useEffect trên currentTab
  };

  const handleBack = () => navigate("/account");

  const currentTab = useMemo(() => {
    const TabComponent =
      tab && TAB_COMPONENTS[tab]
        ? TAB_COMPONENTS[tab]
        : TAB_COMPONENTS["profile"];
    return <TabComponent />;
  }, [tab]);

  // Tắt loading khi currentTab thay đổi
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setIsLoading(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [currentTab, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="py-10 sm:py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          {(!isMobile || !tab) && (
            <div className="w-full lg:w-80">
              <div className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl border border-orange-100 overflow-hidden">
                <AccountSidebar
                  activeTab={tab || "profile"}
                  onTabChange={handleTabChange}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 w-full">
            {/* Mobile back header */}
            {isMobile && tab && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-4 px-4 py-2.5 font-semibold text-white shadow-md bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl transition-all hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5"
              >
                <ArrowLeft size={18} />
                My Account
              </button>
            )}

            {/* Tab content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-gray-700">
                    Loading...
                  </p>
                </div>
              </div>
            ) : (
              <div key={tab || "profile"} className="animate-fadeIn">
                {currentTab}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
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
