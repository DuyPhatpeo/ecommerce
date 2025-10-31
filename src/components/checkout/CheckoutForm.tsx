import { useState, useEffect } from "react";
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
} from "lucide-react";
import Radio from "../ui/Radio";

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface Props {
  onChange: (info: CustomerInfo) => void;
}

export default function CheckoutForm({ onChange }: Props) {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem("savedAddresses");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (selected) onChange({ ...selected, note, paymentMethod });
  }, [selectedId, note, paymentMethod, addresses, onChange]);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            Shipping Information
          </h2>
          <p className="text-orange-100 mt-1 text-sm">
            {addresses.length} saved addresses
          </p>
        </div>
        <button className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Address List */}
      <div className="p-8 space-y-4">
        {addresses.map((addr) => (
          <Radio
            key={addr.id}
            value={addr.id}
            checked={selectedId === addr.id}
            onChange={(val) => setSelectedId(val)}
            label={
              <div className="flex flex-col gap-1">
                <p className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-orange-500" /> {addr.fullName}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs text-white bg-orange-500 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" /> {addr.phone}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-start gap-2 leading-relaxed">
                  <Home className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{addr.address}</span>
                </p>
              </div>
            }
            className="flex justify-between items-start p-6 rounded-2xl transition-all"
          />
        ))}
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
            placeholder="Add notes for the delivery person"
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none resize-none bg-white shadow-sm transition-all text-gray-700"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <p>Helps the delivery find you easier</p>
            <p>{note.length}/500</p>
          </div>
        </Section>
      )}

      {/* Payment Method */}
      {selectedId && (
        <Section
          icon={<CreditCard className="w-5 h-5 text-orange-500" />}
          title="Payment Method"
        >
          {[
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
          ].map((method) => (
            <Radio
              key={method.value}
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={(val) => setPaymentMethod(val)}
              label={
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  {method.icon}
                  {method.label}
                </span>
              }
              className="mb-3"
            />
          ))}
        </Section>
      )}
    </div>
  );
}

// =============================
// 🔹 Sub Component Section
// =============================
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
  <div className="border-t border-orange-100 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
    <div className="px-8 py-4 flex items-center gap-3 border-b border-orange-100">
      {icon}
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
    </div>
    <div className="p-8">{children}</div>
  </div>
);
