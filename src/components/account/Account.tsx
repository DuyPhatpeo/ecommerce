import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import AddressesTab from "./AddressesTab";
import WishlistTab from "./WishlistTab";
import SettingsTab from "./SettingsTab";

const Account = () => {
  const navigate = useNavigate();
  const { tab } = useParams(); // 👉 lấy param "tab" từ URL
  const activeTab = tab || "profile";

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

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
      address: "123 Main Street, Downtown, New York, NY 10001",
      phone: "+1 234 567 8900",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      address: "456 Business Ave, Midtown, New York, NY 10017",
      phone: "+1 987 654 3210",
      isDefault: false,
    },
  ];

  // 🔥 Dữ liệu wishlist demo (giả lập từ API hoặc local)
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

  const handleTabChange = (tabId: string) => {
    navigate(`/account/${tabId}`); // 👉 chuyển URL
  };

  return (
    <div className="px-2 py-8 mx-auto max-w-7xl sm:px-6 md:px-16">
      <div className="flex gap-6">
        <div className="w-full h-full lg:w-1/4">
          <AccountSidebar
            profile={profile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={() => console.log("Logout")}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="p-6">
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
        </div>
      </div>
    </div>
  );
};

export default Account;
