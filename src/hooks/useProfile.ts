import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../api/authApi";

/* ==========================
   INTERFACES
========================== */

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
}

/* ==========================
   HOOK
========================== */

export const useProfile = () => {
  const userId = localStorage.getItem("userId") || "";

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  /* ==========================
     LOAD PROFILE
  =========================== */
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(userId); // 🔹 res is a User object
        const safeData: UserProfile = {
          id: res.id,
          fullName: res.fullName || "",
          email: res.email || "",
          phone: res.phone || "",
        };
        setProfile(safeData);
        setEditedProfile(safeData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user information.");
      }
    };

    fetchProfile();
  }, [userId]);

  /* ==========================
     HANDLE EDIT PROFILE
  =========================== */
  const handleChangeProfile = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userId) return toast.error("User not found.");

    const updates: Partial<UserProfile> = {};
    (Object.keys(editedProfile) as (keyof UserProfile)[]).forEach((key) => {
      if (editedProfile[key] !== profile[key]) {
        updates[key] = editedProfile[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      toast("No changes detected.");
      return;
    }

    try {
      await updateUserProfile(userId, updates);
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      setEditedProfile(newProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  /* ==========================
     HANDLE CHANGE PASSWORD
  =========================== */
  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast.error("Please fill in all password fields.");
    }

    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match.");
    }

    if (!userId) return toast.error("User not found.");

    try {
      await changeUserPassword(userId, passwords.current, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update password.");
    }
  };

  return {
    profile,
    editedProfile,
    isEditing,
    showModal,
    showPassword,
    passwords,

    setShowModal,
    setShowPassword,
    setPasswords,

    handleChangeProfile,
    handleEdit,
    handleCancel,
    handleSave,
    handlePasswordUpdate,
  };
};
