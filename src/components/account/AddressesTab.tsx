import React, { useState, useEffect } from "react";
import { Plus, MapPin, Edit2, Trash2, User, Phone, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAddresses } from "../../hooks/useAddresses";
import type { Address } from "../../api/addressApi";
import Button from "../ui/Button";
import Toggle from "../ui/Toggle";

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
    className={`relative overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
      address.isDefault
        ? "bg-gradient-to-br from-green-50 via-white to-green-100 border-green-300 shadow-lg shadow-green-100/50"
        : "bg-gradient-to-br from-white to-orange-50 border-gray-200 hover:border-orange-200 hover:shadow-md"
    }`}
  >
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 relative">
        {/* Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-100 to-orange-200 shadow-sm">
            <User className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {address.recipientName}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{address.phone}</p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2 sm:static absolute top-0 right-0">
          <Toggle
            checked={address.isDefault ?? false}
            onChange={() => !address.isDefault && onSetDefault(address.id!)}
            label="Default"
            color="green"
          />
        </div>
      </div>

      {/* Address info */}
      <div className="space-y-2 mt-2 border-t border-gray-100 pt-3 ml-1">
        <div className="flex items-start gap-3 text-gray-700">
          <MapPin size={16} className="mt-1 text-orange-500 flex-shrink-0" />
          <p className="text-sm leading-relaxed">
            {address.line || address.street || ""}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end pt-5 border-t border-gray-100 mt-5">
        <Button
          onClick={() => onEdit(address)}
          icon={<Edit2 size={14} />}
          label="Edit"
          className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
        />
        <Button
          onClick={() => onDelete(address.id!)}
          icon={<Trash2 size={14} />}
          label="Delete"
          className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
        />
      </div>
    </div>
  </div>
);

// ============================================
// AddressModal Component
// ============================================
interface AddressModalProps {
  open: boolean;
  address?: Partial<Address> & { line?: string };
  onClose: () => void;
  onSave: (data: Partial<Address> & { line?: string }) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  open,
  address,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Partial<Address> & { line?: string }>(
    address || {}
  );

  useEffect(() => {
    setForm(address || {});
  }, [address]);

  // ESC + lock scroll
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (field: keyof Address | "line", value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.recipientName || !form.line || !form.phone) {
      return toast.error("Please fill all required fields");
    }
    onSave(form);
  };

  return (
    <>
      <div className="fixed inset-0 z-80 bg-black/60 backdrop-blur-md" />
      <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="relative flex-shrink-0 p-6 bg-gradient-to-r from-orange-500 to-orange-600">
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
              <Button
                onClick={onClose}
                icon={<X size={18} />}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 text-white 
             hover:bg-white/25 hover:scale-105 transition-all duration-300"
                aria-label="Close"
              />
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Full Name */}
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

            {/* Full Address */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <MapPin size={16} className="text-orange-500" />
                Full Address *
              </label>
              <textarea
                placeholder="House No, Ward, District, City, Country"
                value={form.line || ""}
                onChange={(e) => handleChange("line", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Phone */}
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
            <Button
              onClick={handleSave}
              label="Save Address"
              className="flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            />
            <Button
              onClick={onClose}
              label="Cancel"
              className="px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            />
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// AddressesTab Component
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

          <Button
            onClick={() => openModal()}
            icon={<Plus size={18} />}
            label="Add New"
            className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
          />
        </div>

        {/* Address List */}
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
            <Button
              onClick={() => openModal()}
              icon={<Plus size={18} />}
              label="Add Your First Address"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5"
            />
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
