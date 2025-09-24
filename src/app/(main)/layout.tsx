"use client"
import ChatLayout from "@/components/layout/MainLayout";

export default function LayoutChat({ children }: { children: React.ReactNode }) {
    return <ChatLayout>{children}</ChatLayout>;
}