import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import type { Address } from "../../../api/addressApi";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-orange-200 rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h3 className="mb-4 text-xl font-bold text-gray-800 border-b border-orange-100 pb-2">
          {address?.id ? "Edit Address" : "Add New Address"}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={form.recipientName || ""}
            onChange={(e) => handleChange("recipientName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Street / Address"
            value={form.street || ""}
            onChange={(e) => handleChange("street", e.target.value)}
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
            onClick={handleSave}
            className="px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
