import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  FileText,
  CreditCard,
  Wallet,
  Banknote,
  Trash2,
} from "lucide-react";

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
  paymentMethod: string;
}

interface Props {
  onChange: (info: CustomerInfo) => void;
}

const CheckoutForm: React.FC<Props> = ({ onChange }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    const saved = localStorage.getItem("checkoutInfo");
    return saved
      ? JSON.parse(saved)
      : {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          district: "",
          ward: "",
          note: "",
          paymentMethod: "cod",
        };
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customerInfo.fullName.trim())
      newErrors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email))
      newErrors.email = "Invalid email address.";
    if (!/^\+?\d{9,13}$/.test(customerInfo.phone))
      newErrors.phone = "Invalid phone number.";
    return newErrors;
  };

  useEffect(() => {
    onChange(customerInfo);
    localStorage.setItem("checkoutInfo", JSON.stringify(customerInfo));
  }, [customerInfo]);

  const handleReset = () => {
    setCustomerInfo({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      note: "",
      paymentMethod: "cod",
    });
    setErrors({});
    localStorage.removeItem("checkoutInfo");
  };

  const handleBlur = () => setErrors(validate());

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <User className="w-6 h-6" />
          Checkout Information
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-white text-sm flex items-center gap-1 underline hover:text-gray-100"
        >
          <Trash2 size={16} /> Clear
        </button>
      </div>

      {/* Body */}
      <div className="p-8 space-y-8">
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            icon={<User />}
            label="Full Name"
            name="fullName"
            required
            value={customerInfo.fullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.fullName}
            placeholder="Enter your full name"
          />
          <InputField
            icon={<Mail />}
            label="Email"
            name="email"
            required
            value={customerInfo.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.email}
            placeholder="example@email.com"
          />
          <InputField
            icon={<Phone />}
            label="Phone"
            name="phone"
            required
            value={customerInfo.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.phone}
            placeholder="+84 900 000 000"
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            icon={<MapPin />}
            label="District"
            name="district"
            value={customerInfo.district}
            onChange={handleInputChange}
          />
          <InputField
            icon={<MapPin />}
            label="City"
            name="city"
            value={customerInfo.city}
            onChange={handleInputChange}
          />
          <InputField
            icon={<MapPin />}
            label="Ward"
            name="ward"
            value={customerInfo.ward}
            onChange={handleInputChange}
          />
          <InputField
            icon={<Home />}
            label="Address"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            className="md:col-span-3"
            placeholder="House number, street name..."
          />
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-2 text-orange-500" />
              Notes (optional)
            </label>
            <textarea
              name="note"
              value={customerInfo.note}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none resize-none"
              placeholder="Leave a note for delivery..."
            />
          </div>
        </div>

        {/* Payment */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-orange-500" />
            Payment Method
          </h3>
          <div className="space-y-3">
            {[
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
                label: "Digital Wallet (MoMo, ZaloPay...)",
                icon: <Wallet className="text-pink-500" />,
              },
            ].map((method) => (
              <label
                key={method.value}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  customerInfo.paymentMethod === method.value
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={customerInfo.paymentMethod === method.value}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-600"
                />
                <span className="ml-4 flex items-center gap-2 font-semibold text-gray-900">
                  {method.icon}
                  {method.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom input component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder,
  icon,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {icon && (
        <span className="inline-block mr-2 text-orange-500">{icon}</span>
      )}
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border-2 outline-none ${
        error
          ? "border-red-400 focus:border-red-400"
          : "border-gray-200 focus:border-orange-400"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default CheckoutForm;
