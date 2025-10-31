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

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(!tab); // chỉ hiện sidebar nếu chưa chọn tab

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true); // Desktop: luôn hiển thị cả hai
      } else {
        setShowSidebar(!tab); // Mobile: chỉ hiện sidebar nếu chưa chọn tab
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tab]);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleTabChange = (tabId: string) => {
    navigate(`/account/${tabId}`);
    if (isMobile) setShowSidebar(false); // Mobile: vào tab -> ẩn sidebar
  };

  const handleBack = () => {
    if (isMobile) {
      navigate("/account"); // Quay lại sidebar
      setShowSidebar(true);
    }
  };

  // ✅ Khi người dùng đang ở /account/:tab mà bấm icon mở sidebar (hoặc vào sidebar bằng back)
  const handleOpenSidebar = () => {
    if (isMobile) {
      navigate("/account"); // luôn trở lại URL /account
      setShowSidebar(true);
    }
  };

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

  return (
    <div className="px-2 py-8 mx-auto max-w-7xl sm:px-6 md:px-16">
      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-full lg:w-1/4">
            <AccountSidebar
              activeTab={tab || ""}
              onTabChange={handleTabChange}
              onLogout={logout}
            />
          </div>
        )}

        {/* Nội dung tab */}
        {!showSidebar && tab && (
          <div className="w-full lg:w-3/4">
            {isMobile && (
              <div className="flex justify-start mb-2">
                <button
                  onClick={handleOpenSidebar}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-orange-500 rounded-full shadow-md hover:bg-orange-600 active:scale-95"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            )}
            {renderTab()}
          </div>
        )}

        {/* Desktop: luôn hiển thị song song */}
        {!isMobile && <div className="w-full lg:w-3/4">{renderTab()}</div>}
      </div>
    </div>
  );
};

export default Account;
