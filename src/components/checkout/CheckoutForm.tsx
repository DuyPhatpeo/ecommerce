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
} from "lucide-react";
import Radio from "../ui/Radio";
import { useAddresses } from "../../hooks/useAddresses";

interface CustomerInfo {
  recipientName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
}

export default function CheckoutForm({
  onChange,
}: {
  onChange: (info: CustomerInfo) => void;
}) {
  const { addressesFormatted, handleSave, handleDelete, handleSetDefault } =
    useAddresses();

  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddressLine, setNewAddressLine] = useState("");

  useEffect(() => {
    if (!selectedId && addressesFormatted.length) {
      const defaultAddr =
        addressesFormatted.find((a) => a.isDefault) || addressesFormatted[0];
      setSelectedId(defaultAddr.id);
    }
  }, [addressesFormatted, selectedId]);

  const selectedAddress = addressesFormatted.find((a) => a.id === selectedId);
  useEffect(() => {
    if (selectedAddress) {
      onChange({
        recipientName: selectedAddress.recipientName,
        phone: selectedAddress.phone,
        address: selectedAddress.line,
        note,
        paymentMethod,
      });
    }
  }, [selectedAddress, note, paymentMethod, onChange]);

  const paymentMethods = [
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
        onSetDefault={handleSetDefault}
        onAdd={() => setShowAddForm(true)}
      />
      {selectedId && <DeliveryNote note={note} setNote={setNote} />}
      {selectedId && (
        <PaymentSection
          paymentMethods={paymentMethods}
          selected={paymentMethod}
          onChange={setPaymentMethod}
        />
      )}
      {showAddForm && (
        <AddAddressModal
          value={newAddressLine}
          onChange={setNewAddressLine}
          onClose={() => setShowAddForm(false)}
          onSave={async () => {
            if (!newAddressLine.trim()) return alert("Please enter address");
            await handleSave({
              line: newAddressLine,
              isDefault: addressesFormatted.length === 0,
            });
            setNewAddressLine("");
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}

/* -------- Subcomponents -------- */

const Header = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-200 bg-white">
    {React.cloneElement(icon as React.ReactElement, {
      className: "w-6 h-6 text-orange-500",
    })}
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

const AddressList = ({
  addresses,
  selectedId,
  onSelect,
  onDelete,
  onSetDefault,
  onAdd,
}: {
  addresses: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
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
          onSetDefault={() => onSetDefault(addr.id)}
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
  onSetDefault,
}: {
  address: any;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) => (
  <div className="relative group">
    <Radio
      value={address.id}
      checked={selected}
      onChange={onSelect}
      className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
      label={
        <div className="flex justify-between items-start gap-4">
          <div>
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
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
      {!address.isDefault && (
        <button
          onClick={onSetDefault}
          className="text-xs text-blue-500 hover:underline"
        >
          Set Default
        </button>
      )}
      <button
        onClick={onDelete}
        className="text-xs text-red-500 hover:underline"
      >
        Delete
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
  paymentMethods: { value: string; label: string; icon: React.ReactNode }[];
  selected: string;
  onChange: (v: string) => void;
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
        onChange={onChange}
        label={
          <span className="flex items-center gap-2 font-medium text-gray-800">
            {method.icon}
            {method.label}
          </span>
        }
        className="mb-2"
      />
    ))}
  </Section>
);

const AddAddressModal = ({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}) => (
  <Modal onClose={onClose}>
    <div className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
      <MapPin className="text-orange-500" /> Add New Address
    </div>
    <textarea
      placeholder="Full address in one line"
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none resize-none"
    />
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-md"
      >
        Save
      </button>
    </div>
  </Modal>
);

/* Common Components */
const Section = ({ icon, title, subtitle, children }: any) => (
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

const InfoRow = ({ icon, text, bold, multiline }: any) => (
  <p
    className={`text-sm text-gray-700 flex items-start gap-2 ${
      bold ? "font-semibold text-gray-900" : ""
    } ${multiline ? "mt-1" : ""}`}
  >
    {React.cloneElement(icon as React.ReactElement, {
      className: "w-4 h-4 text-orange-500 mt-[1px]",
    })}
    <span>{text}</span>
  </p>
);
