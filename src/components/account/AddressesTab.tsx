import React from "react";
import { Sparkles, MapPin, Plus, Edit2, Check } from "lucide-react";

interface Address {
  id: number;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

interface AddressesTabProps {
  addresses: Address[];
  onAddNew?: () => void;
  onEdit?: (addressId: number) => void;
  onSetDefault?: (addressId: number) => void;
}

const AddressesTab: React.FC<AddressesTabProps> = ({
  addresses,
  onAddNew,
  onEdit,
  onSetDefault,
}) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="py-10">
      {/* 🔹 Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
          <Sparkles size={18} />
          <span>{capitalize("addresses")}</span>
          <MapPin size={18} />
        </div>

        <h2 className="text-4xl sm:text-5xl font-black leading-tight sm:leading-[1.1] tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent pb-1">
          My Addresses
        </h2>
      </div>

      {/* 🔹 Add New Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {/* 🔹 Address List */}
      {addresses.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          You haven’t added any addresses yet.
          <br />
          Start by adding your first one ✨
        </div>
      ) : (
        <div className="space-y-5">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-5 transition-all bg-white border border-gray-200 shadow-sm dark:border-gray-800 rounded-xl hover:shadow-md dark:bg-gray-900"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {address.name}
                </h3>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white rounded-full shadow-sm bg-gradient-to-r from-green-400 to-emerald-500">
                    <Check size={14} />
                    Default
                  </span>
                )}
              </div>

              <p className="mb-1 text-gray-600 dark:text-gray-400">
                {address.address}
              </p>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Phone: {address.phone}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(address.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200"
                >
                  <Edit2 size={14} />
                  Edit
                </button>

                {!address.isDefault && (
                  <button
                    onClick={() => onSetDefault?.(address.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 transition-colors border border-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800"
                  >
                    <Check size={14} />
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
