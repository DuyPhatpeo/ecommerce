import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Toaster } from "react-hot-toast";

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPath = location.pathname.includes("register");
  const [isLogin, setIsLogin] = useState(!isRegisterPath);

  // 🧭 Cập nhật form khi thay đổi URL
  useEffect(() => {
    setIsLogin(!isRegisterPath);
  }, [isRegisterPath]);

  // 🔁 Chuyển hướng khi bấm tab
  const handleSwitch = (loginMode) => {
    setIsLogin(loginMode);
    navigate(loginMode ? "/login" : "/register");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Background hiệu ứng */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      <div className="relative w-full max-w-6xl h-full bg-white/80 backdrop-blur-xl rounded-none lg:rounded-3xl shadow-2xl overflow-hidden border border-orange-100 flex flex-col lg:flex-row">
        {/* LEFT FORM */}
        <div className="w-full lg:w-3/5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 h-full">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-xl"
            />
          </div>

          {/* Form container */}
          <div className="flex-1 flex flex-col justify-center mt-4 sm:mt-6 relative transition-all duration-500 ease-in-out">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-orange-50 p-1.5 rounded-2xl border border-orange-100">
              <button
                onClick={() => handleSwitch(true)}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all ${
                  isLogin
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleSwitch(false)}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all ${
                  !isLogin
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Animated forms */}
            <div className="relative flex-1 w-full">
              <div
                className={`absolute inset-0 transition-all duration-500 transform ${
                  isLogin
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 -translate-x-6 z-0"
                }`}
              >
                <LoginForm />
              </div>

              <div
                className={`absolute inset-0 transition-all duration-500 transform ${
                  !isLogin
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 translate-x-6 z-0"
                }`}
              >
                <RegisterForm />
              </div>
            </div>
          </div>

          {/* Footer nhỏ */}
          <div className="text-center text-xs text-gray-500 mt-4">
            © 2025 YourShop. All rights reserved.
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden lg:flex lg:w-2/5 relative text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/auth-bg.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 p-10 xl:p-12 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              {isLogin ? (
                <LogIn size={56} className="text-white" />
              ) : (
                <UserPlus size={56} className="text-white" />
              )}
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold mb-3">
              {isLogin ? "Welcome Back!" : "Create Your Account!"}
            </h2>
            <p className="text-base xl:text-lg text-white/90 leading-relaxed mb-6 xl:mb-8 max-w-sm">
              {isLogin
                ? "Sign in to continue shopping with us."
                : "Join us today to receive exclusive deals and a great shopping experience!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
