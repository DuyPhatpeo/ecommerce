import React from "react";
import { Ruler, ChevronDown } from "lucide-react";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

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
    <div className="overflow-hidden border border-orange-200 rounded-lg bg-orange-50/60">
      <Button
        onClick={toggle}
        justify="between"
        aria-label="Toggle size"
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-800 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-orange-50 hover:shadow"
        label={
          <span className="flex items-center h-5 gap-2">
            <Ruler size={15} className="text-orange-500" /> Size
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

      {open && (
        <div className="flex flex-wrap gap-2 p-3">
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
              <Checkbox
                checked={selected.includes(size.toString())}
                onChange={() => handleChange(size.toString())}
                label={size}
                className="hidden"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeFilter;
