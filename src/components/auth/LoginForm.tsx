import { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import useLoginForm from "../../hooks/useLoginForm.ts";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, errors, loading, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-gradient-to-br from-orange-100 via-white to-pink-100">
      <Toaster position="top-center" />

      {/* Left side */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="/auth-bg.jpg"
          alt="Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/40 to-transparent" />

        <div className="relative z-10 text-white p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-lg text-orange-50/90 mb-8 leading-relaxed">
            Log in to continue exploring your personalized experience.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 relative bg-gradient-to-br from-white to-orange-50">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_24px_rgba(255,111,0,0.15)] p-6 border border-orange-100 space-y-4"
          >
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

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />

            <div className="flex justify-between items-center text-sm mb-2">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded text-orange-500" />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              icon={<LogIn size={20} />}
              label={loading ? "Signing in..." : "Sign In"}
              className={`w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
