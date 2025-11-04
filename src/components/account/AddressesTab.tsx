import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddressModal from "./Address/AddressModal";
import AddressCard from "./Address/AddressCard";
import { useAddresses } from "../../hooks/useAddresses";
import type { Address } from "../../api/addressApi";

const AddressesTab: React.FC = () => {
  const { addressesFormatted, handleSave, handleDelete, handleSetDefault } =
    useAddresses();
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (address?: Partial<Address>) => {
    setCurrentAddress(address || null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white border border-orange-100 rounded-3xl shadow-sm p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
            My Addresses
          </h2>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 shadow-sm"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {addressesFormatted.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border border-dashed border-orange-200 rounded-2xl">
            You haven’t added any addresses yet.
            <br />
            Start by adding your first one ✨
          </div>
        ) : (
          <div className="space-y-5">
            {addressesFormatted.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={() => openModal(addr)}
                onDelete={() => handleDelete(addr.id!)}
                onSetDefault={() => handleSetDefault(addr.id!)}
                // Sử dụng line để hiển thị địa chỉ gộp
              />
            ))}
          </div>
        )}
      </div>

      <AddressModal
        open={isModalOpen}
        address={currentAddress || undefined}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          handleSave(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default AddressesTab;
