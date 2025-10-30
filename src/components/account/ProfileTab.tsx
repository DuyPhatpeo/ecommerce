import React, { useState } from "react";
import { Edit2, Save, X, Lock, CheckCircle } from "lucide-react";

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

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    onPasswordChange?.(passwords.current, passwords.new);
    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswordForm(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl p-6 mx-auto bg-white rounded-2xl md:border md:border-gray-200 md:shadow-sm">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
            Personal Information
          </h2>
        </div>

        {/* Profile Form */}
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

          {/* Input Fields */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg box-border focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg box-border focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg box-border focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Change Password */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Lock size={18} className="text-orange-500" />
                Change Password
              </h3>

              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
                >
                  <Edit2 size={16} />
                  Change
                </button>
              )}
            </div>

            {/* Password form (toggle) */}
            <div className="transition-all duration-300">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  showPasswordForm
                    ? "max-h-[420px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="space-y-4">
                    {[
                      { placeholder: "Current Password", field: "current" },
                      { placeholder: "New Password", field: "new" },
                      { placeholder: "Confirm New Password", field: "confirm" },
                    ].map(({ placeholder, field }) => (
                      <input
                        key={field}
                        type="password"
                        placeholder={placeholder}
                        value={passwords[field as keyof typeof passwords]}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            [field]: e.target.value,
                          })
                        }
                        className="w-full box-border px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      />
                    ))}

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={handlePasswordUpdate}
                        className="flex items-center gap-2 px-5 py-2 mt-2 text-white rounded-lg shadow-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                      >
                        <CheckCircle size={18} />
                        Confirm
                      </button>

                      <button
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswords({ current: "", new: "", confirm: "" });
                        }}
                        className="flex items-center gap-2 px-5 py-2 mt-2 text-gray-700 rounded-lg bg-gray-200 hover:bg-gray-300"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
