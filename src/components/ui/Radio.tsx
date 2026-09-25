import React from "react";

interface RadioProps {
  label: React.ReactNode;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
}

const Radio = ({ label, value, checked, onChange, className }: RadioProps) => {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-none cursor-pointer transition-all
        border ${
          checked
            ? "border-primary bg-primary/10 shadow-sm"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }
        ${className || ""}
      `}
    >
      {/* Custom radio */}
      <span
        className={`w-5 h-5 flex-shrink-0 rounded-none border-2 flex items-center justify-center
          ${
            checked
              ? "border-primary bg-primary"
              : "border-gray-300 bg-white"
          }
        `}
      >
        {checked && <span className="w-2.5 h-2.5 bg-black rounded-none"></span>}
      </span>

      <span className="flex-1 text-gray-900 font-medium">{label}</span>

      {/* Hidden input for accessibility */}
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="hidden"
      />
    </label>
  );
};

export default Radio;
