import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";
import SettingsTab from "./SettingsTab";

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || "";

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Xử lý routing: Mobile hiện menu, Desktop auto redirect
  useEffect(() => {
    if (!tab) {
      // Đang ở /account (không có tab)
      if (isMobile) {
        // Mobile: hiển thị sidebar để chọn
        setShowSidebar(true);
      } else {
        // Desktop: tự động chuyển sang profile
        navigate("/account/profile", { replace: true });
      }
    } else {
      // Đã có tab (/account/profile, /account/orders, etc.)
      if (isMobile) {
        // Mobile: ẩn sidebar, hiện nội dung
        setShowSidebar(false);
      } else {
        // Desktop: luôn hiện sidebar
        setShowSidebar(true);
      }
    }
  }, [tab, isMobile, navigate]);

  const handleTabChange = (tabId: string) => {
    navigate(`/account/${tabId}`);
  };

  const handleBackToMenu = () => {
    navigate("/account");
  };

  // Demo data
  const orders = [
    {
      id: "ORD-001",
      date: "2025-10-25",
      status: "Shipping",
      total: "$125.00",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2025-10-20",
      status: "Completed",
      total: "$85.00",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2025-10-15",
      status: "Completed",
      total: "$210.00",
      items: 5,
    },
  ];

  const addresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Main Street, Downtown, NY",
      phone: "+1 234 567 8900",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      address: "456 Business Ave, Midtown, NY",
      phone: "+1 987 654 3210",
      isDefault: false,
    },
  ];

  const wishlist = [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      price: 299000,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      name: "Slim Fit Jeans",
      price: 599000,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
    },
    {
      id: "3",
      name: "White Sneakers",
      price: 899000,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    },
  ];

  return (
    <div className="px-2 py-8 mx-auto max-w-7xl sm:px-6 md:px-16">
      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-full h-full lg:w-1/4">
            <AccountSidebar
              profile={profile}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={() => console.log("Logout")}
            />
          </div>
        )}

        {/* Nội dung chính */}
        {(!isMobile || !showSidebar) && tab && (
          <div className="w-full lg:w-3/4">
            {isMobile && (
              <button
                onClick={handleBackToMenu}
                className="flex items-center mb-4 text-sm text-orange-600 hover:underline"
              >
                ← Quay lại tài khoản
              </button>
            )}

            {activeTab === "profile" && (
              <ProfileTab
                profile={profile}
                editedProfile={editedProfile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => {
                  setProfile(editedProfile);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                onChange={(field, value) =>
                  setEditedProfile({ ...editedProfile, [field]: value })
                }
              />
            )}
            {activeTab === "orders" && <OrdersTab orders={orders} />}
            {activeTab === "addresses" && (
              <AddressesTab addresses={addresses} />
            )}
            {activeTab === "wishlist" && (
              <WishlistTab
                items={wishlist.map((item) => ({
                  id: item.id,
                  title: item.name,
                  img: item.image,
                  salePrice: item.price,
                  regularPrice: item.price,
                  stock: 10,
                }))}
              />
            )}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
