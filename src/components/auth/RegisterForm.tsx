import { useState } from "react";
import { User, Phone, Mail, MapPin, UserPlus } from "lucide-react";
import useRegister from "../../hooks/useRegister";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";

export default function RegisterForm() {
  const { formData, errors, loading, handleChange, handleSubmit } =
    useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      {/* Full Name & Phone */}
      <div className="grid grid-cols-2 gap-4 max-[420px]:grid-cols-1">
        <InputField
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          icon={<User size={20} />}
          error={errors.fullName}
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+84 123 456 789"
          icon={<Phone size={20} />}
          error={errors.phone}
        />
      </div>

      {/* Email & Address (full width each) */}
      <div className="grid grid-cols-2 gap-4 max-[420px]:grid-cols-1">
        <div className="col-span-2">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={<Mail size={20} />}
            error={errors.email}
          />
        </div>
        <div className="col-span-2">
          <InputField
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
            icon={<MapPin size={20} />}
            error={errors.address}
          />
          <p className="text-sm text-gray-500 ml-1">
            Format:{" "}
            <span className="italic">
              Street, Ward, District, City, Country
            </span>
          </p>
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-2 gap-4 max-[420px]:grid-cols-1">
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
          error={errors.password}
        />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          error={errors.confirmPassword}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        icon={<UserPlus size={20} />}
        label={loading ? "Creating..." : "Create Account"}
        justify="center"
        className={`w-full py-4 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
        }`}
      />
    </form>
  );
}
