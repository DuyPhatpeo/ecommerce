// ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  iconPosition = "left",
  className = "",
  type = "button",
  ...props
}) => {
  const hasIcon = !!icon;
  const hasLabel = !!label;

  return (
    <button
      type={type}
      {...props}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-300 
        ${className}`}
    >
      {hasIcon && iconPosition === "left" && icon}
      {hasLabel && <span>{label}</span>}
      {hasIcon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
