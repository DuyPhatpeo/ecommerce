import React, { useState, useEffect } from "react";
import {
  Plus,
  MapPin,
  Edit2,
  Check,
  Trash2,
  User,
  Phone,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAddresses } from "../../hooks/useAddresses";
import type { Address } from "../../api/addressApi";

// ============================================
// AddressCard Component
// ============================================
interface AddressCardProps {
  address: Address & { line?: string };
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
    className={`relative overflow-hidden p-5 border rounded-2xl transition-all duration-300 ${
      address.isDefault
        ? "border-green-400 bg-green-50/30 shadow-lg"
        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
    }`}
  >
    {/* Default Badge */}
    {address.isDefault && (
      <div className="absolute top-0 right-0">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 blur opacity-40" />
          <span className="relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-bl-2xl rounded-tr-2xl shadow-lg">
            <Check size={14} /> DEFAULT
          </span>
        </div>
      </div>
    )}

    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
          <User className="text-orange-600" size={18} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          {address.recipientName}
        </h3>
      </div>

      <div className="space-y-2 ml-12">
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin size={16} className="mt-1 text-orange-500 flex-shrink-0" />
          <p className="text-sm">{address.line || address.street || ""}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Phone size={16} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm font-medium">{address.phone}</p>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-100">
      <button
        onClick={() => onEdit(address)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 shadow bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5"
      >
        <Edit2 size={14} /> Edit
      </button>
      <button
        onClick={() => onSetDefault(address.id!)}
        disabled={address.isDefault}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
          address.isDefault
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow hover:shadow-green-200 hover:-translate-y-0.5"
        }`}
      >
        <Check size={14} /> Set Default
      </button>
      <button
        onClick={() => onDelete(address.id!)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 shadow bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 hover:shadow-red-200 hover:-translate-y-0.5"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </div>
);

// ============================================
// AddressModal Component
// ============================================
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

  useEffect(() => {
    setForm(address || {});
  }, [address]);

  if (!open) return null;

  const handleChange = (field: keyof Address, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.recipientName || !form.street || !form.phone) {
      return toast.error("Please fill all required fields");
    }
    onSave(form);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-3xl">
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg">
                  <MapPin className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {address?.id ? "Edit Address" : "Add New Address"}
                  </h3>
                  <p className="text-sm text-orange-100">
                    Fill in the details below
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 bg-white/20 rounded-xl hover:bg-white/30"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <User size={16} className="text-orange-500" />
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter recipient name"
                value={form.recipientName || ""}
                onChange={(e) => handleChange("recipientName", e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <MapPin size={16} className="text-orange-500" />
                Address *
              </label>
              <textarea
                placeholder="Street, Ward, District, City, Country"
                value={form.street || ""}
                onChange={(e) => handleChange("street", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <Phone size={16} className="text-orange-500" />
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={form.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleSave}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            >
              Save Address
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// AddressesTab Component (Main)
// ============================================
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
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
              <p className="text-sm text-gray-600">
                Manage your delivery addresses
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>

        {/* Address List or Empty State */}
        {addressesFormatted.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
              <MapPin className="text-orange-600" size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              No Addresses Yet
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              You haven't added any addresses yet.
              <br />
              Start by adding your first one ✨
            </p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addressesFormatted.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={() => openModal(addr)}
                onDelete={() => handleDelete(addr.id!)}
                onSetDefault={() => handleSetDefault(addr.id!)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
