import React from "react";

export default function TopBar() {
  return (
    <div className="bg-[#78e000] text-black h-9 px-4 flex items-center justify-center text-[11px] sm:text-xs font-black tracking-wide select-none z-50 relative">
      <span>GIAO HÀNG MIỄN PHÍ CHO ĐƠN HÀNG ĐẦU TIÊN TRÊN 1.000.000</span>
      <a
        href="tel:19006868"
        className="ml-2.5 bg-black hover:bg-neutral-900 text-white text-[11px] font-bold px-2 py-0.5 rounded transition-colors inline-flex items-center"
      >
        Hotline: 1900 6868
      </a>
    </div>
  );
}
