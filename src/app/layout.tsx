import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "DINOSPORTS - Giày Thể Thao Chính Hãng & Đẳng Cấp 2026",
  description: "DINOSPORTS chuyên cung cấp giày thể thao chính hãng Nike, Adidas, Puma, Asics, Hoka. Miễn phí vận chuyển, cam kết 100% chính hãng, đổi trả linh hoạt.",
  keywords: ["giày thể thao", "dinosports", "dino sports", "nike", "adidas ultraboost", "asics", "sneaker chính hãng"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#78e000] selection:text-black">
        <ClientProviders>
          <TopBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
