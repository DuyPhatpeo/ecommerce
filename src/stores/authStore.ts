import { create } from "zustand";
import { toast } from "react-toastify";
import { getUsers, registerUser } from "../api/authApi";
import type { User } from "../api/authApi";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
}

interface AuthState {
  // ===== LOGIN =====
  loginForm: LoginFormData;
  loginErrors: Partial<LoginFormData>;
  loginLoading: boolean;
  rememberMe: boolean;

  setLoginForm: (data: Partial<LoginFormData>) => void;
  setLoginErrors: (errors: Partial<LoginFormData>) => void;
  setRememberMe: (val: boolean) => void;
  login: (navigate: any) => Promise<void>;

  // ===== REGISTER =====
  registerForm: RegisterFormData;
  registerErrors: Partial<RegisterFormData>;
  registerLoading: boolean;
  registerSuccess: boolean;

  setRegisterForm: (data: Partial<RegisterFormData>) => void;
  setRegisterErrors: (errors: Partial<RegisterFormData>) => void;
  register: (navigate: any) => Promise<void>;
  resetRegisterForm: () => void;

  // ===== LOGOUT =====
  logout: (navigate: any) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // ===== LOGIN =====
  loginForm: { email: "", password: "" },
  loginErrors: {},
  loginLoading: false,
  rememberMe: false,

  setLoginForm: (data) =>
    set((state) => ({ loginForm: { ...state.loginForm, ...data } })),
  setLoginErrors: (errors) => set({ loginErrors: errors }),
  setRememberMe: (val) => set({ rememberMe: val }),

  login: async (navigate) => {
    const { loginForm, rememberMe, setLoginErrors } = get();
    set({ loginLoading: true });

    // Validate
    const errors: Partial<LoginFormData> = {};
    if (!loginForm.email.trim()) errors.email = "Email is required";
    if (!loginForm.password.trim()) errors.password = "Password is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (loginForm.email && !emailRegex.test(loginForm.email))
      errors.email = "Invalid email format";

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      set({ loginLoading: false });
      return;
    }

    try {
      const users = await getUsers();
      const user = users.find(
        (u) =>
          u.email.trim().toLowerCase() === loginForm.email.trim().toLowerCase()
      );

      if (!user) {
        toast.error("Email does not exist");
        set({ loginLoading: false });
        return;
      }

      if (user.password !== loginForm.password) {
        toast.error("Incorrect password");
        set({ loginLoading: false });
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", loginForm.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      localStorage.setItem("userId", user.id!);
      set({ userId: user.id });
      toast.success(`Welcome back, ${user.fullName || user.email}!`);

      set({ loginForm: { email: "", password: "" } });

      navigate("/");
    } catch {
      toast.error("Login failed");
    } finally {
      set({ loginLoading: false });
    }
  },

  // ===== REGISTER =====
  registerForm: {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  },
  registerErrors: {},
  registerLoading: false,
  registerSuccess: false,

  setRegisterForm: (data) =>
    set((state) => ({ registerForm: { ...state.registerForm, ...data } })),
  setRegisterErrors: (errors) => set({ registerErrors: errors }),
  resetRegisterForm: () =>
    set({
      registerForm: {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
      },
      registerErrors: {},
      registerSuccess: false,
    }),

  register: async (navigate) => {
    const { registerForm, setRegisterErrors, resetRegisterForm } = get();
    set({ registerLoading: true });

    const newErrors: Partial<RegisterFormData> = {};
    const { fullName, email, phone, password, confirmPassword, address } =
      registerForm;

    // Validate
    const rules: [boolean, keyof RegisterFormData, string][] = [
      [!fullName.trim(), "fullName", "Full name is required."],
      [!email.trim(), "email", "Email is required."],
      [!phone.trim(), "phone", "Phone number is required."],
      [!address.trim(), "address", "Address is required."],
      [!password.trim(), "password", "Password is required."],
      [
        !confirmPassword.trim(),
        "confirmPassword",
        "Please confirm your password.",
      ],
      [
        !!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        "email",
        "Invalid email format.",
      ],
      [
        !!phone && !/^(0|\+84)[0-9]{9}$/.test(phone),
        "phone",
        "Invalid phone number.",
      ],
      [
        !!password && password.length < 6,
        "password",
        "Password must be at least 6 characters.",
      ],
      [
        password !== confirmPassword,
        "confirmPassword",
        "Passwords do not match.",
      ],
    ];

    for (const [cond, field, msg] of rules) if (cond) newErrors[field] = msg;

    if (Object.keys(newErrors).length > 0) {
      setRegisterErrors(newErrors);
      set({ registerLoading: false });
      return;
    }

    try {
      const users = await getUsers();
      const existing = users.find(
        (u) => u.email?.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (existing) {
        toast.error("Email already exists.");
        set({ registerLoading: false });
        return;
      }

      const parseAddress = (input: string) => {
        const [street, ward, district, city, country = "Việt Nam"] = input
          .split(",")
          .map((p) => p.trim());
        return { street, ward, district, city, country, postalCode: "" };
      };

      const newUser: User = {
        id: Date.now().toString(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: `addr_${Date.now()}`,
            recipientName: fullName,
            phone,
            ...parseAddress(address),
            isDefault: true,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      await registerUser(newUser);

      toast.success("Account created successfully! Please login.");

      resetRegisterForm();
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      set({ registerLoading: false });
    }
  },

  // ===== LOGOUT =====
  userId: localStorage.getItem("userId"),
  setUserId: (id) => set({ userId: id }),
  logout: (navigate) => {
    localStorage.removeItem("userId");
    set({ userId: null });
    navigate("/login");
    toast.info("Logged out successfully.");
  },
}));
