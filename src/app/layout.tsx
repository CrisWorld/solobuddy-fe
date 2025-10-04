import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";
import { AuthProvider } from "@/components/layout/AuthLayout";

const inter = Inter({
  subsets: ["latin", "vietnamese"], // nhớ thêm vietnamese để hỗ trợ tiếng Việt
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SoloBuddy - Người bạn đồng hành du lịch của bạn",
  description: "Khám phá thế giới cùng SoloBuddy – người bạn đồng hành hoàn hảo trong mọi chuyến đi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased`}>
        <AppProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
