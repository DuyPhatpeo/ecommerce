import React, { useEffect } from "react";
import { FiMapPin, FiX } from "react-icons/fi";

import AddressList from "./AddressList";
import Button from "../../components/ui/Button";

interface SelectAddressModalProps {
  addresses: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (address: any) => void;
  onAdd: () => void;
  onClose: () => void;
}

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-90"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative border border-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          icon={<FiX className="w-5 h-5" />}
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 
             rounded-xl text-gray-500 hover:text-gray-800 bg-gray-100/40
             hover:bg-gray-200/60 transition-all duration-300 hover:scale-105"
          aria-label="Close"
        />
        {children}
      </div>
    </div>
  );
};

export default function SelectAddressModal({
  addresses,
  selectedId,
  onSelect,
  onDelete,
  onEdit,
  onAdd,
  onClose,
}: SelectAddressModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2 border-b border-orange-100 pb-3">
        <FiMapPin className="text-orange-500" /> Select Address
      </div>
      <AddressList
        addresses={addresses}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
        onEdit={onEdit}
        onAdd={onAdd}
      />
    </Modal>
  );
}
