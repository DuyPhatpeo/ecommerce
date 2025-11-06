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
  address: string;
}

interface FormErrors extends Partial<Record<keyof RegisterFormData, string>> {}

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

  // ✅ Cập nhật dữ liệu input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Parse chuỗi địa chỉ "số, phường, quận, TP"
  const parseAddress = (input: string) => {
    const [street, ward, district, city, country = "Việt Nam"] = input
      .split(",")
      .map((p) => p.trim());
    return { street, ward, district, city, country, postalCode: "" };
  };

  // ✅ Kiểm tra hợp lệ form
  const validateForm = () => {
    const newErrors: FormErrors = {};
    const { fullName, email, phone, password, confirmPassword, address } =
      formData;

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

    for (const [condition, field, message] of rules)
      if (condition) newErrors[field] = message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Gửi form đăng ký
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🔹 Lấy toàn bộ user từ Firestore
      const users = await getUsers();
      const existing = users.find(
        (u) =>
          u.email?.trim().toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (existing) {
        toast.error("Email already exists.");
        return;
      }

      // 🔹 Tạo user mới
      const newUser: User = {
        id: Date.now().toString(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: `addr_${Date.now()}`,
            recipientName: formData.fullName,
            phone: formData.phone,
            ...parseAddress(formData.address),
            isDefault: true,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      // 🔹 Lưu vào Firestore
      await registerUser(newUser);

      toast.success("Account created successfully! Please login to continue.");

      setSuccess(true);
      resetForm();

      // 👉 Chuyển sang trang đăng nhập
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form sau khi đăng ký
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
    });
    setErrors({});
    setSuccess(false);
  };

  return {
    formData,
    errors,
    loading,
    success,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
