// src/components/auth/RegisterForm.tsx
import { useState } from "react";
import { UserPlus, Mail, User, Phone } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import useRegisterForm from "../../hooks/useRegisterForm";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { formData, errors, loading, handleChange, handleSubmit } =
    useRegisterForm();

  return (
    <div className="w-full max-w-md sm:max-w-2xl space-y-6 sm:space-y-8">
      <Toaster position="top-center" />

      {/* Logo */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <Link to="/" className="inline-flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 sm:w-36 h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_24px_rgba(255,111,0,0.15)] p-6 sm:p-8 border border-orange-100 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
      >
        {/* Full Name - full width */}
        <div className="sm:col-span-2">
          <InputField
            label="Full Name"
            name="fullName"
            icon={<User size={20} />}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.fullName}
          />
        </div>

        {/* Email & Phone - same row */}
        <InputField
          label="Email Address"
          name="email"
          icon={<Mail size={20} />}
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />

        <InputField
          label="Phone Number"
          name="phone"
          icon={<Phone size={20} />}
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+84 123 456 789"
          error={errors.phone}
        />

        {/* Password & Confirm Password */}
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
          onChange={handleChange}
          placeholder="Create a strong password"
          error={errors.password}
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
        />

        {/* Submit full width */}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={loading}
            icon={<UserPlus size={20} />}
            label={loading ? "Creating Account..." : "Create Account"}
            className={`w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </form>
    </div>
  );
}
