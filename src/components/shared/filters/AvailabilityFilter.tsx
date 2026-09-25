import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuPackageSearch } from "react-icons/lu";

import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

interface Props {
  open: boolean;
  toggle: () => void;
  stockFilter: "all" | "in" | "out";
  setStockFilter: (v: "all" | "in" | "out") => void;
}

const AvailabilityFilter: React.FC<Props> = ({
  open,
  toggle,
  stockFilter,
  setStockFilter,
}) => {
  const options = [
    { value: "in", label: "In Stock" },
    { value: "out", label: "Out of Stock" },
  ];

  return (
    <div className="bg-gray-50/60 rounded-none border border-gray-200 overflow-hidden">
      <Button
        onClick={toggle}
        justify="between" // 👈 để label trái, icon phải
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
            <LuPackageSearch size={15} className="text-black" />{" "}
            PackageSearch
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
        <div className="p-3 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={stockFilter === opt.value}
                onChange={() =>
                  setStockFilter(
                     stockFilter === opt.value
                      ? "all"
                      : (opt.value as "in" | "out")
                  )
                }
                label={
                  <span className="text-sm text-gray-700 group-hover:text-black font-medium">
                    {opt.label}
                  </span>
                }
                className="form-checkbox text-black border-gray-300 rounded-none focus:ring-black accent-primary"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityFilter;
