import React, { useState } from "react";
import { Plus, Edit2, Check, Trash2, X } from "lucide-react";

export interface Address {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

const sampleAddresses: Address[] = [
  {
    id: "1",
    fullName: "John Doe",
    address: "123 Main Street, NY",
    phone: "+1 234 567 8900",
    isDefault: true,
  },
  {
    id: "2",
    fullName: "Jane Smith",
    address: "456 Business Ave, NY",
    phone: "+1 987 654 3210",
    isDefault: false,
  },
];

// Modal Add/Edit
interface AddressModalProps {
  open: boolean;
  address?: Partial<Address>;
  onClose: () => void;
  onSave: (data: Partial<Address>) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  open,
  address,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Partial<Address>>(address || {});

  if (!open) return null;

  const handleChange = (field: keyof Address, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSaveClick = () => {
    if (!form.fullName && !form.address && !form.phone) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-orange-200 rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h3 className="mb-4 text-xl font-bold text-gray-800 border-b border-orange-100 pb-2">
          {address ? "Edit Address" : "Add New Address"}
        </h3>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={form.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Address"
            value={form.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
const AddressesTab: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (address?: Partial<Address>) => {
    setCurrentAddress(address || null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<Address>) => {
    if (!data.fullName && !data.address && !data.phone) return;

    if (data.id) {
      // Edit
      setAddresses((prev) =>
        prev.map((a) => (a.id === data.id ? ({ ...a, ...data } as Address) : a))
      );
    } else {
      // Add new
      const newAddress: Address = {
        id: Date.now().toString(),
        fullName: data.fullName || "",
        address: data.address || "",
        phone: data.phone || "",
        isDefault: false,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setIsModalOpen(false);
    setCurrentAddress(null);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white border border-orange-100 rounded-3xl shadow-sm p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
            My Addresses
          </h2>
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 shadow-sm"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border border-dashed border-orange-200 rounded-2xl">
            You haven’t added any addresses yet.
            <br />
            Start by adding your first one ✨
          </div>
        ) : (
          <div className="space-y-5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 border-2 rounded-2xl transition-all ${
                  addr.isDefault
                    ? "border-green-400 shadow-md bg-green-50/50"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {addr.fullName}
                  </h3>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                      <Check size={14} /> Default
                    </span>
                  )}
                </div>

                <p className="mb-1 text-gray-600">{addr.address}</p>
                <p className="mb-4 text-sm text-gray-500">
                  Phone: {addr.phone}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 mt-auto justify-end">
                  <button
                    onClick={() => openModal(addr)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <Edit2 size={14} /> Edit
                  </button>

                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={addr.isDefault}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all 
                    ${
                      addr.isDefault
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    <Check size={14} /> Set as Default
                  </button>

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressModal
        open={isModalOpen}
        address={currentAddress || undefined}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AddressesTab;
