import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserByEmail } from "../api/authApi";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function useLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* ==========================
     Load saved email from localStorage
  ========================== */
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("email");

    if (savedRememberMe && savedEmail) {
      setRememberMe(true);
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  /* ==========================
     Handle input change
  ========================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ==========================
     Validate form
  ========================== */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { email, password } = formData;

    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email))
      newErrors.email = "Invalid email format.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ==========================
     Handle login
  ========================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const email = formData.email.trim().toLowerCase();
      const user = await getUserByEmail(email);

      if (!user) {
        toast.error("Email not found.");
        return;
      }

      if (user.password !== formData.password) {
        toast.error("Incorrect password.");
        return;
      }

      const displayName = user.fullName || user.email || "User";

      // ✅ Save email if “Remember Me” is checked
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      // ✅ Save userId to localStorage (ensure it exists)
      if (!user.id) {
        console.warn("⚠️ User does not have an ID in Firestore!");
        toast.error("User ID not found.");
        return;
      }

      localStorage.setItem("userId", user.id);

      toast.success(`Welcome back, ${displayName}! 🎉`);
      setFormData({ email: "", password: "" });

      // ✅ Navigate after login
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    rememberMe,
    setRememberMe,
    handleChange,
    handleSubmit,
  };
}
