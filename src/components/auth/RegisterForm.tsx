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
    <div className="w-full max-w-md space-y-6 sm:space-y-8">
      <Toaster position="top-center" />

      {/* Logo */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <Link to="/" className="inline-flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 sm:w-32 h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_24px_rgba(255,111,0,0.15)] p-5 sm:p-6 md:p-8 border border-orange-100 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* 2 cột cho input */}
        <InputField
          label="Full Name"
          name="fullName"
          icon={<User size={18} />}
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.fullName}
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          icon={<Phone size={18} />}
          value={formData.phone}
          onChange={handleChange}
          placeholder="+84 123 456 789"
          error={errors.phone}
        />
        <div className="sm:col-span-2">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />
        </div>
        <div className="sm:col-span-2">
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
        </div>
        <div className="sm:col-span-2">
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
        </div>

        {/* Submit Button full width */}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={loading}
            icon={<UserPlus size={18} />}
            label={loading ? "Creating Account..." : "Create Account"}
            className={`w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Divider */}
        <div className="sm:col-span-2 flex items-center gap-3 py-3 sm:py-4">
          <div className="flex-1 border-t border-gray-300" />
          <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
            Or sign in
          </span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Login Link */}
        <p className="sm:col-span-2 text-center text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
}
