import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Home } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPath = location.pathname.includes("register");
  const [isLogin, setIsLogin] = useState(!isRegisterPath);

  useEffect(() => {
    setIsLogin(!isRegisterPath);
  }, [isRegisterPath]);

  const handleSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    navigate(loginMode ? "/login" : "/register");
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white relative">
      {/* NÚT HOME */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 z-30 flex items-center gap-2 px-3 py-1.5
                   bg-white/80 backdrop-blur-lg border border-orange-200 shadow-sm
                   hover:bg-white transition-all rounded-xl text-orange-600 font-semibold"
      >
        <Home size={18} />
        Home
      </button>

      {/* LEFT (FORM) */}
      <div className="flex flex-col justify-center items-center px-8 sm:px-12 lg:px-20">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-28 h-28 object-contain mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Tabs */}
        <div className="flex w-full max-w-md bg-orange-50 p-1.5 rounded-2xl border border-orange-100 mb-8">
          <button
            onClick={() => handleSwitch(true)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all
              ${
                isLogin
                  ? "bg-orange-500 text-white shadow"
                  : "text-orange-600 hover:bg-orange-100"
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleSwitch(false)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all
              ${
                !isLogin
                  ? "bg-orange-500 text-white shadow"
                  : "text-orange-600 hover:bg-orange-100"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <div className="w-full max-w-md transition-all duration-300">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>

        <div className="text-center text-xs text-gray-500 mt-8">
          © 2025 YourShop. All rights reserved.
        </div>
      </div>

      {/* RIGHT (IMAGE) */}
      <div className="relative hidden lg:flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-white text-center px-12">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6">
            {isLogin ? <LogIn size={48} /> : <UserPlus size={48} />}
          </div>

          <h2 className="text-3xl font-bold mb-3">
            {isLogin ? "Welcome Back!" : "Create Your Account!"}
          </h2>
          <p className="text-white/90 max-w-sm mx-auto leading-relaxed">
            {isLogin
              ? "Sign in to continue shopping with us."
              : "Join us today to receive exclusive deals and a great shopping experience!"}
          </p>
        </div>
      </div>
    </div>
  );
}
