import React, { useState, useEffect } from "react";
import {
  MapPin,
  Home,
  Plus,
  User,
  Phone,
  StickyNote,
  CreditCard,
  Wallet,
  Banknote,
  X,
  Trash2,
  Edit,
} from "lucide-react";
import Radio from "../ui/Radio";
import { useAddresses } from "../../hooks/useAddresses";

/* =====================
   TYPES
===================== */
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

interface PaymentMethod {
  value: "cod" | "banking" | "momo";
  label: string;
  icon: React.ReactNode;
}

/* =====================
   MAIN COMPONENT
===================== */
export default function CheckoutForm({ onChange }: CheckoutFormProps) {
  const { addressesFormatted, handleSave, handleDelete } = useAddresses();

  const [selectedId, setSelectedId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] =
    useState<CustomerInfo["paymentMethod"]>("cod");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // 🟠 Chọn mặc định address khi load
  useEffect(() => {
    if (!selectedId && addressesFormatted.length > 0) {
      const defaultAddr =
        addressesFormatted.find((a) => a.isDefault) || addressesFormatted[0];
      setSelectedId(defaultAddr?.id ?? "");
    }
  }, [addressesFormatted, selectedId]);

  const selectedAddress = addressesFormatted.find((a) => a.id === selectedId);

  // 🟢 Đồng bộ CustomerInfo lên parent
  useEffect(() => {
    if (!selectedAddress) return;
    onChange({
      recipientName: selectedAddress.recipientName,
      phone: selectedAddress.phone,
      address: selectedAddress.line,
      note,
      paymentMethod,
    });
  }, [selectedAddress?.id, note, paymentMethod, onChange]);

  const paymentMethods: PaymentMethod[] = [
    {
      value: "cod",
      label: "Cash on Delivery",
      icon: <Banknote className="text-green-500" />,
    },
    {
      value: "banking",
      label: "Bank Transfer",
      icon: <CreditCard className="text-blue-500" />,
    },
    {
      value: "momo",
      label: "E-Wallet",
      icon: <Wallet className="text-pink-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <Header icon={<MapPin />} title="Shipping Information" />

      <AddressList
        addresses={addressesFormatted}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDelete={handleDelete}
        onEdit={setEditingAddress}
        onAdd={() => setShowAddForm(true)}
      />

      {selectedAddress && <DeliveryNote note={note} setNote={setNote} />}
      {selectedAddress && (
        <PaymentSection
          paymentMethods={paymentMethods}
          selected={paymentMethod}
          onChange={setPaymentMethod}
        />
      )}

      {showAddForm && (
        <AddAddressModal
          onClose={() => setShowAddForm(false)}
          onSave={async (data) => {
            await handleSave({
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
            await handleSave({ ...data, id: editingAddress.id });
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}

/* =====================
   SUBCOMPONENTS
===================== */

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

const AddressList = ({
  addresses,
  selectedId,
  onSelect,
  onDelete,
  onEdit,
  onAdd,
}: {
  addresses: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (address: any) => void;
  onAdd: () => void;
}) => (
  <div className="p-6 space-y-4">
    {addresses.length ? (
      addresses.map((addr) => (
        <AddressItem
          key={addr.id}
          address={addr}
          selected={selectedId === addr.id}
          onSelect={() => onSelect(addr.id)}
          onDelete={() => onDelete(addr.id)}
          onEdit={() => onEdit(addr)}
        />
      ))
    ) : (
      <p className="text-center text-gray-500 italic py-4">
        No saved addresses yet
      </p>
    )}
    <div className="pt-2 flex justify-end">
      <button
        onClick={onAdd}
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
      >
        <Plus size={16} /> Add New Address
      </button>
    </div>
  </div>
);

const AddressItem = ({
  address,
  selected,
  onSelect,
  onDelete,
  onEdit,
}: {
  address: any;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) => (
  <div className="relative">
    <Radio
      value={address.id}
      checked={selected}
      onChange={onSelect}
      className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
      label={
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-1.5">
            <InfoRow icon={<User />} text={address.recipientName} bold />
            <InfoRow icon={<Phone />} text={address.phone} />
            <InfoRow icon={<Home />} text={address.line} multiline />
          </div>
          {address.isDefault && (
            <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
      }
    />
    <div className="flex justify-end gap-2 mt-2 px-4">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition"
      >
        <Edit size={14} /> Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </div>
);

const DeliveryNote = ({
  note,
  setNote,
}: {
  note: string;
  setNote: (v: string) => void;
}) => (
  <Section
    icon={<StickyNote className="w-5 h-5 text-orange-500" />}
    title="Delivery Note"
    subtitle="(Optional)"
  >
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Add notes for the delivery person..."
      rows={3}
      maxLength={300}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition-all text-gray-700"
    />
    <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
      <p>Helps delivery find you easier</p>
      <p>{note.length}/300</p>
    </div>
  </Section>
);

const PaymentSection = ({
  paymentMethods,
  selected,
  onChange,
}: {
  paymentMethods: PaymentMethod[];
  selected: string;
  onChange: (v: CustomerInfo["paymentMethod"]) => void;
}) => (
  <Section
    icon={<CreditCard className="w-5 h-5 text-orange-500" />}
    title="Payment Method"
  >
    {paymentMethods.map((method) => (
      <Radio
        key={method.value}
        value={method.value}
        checked={selected === method.value}
        onChange={(v) => onChange(v as CustomerInfo["paymentMethod"])}
        label={
          <span className="flex items-center gap-2 font-medium text-gray-800">
            {method.icon} {method.label}
          </span>
        }
        className="mb-2"
      />
    ))}
  </Section>
);

const AddAddressModal = ({
  address,
  onClose,
  onSave,
}: {
  address?: any;
  onClose: () => void;
  onSave: (data: {
    recipientName: string;
    line: string;
    phone: string;
  }) => void;
}) => {
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
};

/* =====================
   COMMON COMPONENTS
===================== */
const Section = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-200 bg-white">
    <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-200 bg-white">
      {icon}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative border border-gray-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <X className="w-5 h-5" />
      </button>
      {children}
    </div>
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
