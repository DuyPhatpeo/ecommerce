import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers } from "../api/authApi";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// 👇 Mở rộng kiểu User để đảm bảo fullName không gây lỗi
interface User {
  id: string;
  email: string;
  password: string;
  fullName?: string;
  name?: string;
  username?: string;
}

export default function useLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true"
  );

  // ✅ Khi component mount: nếu Remember me được bật → tự điền email
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await getUsers();
      const user = (res.data as User[]).find(
        (u) =>
          u.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (!user) {
        toast.error("Email not found.");
        return;
      }

      if (user.password !== formData.password) {
        toast.error("Incorrect password.");
        return;
      }

      // ✅ Xác định tên hiển thị (fullName > name > username > email)
      const displayName =
        user.fullName || user.name || user.username || user.email;

      // ✅ Chỉ lưu id của user
      localStorage.setItem("userId", user.id);

      // ✅ Lưu hoặc xóa email nhớ đăng nhập
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      toast.success(`Welcome back, ${displayName}! 🎉`);
      setTimeout(() => navigate("/"), 1500);

      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error(error);
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
