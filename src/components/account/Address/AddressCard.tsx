import React from "react";
import { Edit2, Check, Trash2 } from "lucide-react";
import type { Address } from "../../../api/addressApi";

interface AddressCardProps {
  address: Address;
  onEdit: (addr: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => (
  <div
    className={`p-5 border-2 rounded-2xl transition-all ${
      address.isDefault
        ? "border-green-400 shadow-md bg-green-50/50"
        : "border-gray-200 hover:shadow-md"
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-800">
        {address.recipientName}
      </h3>
      {address.isDefault && (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
          <Check size={14} /> Default
        </span>
      )}
    </div>
    <p className="mb-1 text-gray-600">{address.street}</p>
    <p className="mb-4 text-sm text-gray-500">Phone: {address.phone}</p>

    <div className="flex flex-wrap gap-2 justify-end">
      <button
        onClick={() => onEdit(address)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
      >
        <Edit2 size={14} /> Edit
      </button>
      <button
        onClick={() => onSetDefault(address.id!)}
        disabled={address.isDefault}
        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
          address.isDefault
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        <Check size={14} /> Set as Default
      </button>
      <button
        onClick={() => onDelete(address.id!)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </div>
);

export default AddressCard;
