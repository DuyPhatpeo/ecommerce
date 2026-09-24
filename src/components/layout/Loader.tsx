"use client";

import React from "react";
import { FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[999999] bg-[#060b11]/95 backdrop-blur-md flex flex-col items-center justify-center select-none overflow-hidden px-4">
      {/* Subtle athletic neon ambient glow */}
      <div className="absolute w-96 h-96 bg-[#78e000]/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Brand Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#78e000] flex items-center justify-center shadow-lg shadow-[#78e000]/25">
            <span className="text-black font-black text-lg leading-none">D</span>
          </div>
          <span className="text-lg font-black tracking-widest text-white uppercase">
            DINO<span className="text-[#78e000]">SPORTS</span>
          </span>
        </div>

        {/* Sneaker Dynamic Stride Stage */}
        <div className="relative w-48 h-32 flex flex-col items-center justify-center mb-4">
          {/* Animated Sneaker SVG */}
          <div className="sneaker-stride relative z-10">
            <svg
              className="w-28 h-18 text-white drop-shadow-[0_8px_16px_rgba(120,224,0,0.35)]"
              viewBox="0 0 120 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Modern Running Sneaker Silhouette */}
              {/* Upper Body */}
              <path
                d="M18 42C12 36 15 28 28 26C35 25 45 30 54 28C64 25 76 14 88 12C96 10 102 14 104 22L108 34C110 39 105 44 98 44H20C18.5 44 17.5 43 18 42Z"
                fill="#111c29"
                stroke="#1f2d3d"
                strokeWidth="1.5"
              />
              {/* Dynamic Overlay Stripes */}
              <path
                d="M50 30L68 18M58 32L78 18M66 34L86 20"
                stroke="#78e000"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              {/* Dynamic Neon Lime Outsole / Cushion */}
              <path
                d="M12 44C20 44 26 42 38 42C52 42 66 45 80 45C95 45 106 43 114 43C116 43 118 45 116 48L112 55C110 57 106 58 102 58H16C12 58 10 55 10 52L11 46C11 44.5 11.5 44 12 44Z"
                fill="#78e000"
              />
              {/* Cushion Pods detail */}
              <path
                d="M24 50H36M46 50H60M70 50H84M94 50H104"
                stroke="#060b11"
                strokeWidth="2"
                strokeLinecap="square"
              />
              {/* Sneaker Heel Loop */}
              <path
                d="M20 30L14 32V25L20 28"
                stroke="#78e000"
                strokeWidth="2"
                strokeLinecap="square"
              />
              {/* Aerodynamic Speed Lines */}
              <line x1="2" y1="26" x2="10" y2="26" stroke="#78e000" strokeWidth="1.5" opacity="0.8" />
              <line x1="0" y1="34" x2="8" y2="34" stroke="#78e000" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>

          {/* Dynamic Ground Shadow */}
          <div className="sneaker-shadow w-24 h-2 bg-black/60 blur-[3px] mt-1" />

          {/* Kinetic Speed Track beneath */}
          <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-[#78e000]/40 to-transparent relative overflow-hidden mt-2">
            <div className="track-runner absolute inset-0 bg-[#78e000] w-12" />
          </div>
        </div>

        {/* Shopping Context Loading Text */}
        <div className="space-y-1 mb-5">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-center gap-2">
            <FiShoppingBag className="w-4 h-4 text-[#78e000]" />
            <span>Đang chuẩn bị sản phẩm...</span>
          </h3>
          <p className="text-[11px] text-gray-400 font-medium">
            Kiểm tra tồn kho giày chính hãng &amp; ưu đãi tốt nhất
          </p>
        </div>

        {/* Modern Shopping Progress Track */}
        <div className="w-full bg-[#111c29] border border-gray-800 h-1.5 overflow-hidden mb-6 relative">
          <div className="shopping-progress-bar h-full bg-[#78e000]" />
        </div>

        {/* Store Trust Badges (Sharp Corners, Clean E-Commerce Badges) */}
        <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-gray-800/80">
          <div className="bg-[#0b141f] border border-gray-800/80 p-2 flex flex-col items-center">
            <FiShield className="w-3.5 h-3.5 text-[#78e000] mb-1" />
            <span className="text-[9px] font-black text-gray-200 uppercase tracking-tighter">
              100% Chính Hãng
            </span>
          </div>
          <div className="bg-[#0b141f] border border-gray-800/80 p-2 flex flex-col items-center">
            <FiTruck className="w-3.5 h-3.5 text-[#78e000] mb-1" />
            <span className="text-[9px] font-black text-gray-200 uppercase tracking-tighter">
              Freeship 1 Triệu
            </span>
          </div>
          <div className="bg-[#0b141f] border border-gray-800/80 p-2 flex flex-col items-center">
            <FiRefreshCw className="w-3.5 h-3.5 text-[#78e000] mb-1" />
            <span className="text-[9px] font-black text-gray-200 uppercase tracking-tighter">
              Đổi Size 7 Ngày
            </span>
          </div>
        </div>
      </div>

      {/* Scoped CSS Keyframes for Sneaker Motion */}
      <style jsx>{`
        .sneaker-stride {
          animation: sneakerBounce 1.1s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        @keyframes sneakerBounce {
          0%,
          100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-10px) rotate(4deg);
          }
        }
        .sneaker-shadow {
          animation: shadowScale 1.1s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        @keyframes shadowScale {
          0%,
          100% {
            transform: scaleX(1);
            opacity: 0.7;
          }
          50% {
            transform: scaleX(0.7);
            opacity: 0.25;
          }
        }
        .track-runner {
          animation: trackSlide 1s linear infinite;
        }
        @keyframes trackSlide {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(350%);
          }
        }
        .shopping-progress-bar {
          animation: progressFill 1.8s ease-in-out infinite;
        }
        @keyframes progressFill {
          0% {
            width: 0%;
            transform: translateX(0%);
          }
          50% {
            width: 70%;
            transform: translateX(20%);
          }
          100% {
            width: 100%;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
