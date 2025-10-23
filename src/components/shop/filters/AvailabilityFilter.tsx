import React from "react";
import { PackageSearch, ChevronDown } from "lucide-react";
import Button from "../../ui/Button";

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
        className="w-full flex justify-between items-center px-3 py-2 font-semibold text-sm text-gray-800 bg-orange-100 hover:bg-orange-200/70 transition"
        aria-label="Toggle availability"
        label={
          <span className="flex items-center gap-2">
            <PackageSearch size={14} className="text-orange-600" /> Availability
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
        <div className="p-3 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={stockFilter === opt.value}
                onChange={() =>
                  setStockFilter(
                    stockFilter === opt.value ? "all" : (opt.value as any)
                  )
                }
                className="form-checkbox text-orange-500 border-orange-300 rounded focus:ring-orange-300"
              />
              <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityFilter;
