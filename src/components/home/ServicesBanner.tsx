import React from "react";
import { FiTruck, FiShield, FiRepeat, FiCreditCard } from "react-icons/fi";

const commitments = [
  {
    icon: <FiTruck className="w-6 h-6 text-gray-800" />,
    title: "Miễn Phí Vận Chuyển",
    desc: "Miễn phí cho đơn hàng dưới 3km",
  },
  {
    icon: <FiShield className="w-6 h-6 text-gray-800" />,
    title: "Chính Hãng 100%",
    desc: "Cam kết hoàn tiền nếu phát hiện giả",
  },
  {
    icon: <FiRepeat className="w-6 h-6 text-gray-800" />,
    title: "Đổi Trả Linh Hoạt",
    desc: "Hỗ trợ đổi trả sản phẩm",
  },
  {
    icon: <FiCreditCard className="w-6 h-6 text-gray-800" />,
    title: "Thanh Toán Tiện Lợi",
    desc: "Hỗ trợ nhiều hình thức thanh toán",
  },
];

export default function ServicesBanner() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10 border-t border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {commitments.map((c, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-gray-100 flex items-center justify-center flex-shrink-0">
              {c.icon}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-900">{c.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
