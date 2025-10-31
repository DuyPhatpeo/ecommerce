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
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
        border ${
          checked
            ? "border-orange-400 bg-orange-50 shadow-sm"
            : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/30"
        }
        ${className || ""}
      `}
    >
      {/* Custom radio */}
      <span
        className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center
          ${
            checked
              ? "border-orange-400 bg-orange-400"
              : "border-gray-300 bg-white"
          }
        `}
      >
        {checked && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
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
