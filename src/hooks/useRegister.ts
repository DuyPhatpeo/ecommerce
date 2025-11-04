import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers, registerUser } from "../api/authApi";
import type { User } from "../api/authApi";

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
}

export default function useRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ------------------------------------
  // Handle input change
  // ------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ------------------------------------
  // Helper: Parse address string
  // ------------------------------------
  const parseAddress = (input: string) => {
    const parts = input.split(",").map((p) => p.trim());
    return {
      street: parts[0] || "",
      ward: parts[1] || "",
      district: parts[2] || "",
      city: parts[3] || "",
      country: parts[4] || "Vietnam",
      postalCode: "",
    };
  };

  // ------------------------------------
  // Validate form
  // ------------------------------------
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email))
      newErrors.email = "Invalid email format.";

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (phone && !phoneRegex.test(phone))
      newErrors.phone = "Invalid phone number.";

    if (password && password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------------
  // Submit handler
  // ------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await getUsers();
      const users = res.data as User[];

      const existingUser = users.find(
        (u) =>
          u.email?.trim().toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (existingUser) {
        toast.error("Email already exists.");
        return;
      }

      // ✅ Tạo token giả lập
      const token = {
        accessToken: `access_${Math.random().toString(36).slice(2)}`,
        refreshToken: `refresh_${Math.random().toString(36).slice(2)}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 ngày
      };

      // ✅ Nếu có nhập địa chỉ -> tự động tách
      const addresses =
        formData.address && formData.address.trim() !== ""
          ? [
              {
                id: `addr_${Date.now()}`,
                recipientName: formData.fullName,
                phone: formData.phone,
                ...parseAddress(formData.address),
                isDefault: true,
                createdAt: new Date().toISOString(),
              },
            ]
          : [];

      // ✅ Dữ liệu người dùng chuẩn
      const newUser: User = {
        id: `${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        createdAt: new Date().toISOString(),
        token,
        addresses,
      };

      await registerUser(newUser);
      toast.success("Account created successfully! 🎉");

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    success,
    handleChange,
    handleSubmit,
  };
}
