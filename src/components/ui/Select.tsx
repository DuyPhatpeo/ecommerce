import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-48 bg-white border-2 border-gray-200
          rounded-xl px-4 py-2 flex items-center justify-between
          shadow-sm font-medium text-gray-700 text-sm
          hover:border-orange-400 transition-all
        "
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180 text-orange-500" : "text-gray-500"
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg
            animate-fadeIn
          "
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm rounded-lg transition-all
                ${
                  value === opt.value
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* CSS animation */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-6px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.18s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Select;
