// 📁 components/Header/Logo.tsx
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex-shrink-0">
    <img
      src="/logo.png"
      alt="Logo"
      className="h-10 sm:h-11 lg:h-12 object-contain cursor-pointer transition-transform hover:scale-105"
    />
  </Link>
);

export default Logo;
