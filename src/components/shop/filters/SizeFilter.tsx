import React from "react";
import { Ruler, ChevronDown } from "lucide-react";
import Button from "../../ui/Button";

interface Props {
  open: boolean;
  toggle: () => void;
  selected: string[];
  onChange: (v: string[]) => void;
}

const sizes = [38, 39, 40, 41, 42, 43, 44, 45];

const SizeFilter: React.FC<Props> = ({ open, toggle, selected, onChange }) => {
  const handleChange = (size: string) => {
    onChange(
      selected.includes(size)
        ? selected.filter((s) => s !== size)
        : [...selected, size]
    );
  };

  return (
    <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
      <Button
        onClick={toggle}
        className="w-full flex justify-between items-center px-3 py-2 font-semibold text-sm text-gray-800 bg-orange-100 hover:bg-orange-200/70 transition"
        aria-label="Toggle size"
        label={
          <span className="flex items-center gap-2">
            <Ruler size={14} className="text-orange-600" /> Size
          </span>
        }
        icon={
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        }
        iconPosition="right"
      />

      {open && (
        <div className="p-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <label
              key={size}
              className={`cursor-pointer px-3 py-1.5 border rounded-md text-sm font-medium transition-all 
                ${
                  selected.includes(size.toString())
                    ? "bg-orange-500 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100"
                }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(size.toString())}
                onChange={() => handleChange(size.toString())}
                className="hidden"
              />
              {size}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeFilter;
