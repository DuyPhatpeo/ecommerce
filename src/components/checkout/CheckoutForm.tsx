import React, { useState, useEffect, useMemo } from "react";
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

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
}

interface Address extends Omit<CustomerInfo, "note" | "paymentMethod"> {
  id: string;
  isDefault: boolean;
}

interface Props {
  onChange: (info: CustomerInfo) => void;
}

export default function CheckoutForm({ onChange }: Props) {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("savedAddresses") || "[]");
    } catch {
      return [];
    }
  });

  const [selectedId, setSelectedId] = useState<string>(
    () => addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );

  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    fullName: "",
    phone: "",
    address: "",
    isDefault: false,
  });

  /** 🧠 Ghi localStorage khi thay đổi */
  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(addresses));
  }, [addresses]);

  /** 🔁 Gửi thông tin ra ngoài khi thay đổi */
  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedId),
    [addresses, selectedId]
  );

  useEffect(() => {
    if (selectedAddress) onChange({ ...selectedAddress, note, paymentMethod });
  }, [selectedAddress, note, paymentMethod, onChange]);

  /** ➕ Thêm địa chỉ mới */
  const handleAddAddress = () => {
    const { fullName, phone, address } = newAddress;
    if (!fullName || !phone || !address)
      return alert("Please fill in all required fields!");

    const newItem: Address = {
      id: crypto.randomUUID(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
    setNewAddress({ fullName: "", phone: "", address: "", isDefault: false });
    setShowAddForm(false);
  };

  /** 💳 Các phương thức thanh toán */
  const paymentMethods = [
    {
      value: "cod",
      label: "Cash on Delivery (COD)",
      icon: <Banknote className="text-green-500" />,
    },
    {
      value: "banking",
      label: "Bank Transfer",
      icon: <CreditCard className="text-blue-500" />,
    },
    {
      value: "momo",
      label: "E-Wallet (MoMo, ZaloPay...)",
      icon: <Wallet className="text-pink-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <Header icon={<MapPin />} title="Shipping Information" />

      {/* Address List */}
      <div className="p-6 space-y-4">
        {addresses.length ? (
          addresses.map((addr) => (
            <Radio
              key={addr.id}
              value={addr.id}
              checked={selectedId === addr.id}
              onChange={setSelectedId}
              className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              label={
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <InfoRow icon={<User />} text={addr.fullName} bold />
                    <InfoRow icon={<Phone />} text={addr.phone} />
                    <InfoRow icon={<Home />} text={addr.address} multiline />
                  </div>
                  {addr.isDefault && (
                    <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              }
            />
          ))
        ) : (
          <p className="text-center text-gray-500 italic py-4">
            No saved addresses yet
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600  text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>
      </div>

      {/* Delivery Note */}
      {selectedId && (
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
      )}

      {/* Payment Method */}
      {selectedId && (
        <Section
          icon={<CreditCard className="w-5 h-5 text-orange-500" />}
          title="Payment Method"
        >
          {paymentMethods.map((method) => (
            <Radio
              key={method.value}
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={setPaymentMethod}
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
      )}

      {/* Modal thêm địa chỉ */}
      {showAddForm && (
        <Modal onClose={() => setShowAddForm(false)}>
          <div className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
            <MapPin className="text-orange-500" /> Add New Address
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Full name"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
            />
            <Input
              placeholder="Phone number"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />
            <textarea
              placeholder="Address"
              rows={3}
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-md"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* 🧩 Subcomponents */
const Header = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-200 bg-white">
    {React.cloneElement(icon as React.ReactElement, {
      className: "w-6 h-6 text-orange-500",
    })}
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

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

const Input = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none"
  />
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
