import React from "react";
import { Palette, ChevronDown } from "lucide-react";

interface Props {
  open: boolean;
  toggle: () => void;
  selected: string[];
  onChange: (v: string[]) => void;
}

const colorMap: Record<string, string> = {
  Red: "bg-red-500 border-red-600",
  Blue: "bg-blue-500 border-blue-600",
  Green: "bg-green-500 border-green-600",
  Black: "bg-black border-gray-800",
  White: "bg-white border-gray-300",
  Beige: "bg-amber-200 border-amber-300",
  Yellow: "bg-yellow-400 border-yellow-500",
  Orange: "bg-orange-500 border-orange-600",
  Purple: "bg-purple-500 border-purple-600",
  Gray: "bg-gray-400 border-gray-500",
  Pink: "bg-pink-400 border-pink-500",
  Brown: "bg-amber-800 border-amber-900",
};

const colors = Object.keys(colorMap);

const ColorFilter: React.FC<Props> = ({ open, toggle, selected, onChange }) => {
  const handleChange = (color: string) => {
    onChange(
      selected.includes(color)
        ? selected.filter((c) => c !== color)
        : [...selected, color]
    );
  };

  return (
    <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-3 py-2 font-semibold text-sm text-gray-800 bg-orange-100 hover:bg-orange-200/70 transition"
      >
        <span className="flex items-center gap-2">
          <Palette size={14} className="text-orange-600" /> Color
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content */}
      {open && (
        <div className="p-3 space-y-1.5">
          {colors.map((color) => (
            <label
              key={color}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
            >
              <input
                type="checkbox"
                checked={selected.includes(color)}
                onChange={() => handleChange(color)}
                className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-200 cursor-pointer accent-orange-500"
              />
              <span className="capitalize group-hover:translate-x-0.5 transition-transform flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full border ${colorMap[color]}`}
                ></span>
                {color}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorFilter;
