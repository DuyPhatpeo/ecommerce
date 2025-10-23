import React from "react";
import { Palette, ChevronDown } from "lucide-react";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

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
      <Button
        onClick={toggle}
        justify="between" // 👈 để label trái, icon phải
        aria-label="Toggle size"
        className="
    w-full flex items-center
    px-3 py-2 rounded-lg
    border border-gray-200
    bg-white hover:bg-orange-50
    text-sm font-medium text-gray-800
    transition-all duration-200
    shadow-sm hover:shadow
  "
        label={
          <span className="flex items-center gap-2 h-5">
            <Palette size={15} className="text-orange-500" /> Color
          </span>
        }
        icon={
          <ChevronDown
            size={16}
            className={`text-gray-600 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } my-auto`}
          />
        }
        iconPosition="right"
      />

      {/* Content */}
      {open && (
        <div className="p-3 space-y-1.5">
          {colors.map((color) => (
            <label
              key={color}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
            >
              <Checkbox
                checked={selected.includes(color)}
                onChange={() => handleChange(color)}
                label={
                  <span className="capitalize group-hover:translate-x-0.5 transition-transform flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border ${colorMap[color]}`}
                    ></span>
                    {color}
                  </span>
                }
                className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-200 cursor-pointer accent-orange-500"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorFilter;
