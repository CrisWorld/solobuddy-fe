import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";
import { AuthProvider } from "@/components/layout/AuthLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoloBuddy - Người bạn đồng hành du lịch của bạn",
  description: "Khám phá thế giới cùng SoloBuddy – người bạn đồng hành hoàn hảo trong mọi chuyến đi. Khám phá điểm đến mới, kết nối với bạn bè đồng hành và chia sẻ hành trình của bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <AppProvider>
            <AuthProvider>
              {children}
            </AuthProvider>            
          </AppProvider>
      </body>
    </html>
  );
}
