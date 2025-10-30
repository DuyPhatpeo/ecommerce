import React, { useState } from "react";
import { Sparkles, Lock, Bell, Check } from "lucide-react";

interface SettingsTabProps {
  onPasswordChange?: (currentPassword: string, newPassword: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onPasswordChange }) => {
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
    <div className="py-10">
      {/* 🔹 Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
          <Sparkles size={18} />
          <span>{capitalize("settings")}</span>
          <Lock size={18} />
        </div>

        <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
          Account Settings
        </h2>
      </div>

      {/* 🔹 Content */}
      <div className="space-y-10">
        {/* 🔸 Change Password */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          <h3 className="flex items-center gap-2 mb-6 text-xl font-semibold text-gray-800 dark:text-gray-100">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />

            <button
              onClick={handlePasswordUpdate}
              className="px-6 py-2 font-medium text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* 🔸 Notifications */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          <h3 className="flex items-center gap-2 mb-6 text-xl font-semibold text-gray-800 dark:text-gray-100">
            <Bell size={18} className="text-pink-500" />
            Notifications
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-500 accent-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Receive email about new orders
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-500 accent-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Receive email about promotions
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-orange-500 accent-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Receive SMS notifications
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
