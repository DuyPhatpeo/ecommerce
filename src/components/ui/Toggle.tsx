import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  color?: string; // ví dụ "green" | "orange" | "blue"
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  color = "green",
}) => {
  const activeBg = `bg-${color}-500`;
  const inactiveBg = "bg-gray-300";
  const activeText = `text-${color}-700`;
  const inactiveText = "text-gray-500";

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
          checked ? activeBg : inactiveBg
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      {label && (
        <span
          className={`text-xs font-medium ${
            checked ? activeText : inactiveText
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
