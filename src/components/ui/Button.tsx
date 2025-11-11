// ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";
  justify?: "start" | "center" | "between" | "end";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  iconPosition = "left",
  className = "",
  type = "button",
  justify = "center",
  disabled,
  loading = false,
  ...props
}) => {
  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
  }[justify];

  // ✅ Disable khi đang loading hoặc được truyền disabled
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      type={type}
      disabled={isDisabled}
      {...props}
      className={`inline-flex items-center gap-2 ${justifyClass}
        transition-all duration-300 select-none
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90 cursor-pointer"
        }
        ${className}`}
    >
      {/* Icon Left */}
      {iconPosition === "left" && icon}

      {/* Label / Loading */}
      {loading ? (
        <span className="text-sm font-medium">Đang xử lý...</span>
      ) : (
        label && <span>{label}</span>
      )}

      {/* Icon Right */}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
