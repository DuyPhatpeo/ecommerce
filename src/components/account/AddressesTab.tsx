import React, { useEffect, useState } from "react";
import { Plus, Edit2, Check, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Address } from "../../api/addressApi";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "../../api/addressApi";

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

// Card component
const AddressCard: React.FC<{
  address: Address;
  onEdit: (addr: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}> = ({ address, onEdit, onDelete, onSetDefault }) => (
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

// Main component
const AddressesTab: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = localStorage.getItem("userId") || "";

  const fetchAddresses = async () => {
    try {
      const res = await getUserAddresses(userId);
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (data: Partial<Address>) => {
    try {
      if (data.id) {
        await updateUserAddress(userId, data.id, data);
        toast.success("Address updated!");
      } else {
        await addUserAddress(userId, data as Address);
        toast.success("Address added!");
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserAddress(userId, id);
      toast.success("Address deleted!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultUserAddress(userId, id);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
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
            onClick={() => {
              setCurrentAddress(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 shadow-sm"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border border-dashed border-orange-200 rounded-2xl">
            You haven’t added any addresses yet.
            <br />
            Start by adding your first one ✨
          </div>
        ) : (
          <div className="space-y-5">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={(a) => {
                  setCurrentAddress(a);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
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
