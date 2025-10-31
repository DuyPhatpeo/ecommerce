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
} from "lucide-react";

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
}

interface Props {
  onChange: (info: CustomerInfo) => void;
}

export default function CheckoutForm({ onChange }) {
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("savedAddresses");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            fullName: "Nguyễn Văn A",
            phone: "0909123456",
            address: "123 Nguyễn Trãi, Phường 7, Quận 5, TP. Hồ Chí Minh",
          },
          {
            id: "2",
            fullName: "Trần Thị B",
            phone: "0912345678",
            address:
              "56 Lý Thường Kiệt, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội",
          },
        ];
  });

  const [selectedId, setSelectedId] = useState(addresses[0]?.id || "");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    phone: "",
    address: "",
  });

  // Save addresses to localStorage
  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(addresses));
  }, [addresses]);

  // Notify parent component whenever selection changes
  useEffect(() => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (selected && onChange) {
      onChange({
        ...selected,
        note: deliveryNote,
        paymentMethod: paymentMethod,
      });
    }
  }, [selectedId, deliveryNote, paymentMethod, addresses, onChange]);

  const handleAddOrEdit = () => {
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập 10-11 số.");
      return;
    }

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? formData : a))
      );
    } else {
      const newAddress = { ...formData, id: Date.now().toString() };
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedId(newAddress.id);
    }
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData({
      id: "",
      fullName: "",
      phone: "",
      address: "",
    });
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      alert("Không thể xóa địa chỉ cuối cùng!");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedId === id) {
        const remaining = addresses.filter((a) => a.id !== id);
        setSelectedId(remaining[0]?.id || "");
      }
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      id: "",
      fullName: "",
      phone: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData(addr);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            Thông Tin Giao Hàng
          </h2>
          <p className="text-orange-100 mt-1 text-sm">
            {addresses.length} địa chỉ đã lưu
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={18} /> Thêm Mới
        </button>
      </div>

      {/* Address List */}
      <div className="p-8 space-y-4">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
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
              <div className="flex gap-2 ml-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openEditModal(addr);
                  }}
                  className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Chỉnh sửa"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteAddress(addr.id);
                  }}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Xóa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </label>
          ))
        ) : (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Chưa có địa chỉ nào</p>
            <button
              onClick={openAddModal}
              className="mt-4 text-orange-500 hover:text-orange-600 font-semibold"
            >
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Delivery Note */}
      {selectedId && (
        <div className="border-t border-orange-100 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
          <div className="px-8 py-4 flex items-center gap-3 border-b border-orange-100">
            <StickyNote className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">
              Ghi Chú Giao Hàng
            </h3>
            <span className="text-sm text-gray-500">(Không bắt buộc)</span>
          </div>
          <div className="p-8">
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Thêm ghi chú đặc biệt cho người giao hàng (vd: gọi trước khi đến, mã cổng, bấm chuông, v.v.)"
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none resize-none bg-white shadow-sm transition-all text-gray-700"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Giúp người giao hàng tìm bạn dễ dàng hơn
              </p>
              <p className="text-xs text-gray-400">{deliveryNote.length}/500</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {selectedId && (
        <div className="border-t border-orange-100">
          <div className="px-8 py-4 flex items-center gap-3 border-b border-orange-100">
            <CreditCard className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">
              Phương Thức Thanh Toán
            </h3>
          </div>
          <div className="p-8 space-y-3">
            {[
              {
                value: "cod",
                label: "Thanh toán khi nhận hàng (COD)",
                icon: <Banknote className="text-green-500" />,
              },
              {
                value: "banking",
                label: "Chuyển khoản ngân hàng",
                icon: <CreditCard className="text-blue-500" />,
              },
              {
                value: "momo",
                label: "Ví điện tử (MoMo, ZaloPay...)",
                icon: <Wallet className="text-pink-500" />,
              },
            ].map((method) => (
              <label
                key={method.value}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                {editingAddress ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAddress(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="Nhập họ và tên đầy đủ"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((p) => ({ ...p, phone: value }));
                  }}
                  placeholder="Nhập 10-11 số"
                  maxLength={11}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition-all"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4 text-orange-500" />
                  Địa Chỉ Đầy Đủ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddOrEdit}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {editingAddress ? "Lưu Thay Đổi" : "Thêm Địa Chỉ"}
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAddress(null);
                    setFormData({
                      id: "",
                      fullName: "",
                      phone: "",
                      address: "",
                    });
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
