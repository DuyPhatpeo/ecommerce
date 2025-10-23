import React from "react";
import { PackageSearch, ChevronDown } from "lucide-react";
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
    <div className="bg-orange-50/60 rounded-lg border border-orange-200 overflow-hidden">
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
            <PackageSearch size={15} className="text-orange-500" />{" "}
            PackageSearch
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
                  <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium">
                    {opt.label}
                  </span>
                }
                className="form-checkbox text-orange-500 border-orange-300 rounded focus:ring-orange-300"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityFilter;
