import React from "react";
import { FiFileText } from "react-icons/fi";

interface DeliveryNoteProps {
  note: string;
  setNote: (v: string) => void;
}

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

export default function DeliveryNote({ note, setNote }: DeliveryNoteProps) {
  return (
    <Section
      icon={<FiFileText className="w-5 h-5 text-orange-500" />}
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
}
