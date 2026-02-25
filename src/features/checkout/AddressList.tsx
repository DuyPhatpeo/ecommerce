import { FiPlus } from "react-icons/fi";
import AddressItem from "./AddressItem";

interface AddressListProps {
  addresses: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (address: any) => void;
  onAdd: () => void;
}

export default function AddressList({
  addresses,
  selectedId,
  onSelect,
  onDelete,
  onEdit,
  onAdd,
}: AddressListProps) {
  return (
    <div className="space-y-4">
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
          className="bg-gray-900 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-orange-500/30"
        >
          <FiPlus size={16} /> Add New Address
        </button>
      </div>
    </div>
  );
}
