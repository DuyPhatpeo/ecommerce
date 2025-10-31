import { useState, useEffect } from "react";
import {
  MapPin,
  Home,
  Plus,
  User,
  Phone,
  Edit3,
  StickyNote,
  X,
  Trash2,
  CreditCard,
  Wallet,
  Banknote,
  Star,
} from "lucide-react";

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
  // =============================
  // 🔸 STATE
  // =============================
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem("savedAddresses");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    phone: "",
    address: "",
  });

  // =============================
  // 🔸 EFFECTS
  // =============================
  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (selected) {
      onChange({
        ...selected,
        note,
        paymentMethod,
      });
    }
  }, [selectedId, note, paymentMethod, addresses, onChange]);

  // =============================
  // 🔸 HANDLERS
  // =============================

  const handleSaveAddress = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in all required fields!");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Invalid phone number format!");
      return;
    }

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id ? { ...a, ...formData } : a
        )
      );
    } else {
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
        isDefault: addresses.length === 0, // first address = default
      };
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedId(newAddress.id);
    }

    closeModal();
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length === 1) {
      alert("You cannot delete your only address!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this address?")) {
      const remaining = addresses.filter((a) => a.id !== id);
      setAddresses(remaining);

      if (selectedId === id) {
        const next = remaining.find((a) => a.isDefault) || remaining[0];
        setSelectedId(next.id);
      }
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    setSelectedId(id);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({ id: "", fullName: "", phone: "", address: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData(addr);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData({ id: "", fullName: "", phone: "", address: "" });
  };

  // =============================
  // 🔸 RENDER UI
  // =============================

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
        <button
          onClick={openAddModal}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Address List */}
      <div className="p-8 space-y-4">
        {addresses.map((addr) => (
          <label
            key={addr.id}
            className={`flex justify-between items-start p-6 border-2 rounded-2xl cursor-pointer transition-all ${
              selectedId === addr.id
                ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md"
                : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start gap-4 flex-1">
              <input
                type="radio"
                name="selectedAddress"
                value={addr.id}
                checked={selectedId === addr.id}
                onChange={() => setSelectedId(addr.id)}
                className="mt-1.5 w-5 h-5 text-orange-500 accent-orange-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0 space-y-2">
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
                <p className="text-sm text-gray-600 mt-2 flex items-start gap-2 leading-relaxed">
                  <Home className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{addr.address}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-3">
              {!addr.isDefault && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSetDefault(addr.id);
                  }}
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all"
                >
                  <Star size={16} /> Set Default
                </button>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openEditModal(addr);
                  }}
                  className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteAddress(addr.id);
                  }}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </label>
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
            placeholder="Add notes for the delivery person (e.g. call before arrival, gate code...)"
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
            <label
              key={method.value}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all mb-3 ${
                paymentMethod === method.value
                  ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-orange-500 accent-orange-500 cursor-pointer"
              />
              <span className="ml-4 flex items-center gap-2 font-semibold text-gray-900">
                {method.icon}
                {method.label}
              </span>
            </label>
          ))}
        </Section>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <Modal
          title={editingAddress ? "Edit Address" : "Add New Address"}
          onClose={closeModal}
        >
          <div className="space-y-6">
            <InputField
              icon={<User className="w-4 h-4 text-orange-500" />}
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, fullName: e.target.value }))
              }
              placeholder="Enter your full name"
            />
            <InputField
              icon={<Phone className="w-4 h-4 text-orange-500" />}
              label="Phone Number"
              required
              type="tel"
              value={formData.phone}
              maxLength={11}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  phone: e.target.value.replace(/[^0-9]/g, ""),
                }))
              }
              placeholder="Enter 10-11 digits"
            />
            <TextAreaField
              icon={<Home className="w-4 h-4 text-orange-500" />}
              label="Full Address"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="House number, street, ward, district, city"
            />

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                {editingAddress ? "Save Changes" : "Add Address"}
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// =============================
// 🔹 Sub Components
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

const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex justify-between items-center rounded-t-3xl">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <MapPin className="w-6 h-6" /> {title}
        </h3>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-8">{children}</div>
    </div>
  </div>
);

const InputField = ({ icon, label, required, ...props }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition-all"
    />
  </div>
);

const TextAreaField = ({ icon, label, required, ...props }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition-all resize-none"
    />
  </div>
);
