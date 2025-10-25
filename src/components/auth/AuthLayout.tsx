import { ReactNode } from "react";
import { Home } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title = "Welcome Back 👋",
  subtitle = "Sign in to continue your journey.",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-6">
      {/* Header (Logo) */}
      <header className="flex items-center justify-center mb-6 mt-4">
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-lg shadow-sm group-hover:scale-105 transition"
          />
          <span className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition">
            MyShop
          </span>
        </a>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Home size={16} className="text-orange-500" />
          <p>© {new Date().getFullYear()} MyShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
