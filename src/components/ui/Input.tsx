import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const baseInputStyle =
  "border-2 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition";

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  type = "text",
  ...props
}) => {
  const inputClasses = `
    ${baseInputStyle} 
    ${error ? "border-red-500" : "border-gray-300"} 
    ${className}
  `;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input type={type} {...props} className={inputClasses} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
