import { useState } from "react";
import { FiUser, FiPhone, FiMail, FiMapPin, FiUserPlus } from "react-icons/fi";

import { useAuthStore } from "../../stores/authStore";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    registerForm,
    registerErrors,
    registerLoading,
    setRegisterForm,
    register,
  } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm({ [name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        register(navigate);
      }}
      className="space-y-3.5 w-full"
    >
      {/* Full Name & Phone */}
      <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
        <InputField
          label="Full Name"
          name="fullName"
          type="text"
          value={registerForm.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          icon={<FiUser size={20} />}
          error={registerErrors.fullName}
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={registerForm.phone}
          onChange={handleChange}
          placeholder="+84 123 456 789"
          icon={<FiPhone size={20} />}
          error={registerErrors.phone}
        />
      </div>

      {/* Email & Address */}
      <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
        <div className="col-span-2">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={registerForm.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={<FiMail size={20} />}
            error={registerErrors.email}
          />
        </div>
        <div className="col-span-2">
          <InputField
            label="Address"
            name="address"
            type="text"
            value={registerForm.address}
            onChange={handleChange}
            placeholder="Your address"
            icon={<FiMapPin size={20} />}
            error={registerErrors.address}
          />
          <p className="text-xs text-gray-500 ml-1 mt-1">
            Format:{" "}
            <span className="italic">
              Street, Ward, District, City, Country
            </span>
          </p>
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
        <PasswordField
          label="Password"
          name="password"
          value={registerForm.password}
          onChange={handleChange}
          placeholder="Create password"
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
          error={registerErrors.password}
        />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={registerForm.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          error={registerErrors.confirmPassword}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={registerLoading}
        icon={<FiUserPlus size={20} />}
        label={registerLoading ? "Creating..." : "Create Account"}
        justify="center"
        className={`w-full py-3.5 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all ${
          registerLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:-translate-y-0.5"
        }`}
      />
    </form>
  );
}
