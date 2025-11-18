import React from "react";
import { User, Phone, Home, Edit, Trash2 } from "lucide-react";
import Radio from "../ui/Radio";

interface AddressItemProps {
  address: {
    id: string;
    recipientName: string;
    phone: string;
    line: string;
    isDefault?: boolean;
  };
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const InfoRow = ({
  icon,
  text,
  bold,
  multiline,
}: {
  icon: React.ReactNode;
  text: string;
  bold?: boolean;
  multiline?: boolean;
}) => (
  <div className={`flex items-start gap-2 ${multiline ? "mt-1" : ""}`}>
    <div className="flex-shrink-0 mt-[3px]">
      {React.isValidElement(icon)
        ? React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            {
              className: "w-4 h-4 text-orange-500",
            }
          )
        : icon}
    </div>
    <p
      className={`text-sm leading-relaxed ${
        bold ? "font-semibold text-gray-900" : "text-gray-700"
      }`}
    >
      {text}
    </p>
  </div>
);

export default function AddressItem({
  address,
  selected,
  onSelect,
  onDelete,
  onEdit,
}: AddressItemProps) {
  return (
    <div className="relative">
      <Radio
        value={address.id}
        checked={selected}
        onChange={onSelect}
        className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
        label={
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1.5">
              <InfoRow icon={<User />} text={address.recipientName} bold />
              <InfoRow icon={<Phone />} text={address.phone} />
              <InfoRow icon={<Home />} text={address.line} multiline />
            </div>
            {address.isDefault && (
              <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
        }
      />
      <div className="flex justify-end gap-2 mt-2 px-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition"
        >
          <Edit size={14} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
