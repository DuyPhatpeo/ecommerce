import { create } from "zustand";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../api/authApi";

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
}

interface UserState {
  profile: UserProfile;
  editedProfile: UserProfile;
  isEditing: boolean;

  showModal: boolean;
  showPassword: {
    current: boolean;
    new: boolean;
    confirm: boolean;
  };
  passwords: {
    current: string;
    new: string;
    confirm: string;
  };

  loading: {
    profile: boolean;
    update: boolean;
    password: boolean;
  };

  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  handleChangeProfile: (field: keyof UserProfile, value: string) => void;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: (userId: string) => Promise<void>;
  handlePasswordUpdate: (userId: string) => Promise<void>;

  // Modal & Password states
  setShowModal: (show: boolean) => void;
  setShowPassword: (
    field: keyof UserState["showPassword"],
    value: boolean
  ) => void;
  setPasswords: (field: keyof UserState["passwords"], value: string) => void;
  resetPasswordForm: () => void;
}

const initialProfile: UserProfile = {
  fullName: "",
  email: "",
  phone: "",
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: initialProfile,
  editedProfile: initialProfile,
  isEditing: false,

  showModal: false,
  showPassword: {
    current: false,
    new: false,
    confirm: false,
  },
  passwords: {
    current: "",
    new: "",
    confirm: "",
  },

  loading: {
    profile: false,
    update: false,
    password: false,
  },

  /* ==========================
     FETCH USER PROFILE
  ========================== */
  fetchProfile: async (userId: string) => {
    if (!userId) return;

    set((state) => ({
      loading: { ...state.loading, profile: true },
    }));

    try {
      const res = await getUserProfile(userId);
      const safeData: UserProfile = {
        id: res.id,
        fullName: res.fullName || "",
        email: res.email || "",
        phone: res.phone || "",
      };

      set({
        profile: safeData,
        editedProfile: safeData,
        loading: { ...get().loading, profile: false },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user information.");
      set((state) => ({
        loading: { ...state.loading, profile: false },
      }));
    }
  },

  /* ==========================
     PROFILE HANDLERS
  ========================== */
  handleChangeProfile: (field, value) => {
    set((state) => ({
      editedProfile: { ...state.editedProfile, [field]: value },
    }));
  },

  handleEdit: () => {
    set({ isEditing: true });
  },

  handleCancel: () => {
    const { profile } = get();
    set({
      editedProfile: profile,
      isEditing: false,
    });
  },

  handleSave: async (userId: string) => {
    if (!userId) {
      toast.error("User not found.");
      return;
    }

    const { profile, editedProfile } = get();
    const updates: Partial<UserProfile> = {};

    (Object.keys(editedProfile) as (keyof UserProfile)[]).forEach((key) => {
      if (editedProfile[key] !== profile[key]) {
        updates[key] = editedProfile[key];
      }
    });

    if (!Object.keys(updates).length) {
      toast.info("No changes detected.");
      return;
    }

    set((state) => ({
      loading: { ...state.loading, update: true },
    }));

    try {
      await updateUserProfile(userId, updates);
      const newProfile = { ...profile, ...updates };

      set({
        profile: newProfile,
        editedProfile: newProfile,
        isEditing: false,
        loading: { ...get().loading, update: false },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
      set((state) => ({
        loading: { ...state.loading, update: false },
      }));
    }
  },

  /* ==========================
     PASSWORD HANDLERS
  ========================== */
  handlePasswordUpdate: async (userId: string) => {
    const { passwords } = get();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    if (!userId) {
      toast.error("User not found.");
      return;
    }

    set((state) => ({
      loading: { ...state.loading, password: true },
    }));

    try {
      await changeUserPassword(userId, passwords.current, passwords.new);
      toast.success("Password updated successfully!");

      set({
        passwords: { current: "", new: "", confirm: "" },
        showModal: false,
        loading: { ...get().loading, password: false },
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update password.");
      set((state) => ({
        loading: { ...state.loading, password: false },
      }));
    }
  },

  /* ==========================
     MODAL & PASSWORD STATES
  ========================== */
  setShowModal: (show) => {
    set({ showModal: show });
  },

  setShowPassword: (field, value) => {
    set((state) => ({
      showPassword: { ...state.showPassword, [field]: value },
    }));
  },

  setPasswords: (field, value) => {
    set((state) => ({
      passwords: { ...state.passwords, [field]: value },
    }));
  },

  resetPasswordForm: () => {
    set({
      passwords: { current: "", new: "", confirm: "" },
      showPassword: { current: false, new: false, confirm: false },
    });
  },
}));
