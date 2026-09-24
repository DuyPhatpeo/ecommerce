import React from "react";
import { FiTag, FiChevronDown } from "react-icons/fi";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

interface Props {
  open: boolean;
  toggle: () => void;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}

const BrandFilter: React.FC<Props> = ({
  open,
  toggle,
  options,
  selected,
  onChange,
}) => {
  const handleChange = (brand: string) => {
    onChange(
      selected.includes(brand)
        ? selected.filter((b) => b !== brand)
        : [...selected, brand]
    );
  };

  return (
    <div className="bg-gray-50/60 rounded-none border border-gray-200 overflow-hidden">
      <Button
        onClick={toggle}
        justify="between"
        aria-label="Toggle size"
        className="
    w-full flex items-center
    px-3 py-2 rounded-none
    border border-gray-200
    bg-white hover:bg-gray-100
    text-sm font-medium text-gray-800
    transition-all duration-200
    shadow-sm hover:shadow
    
  "
        label={
          <span className="flex items-center gap-2 h-5">
            <FiTag size={15} className="text-black" /> Brand
          </span>
        }
        icon={
          <FiChevronDown
            size={16}
            className={`text-gray-600 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } my-auto`}
          />
        }
        iconPosition="right"
      />

      {open && (
        <div className="p-3 space-y-1.5">
          {options.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-black transition-colors group"
            >
              <Checkbox
                checked={selected.includes(brand)}
                onChange={() => handleChange(brand)}
                label={
                  <span className="capitalize group-hover:translate-x-0.5 transition-transform">
                    {brand}
                  </span>
                }
                className="w-4 h-4 rounded-none border-gray-300 text-black focus:ring-black cursor-pointer accent-[#78e000]"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
