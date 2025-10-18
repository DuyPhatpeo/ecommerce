import React, { useState } from "react";

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
  onConfirm: (info: CustomerInfo) => void;
}

const CheckoutForm: React.FC<Props> = ({ onConfirm }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city
    ) {
      alert("Please fill in all required fields!");
      return;
    }
    onConfirm(customerInfo);
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Customer Information
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            Please provide your contact details
          </p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={customerInfo.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-orange-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-orange-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none"
              placeholder="+84 900 000 000"
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Shipping Address</h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["city", "district", "ward"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={(customerInfo as any)[field]}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none"
              />
            </div>
          ))}
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none"
              placeholder="House number, street name..."
            />
          </div>
          <div className="md:col-span-3">
            <textarea
              name="note"
              value={customerInfo.note}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none resize-none"
              placeholder="Notes (optional)"
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Payment Method</h2>
        </div>
        <div className="p-8 space-y-4">
          {[
            { value: "cod", label: "Cash on Delivery" },
            { value: "banking", label: "Bank Transfer" },
            { value: "momo", label: "Digital Wallet" },
          ].map((method) => (
            <label
              key={method.value}
              className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 transition-all"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={customerInfo.paymentMethod === method.value}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-600"
              />
              <span className="ml-4 font-semibold text-gray-900">
                {method.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Confirm Information
      </button>
    </div>
  );
};

export default CheckoutForm;
