import React from "react";
import { Sparkles, User, Edit2, Save, X } from "lucide-react";

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
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  editedProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="py-10">
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
      <div className="max-w-xl p-6 mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
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
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={isEditing ? editedProfile.name : profile.name}
              onChange={(e) => onChange("name", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={isEditing ? editedProfile.email : profile.email}
              onChange={(e) => onChange("email", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={isEditing ? editedProfile.phone : profile.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
