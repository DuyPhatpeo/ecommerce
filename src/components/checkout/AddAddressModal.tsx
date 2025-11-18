import React, { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import Button from "../ui/Button";

interface AddAddressModalProps {
  address?: any;
  onClose: () => void;
  onSave: (data: {
    recipientName: string;
    line: string;
    phone: string;
  }) => void;
}

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-90"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative border border-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          icon={<X className="w-5 h-5" />}
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 
             rounded-xl text-gray-500 hover:text-gray-800 bg-gray-100/40
             hover:bg-gray-200/60 transition-all duration-300 hover:scale-105"
          aria-label="Close"
        />
        {children}
      </div>
    </div>
  );
};

export default function AddAddressModal({
  address,
  onClose,
  onSave,
}: AddAddressModalProps) {
  const [form, setForm] = useState({
    recipientName: address?.recipientName || "",
    line: address?.line || "",
    phone: address?.phone || "",
  });

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.recipientName.trim() || !form.line.trim() || !form.phone.trim()) {
      return alert("Please fill all required fields");
    }
    onSave(form);
  };

  // Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  return (
    <Modal onClose={onClose}>
      <div className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2 border-b border-orange-100 pb-3">
        <MapPin className="text-orange-500" />{" "}
        {address ? "Edit Address" : "Add New Address"}
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          value={form.recipientName}
          onChange={(e) => handleChange("recipientName", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
        />
        <input
          type="text"
          placeholder="Address (Street, Ward, District, City, Country)"
          value={form.line}
          onChange={(e) => handleChange("line", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-md"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
