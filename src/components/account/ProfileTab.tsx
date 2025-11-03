import React, { useState } from "react";
import { Edit2, Save, X, Lock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileTabProps {
  profile: {
    fullName: string;
    email: string;
    phone: string;
  };
  editedProfile: {
    fullName: string;
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

  const [showModal, setShowModal] = useState(false);

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    onPasswordChange?.(passwords.current, passwords.new);
    setPasswords({ current: "", new: "", confirm: "" });
    setShowModal(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="mb-10 text-center border-b border-orange-100 pb-4">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Personal Information
          </h2>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Account Details
            </h3>

            {!isEditing ? (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm bg-orange-500 hover:bg-orange-600 transition-all"
              >
                <Edit2 size={16} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Full Name", type: "text", field: "fullName" },
              { label: "Email", type: "email", field: "email" },
              { label: "Phone Number", type: "tel", field: "phone" },
            ].map(({ label, type, field }) => (
              <div key={field} className="flex flex-col">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  value={
                    isEditing
                      ? editedProfile[field as keyof typeof editedProfile]
                      : profile[field as keyof typeof profile]
                  }
                  onChange={(e) => onChange(field, e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:bg-gray-100 transition-all"
                />
              </div>
            ))}
          </div>

          {/* Change Password Section */}
          <div className="mt-8 border-t border-orange-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Lock size={18} className="text-orange-500" />
                Change Password
              </h3>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm bg-orange-500 hover:bg-orange-600 transition-all"
              >
                <Edit2 size={16} />
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔒 Modal for password change */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Lock className="text-orange-500" />
                  Update Password
                </h3>

                <div className="space-y-4 mt-4">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handlePasswordUpdate}
                    className="flex items-center gap-2 px-5 py-2 text-white rounded-lg shadow-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                  >
                    <CheckCircle size={18} />
                    Confirm
                  </button>

                  <button
                    onClick={() => {
                      setShowModal(false);
                      setPasswords({ current: "", new: "", confirm: "" });
                    }}
                    className="flex items-center gap-2 px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileTab;
