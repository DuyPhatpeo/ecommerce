import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean; // 🔹 không cho nhập
}

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="block text-sm font-semibold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-3.5 border rounded-xl outline-none transition 
            ${
              error
                ? "border-red-400 bg-red-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:bg-white"
                : "border-gray-200 bg-gray-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:bg-white"
            }
            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
          `}
        />

        {error && (
          <p className="absolute -bottom-5 left-1 text-xs text-red-500 bg-white px-1 rounded">
            {error}
          </p>
        )}
      </div>

      <div className="h-5" />
    </div>
  );
}
