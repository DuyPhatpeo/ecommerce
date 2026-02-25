import React from "react";
import { FiCreditCard } from "react-icons/fi";
import { BsCash } from "react-icons/bs";
import { LuWallet } from "react-icons/lu";
import Radio from "../../components/ui/Radio";

export interface PaymentMethod {
  value: "cod" | "banking" | "momo";
  label: string;
  icon: React.ReactNode;
}

interface PaymentSectionProps {
  selected: string;
  onChange: (v: "cod" | "banking" | "momo") => void;
}

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-200 bg-white">
    <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-200 bg-white">
      {icon}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function PaymentSection({
  selected,
  onChange,
}: PaymentSectionProps) {
  const paymentMethods: PaymentMethod[] = [
    {
      value: "cod",
      label: "Cash on Delivery",
      icon: <BsCash className="text-green-500" />,
    },
    {
      value: "banking",
      label: "Bank Transfer",
      icon: <FiCreditCard className="text-blue-500" />,
    },
    {
      value: "momo",
      label: "E-Wallet",
      icon: <LuWallet className="text-pink-500" />,
    },
  ];

  return (
    <Section
      icon={<FiCreditCard className="w-5 h-5 text-orange-500" />}
      title="Payment Method"
    >
      {paymentMethods.map((method) => (
        <Radio
          key={method.value}
          value={method.value}
          checked={selected === method.value}
          onChange={(v) => onChange(v as "cod" | "banking" | "momo")}
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
}
