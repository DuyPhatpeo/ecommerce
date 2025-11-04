import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";
import { useLogout } from "../../hooks/useLogout";

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const { logout } = useLogout();

  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // --- Xử lý resize ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Desktop: nếu không có tab → tự động về profile ---
  useEffect(() => {
    if (!isMobile && !tab) navigate("/account/profile", { replace: true });
  }, [isMobile, tab, navigate]);

  // --- Lưu / chỉnh sửa thông tin ---
  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  // --- Chuyển tab ---
  const handleTabChange = (tabId: string) => {
    navigate(`/account/${tabId}`);
  };

  // --- Quay lại sidebar (mobile) ---
  const handleBack = () => navigate("/account");

  // --- Render tab ---
  const renderTab = () => {
    switch (tab) {
      case "profile":
        return (
          <ProfileTab
            profile={profile}
            editedProfile={editedProfile}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
            onChange={(field, value) =>
              setEditedProfile({ ...editedProfile, [field]: value })
            }
          />
        );
      case "orders":
        return <OrdersTab />;
      case "addresses":
        return <AddressesTab />;
      case "wishlist":
        return <WishlistTab />;
      default:
        return null;
    }
  };

  // --- Render layout ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 md:px-16">
        <div className="flex flex-col-reverse gap-1 lg:flex-row">
          {/* ✅ Desktop: luôn hiển thị sidebar */}
          {!isMobile && (
            <>
              <div className="w-full lg:w-1/4">
                <AccountSidebar
                  activeTab={tab || "profile"}
                  onTabChange={handleTabChange}
                  onLogout={logout}
                />
              </div>
              <div className="w-full lg:w-3/4">{renderTab()}</div>
            </>
          )}

          {/* ✅ Mobile: /account → sidebar */}
          {isMobile && !tab && (
            <div className="w-full">
              <AccountSidebar
                activeTab=""
                onTabChange={handleTabChange}
                onLogout={logout}
              />
            </div>
          )}

          {/* ✅ Mobile: /account/:tab → nội dung + nút back */}
          {isMobile && tab && (
            <div className="w-full">
              <div className="flex justify-start mb-3">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-orange-500 rounded-full shadow-md hover:bg-orange-600 active:scale-95"
                >
                  <ArrowLeft size={16} />
                </button>
              </div>
              {renderTab()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
