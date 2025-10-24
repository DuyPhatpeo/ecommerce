// ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";
  justify?: "start" | "center" | "between" | "end";
}

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  iconPosition = "left",
  className = "",
  type = "button",
  justify = "center",
  ...props
}) => {
  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
  }[justify];

  return (
    <button
      type={type}
      {...props}
      className={`inline-flex items-center gap-2 ${justifyClass} 
    transition-all duration-300 cursor-pointer ${className}`}
    >
      {iconPosition === "left" && icon}
      {label && <span>{label}</span>}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
