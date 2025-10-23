import React from "react";
import { Boxes, ChevronDown } from "lucide-react";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

interface Props {
  open: boolean;
  toggle: () => void;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}

const CategoryFilter: React.FC<Props> = ({
  open,
  toggle,
  options,
  selected,
  onChange,
}) => {
  const handleChange = (cat: string) => {
    onChange(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );
  };

  return (
    <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
      <Button
        onClick={toggle}
        justify="between"
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
            <Boxes size={15} className="text-orange-500" /> Category
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
        <div className="p-3 space-y-1.5 max-h-36 overflow-y-auto">
          {options.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition-colors group"
            >
              <Checkbox
                checked={selected.includes(cat)}
                onChange={() => handleChange(cat)}
                label={
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {cat}
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

export default CategoryFilter;
