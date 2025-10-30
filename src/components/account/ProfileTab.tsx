import React, { useState } from "react";
import { Sparkles, User, Edit2, Save, X, Lock } from "lucide-react";

interface ProfileTabProps {
  profile: {
    name: string;
    email: string;
    phone: string;
  };
  editedProfile: {
    name: string;
    email: string;
    phone: string;
  };
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  onPasswordChange?: (currentPassword: string, newPassword: string) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  editedProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  onPasswordChange,
}) => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    onPasswordChange?.(passwords.current, passwords.new);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl p-6 mx-auto bg-white rounded-2xl md:border md:border-gray-200 md:shadow-sm">
        {/* 🔹 Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
            <Sparkles size={18} />
            <span>{capitalize("profile")}</span>
            <User size={18} />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            Personal Information
          </h2>
        </div>

        {/* 🔹 Profile Form */}
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Account Details
            </h3>

            {!isEditing ? (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
              >
                <Edit2 size={16} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* 🔸 Input Fields */}
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={isEditing ? editedProfile.name : profile.name}
                onChange={(e) => onChange("name", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={isEditing ? editedProfile.email : profile.email}
                onChange={(e) => onChange("email", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={isEditing ? editedProfile.phone : profile.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* 🔸 Change Password Section */}
          <div className="p-6 mt-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <h3 className="flex items-center gap-2 mb-6 text-xl font-semibold text-gray-800">
              <Lock size={18} className="text-orange-500" />
              Change Password
            </h3>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />

              <button
                onClick={handlePasswordUpdate}
                className="px-6 py-2 font-medium text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
