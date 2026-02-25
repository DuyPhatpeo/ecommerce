import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiHome,
  FiUser,
  FiPhone,
  FiChevronDown,
} from "react-icons/fi";

import { useAddressStore } from "../../stores/addressStore";
import SelectAddressModal from "./SelectAddressModal";
import AddAddressModal from "./AddAddressModal";
import DeliveryNote from "./DeliveryNote";
import PaymentSection from "./PaymentSection";

export interface CustomerInfo {
  recipientName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "cod" | "banking" | "momo";
}

interface CheckoutFormProps {
  onChange: (info: CustomerInfo) => void;
}

/* =====================
   MAIN COMPONENT
===================== */
export default function CheckoutForm({ onChange }: CheckoutFormProps) {
  const { getAddressesFormatted, handleSave, handleDelete, fetchAddresses } =
    useAddressStore();

  const userId = localStorage.getItem("userId") || "";
  const addressesFormatted = getAddressesFormatted();

  const [selectedId, setSelectedId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] =
    useState<CustomerInfo["paymentMethod"]>("cod");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [showSelectAddressModal, setShowSelectAddressModal] =
    useState<boolean>(false);

  // 🔹 Fetch addresses on mount
  useEffect(() => {
    if (userId) {
      fetchAddresses(userId);
    }
  }, [userId, fetchAddresses]);

  // 🟠 Chọn mặc định address khi load
  useEffect(() => {
    if (!selectedId && addressesFormatted.length > 0) {
      const defaultAddr =
        addressesFormatted.find((a) => a.isDefault) || addressesFormatted[0];
      setSelectedId(defaultAddr?.id ?? "");
    }
  }, [addressesFormatted, selectedId]);

  // 🆕 Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSelectAddressModal(false);
        setShowAddForm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedAddress = addressesFormatted.find((a) => a.id === selectedId);

  // 🟢 Đồng bộ CustomerInfo lên parent
  useEffect(() => {
    if (!selectedAddress) return;
    onChange({
      recipientName: selectedAddress.recipientName,
      phone: selectedAddress.phone,
      address: selectedAddress.line ?? "",
      note,
      paymentMethod,
    });
  }, [selectedAddress?.id, note, paymentMethod, onChange]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <Header icon={<FiMapPin />} title="Shipping Information" />

      {/* Phần hiển thị địa chỉ đã chọn và nút mở modal */}
      <div className="p-6">
        {selectedAddress ? (
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-1.5">
                <InfoRow
                  icon={<FiUser />}
                  text={selectedAddress.recipientName}
                  bold
                />
                <InfoRow icon={<FiPhone />} text={selectedAddress.phone} />
                <InfoRow
                  icon={<FiHome />}
                  text={selectedAddress.line ?? ""}
                  multiline
                />
              </div>
              {selectedAddress.isDefault && (
                <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 italic py-4">
            No address selected
          </p>
        )}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setShowSelectAddressModal(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <FiChevronDown size={16} /> Select Address
          </button>
        </div>
      </div>

      {selectedAddress && <DeliveryNote note={note} setNote={setNote} />}
      {selectedAddress && (
        <PaymentSection selected={paymentMethod} onChange={setPaymentMethod} />
      )}

      {/* Modal chọn địa chỉ */}
      {showSelectAddressModal && (
        <SelectAddressModal
          addresses={addressesFormatted}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setShowSelectAddressModal(false);
          }}
          onDelete={(id) => handleDelete(userId, id)}
          onEdit={setEditingAddress}
          onAdd={() => setShowAddForm(true)}
          onClose={() => setShowSelectAddressModal(false)}
        />
      )}

      {showAddForm && (
        <AddAddressModal
          onClose={() => setShowAddForm(false)}
          onSave={async (data) => {
            await handleSave(userId, {
              ...data,
              isDefault: addressesFormatted.length === 0,
            });
            setShowAddForm(false);
          }}
        />
      )}

      {editingAddress && (
        <AddAddressModal
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onSave={async (data) => {
            await handleSave(userId, { ...data, id: editingAddress.id });
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}

const Header = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-200 bg-white">
    {React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<any>, {
          className: "w-6 h-6 text-orange-500",
        })
      : icon}
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

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
