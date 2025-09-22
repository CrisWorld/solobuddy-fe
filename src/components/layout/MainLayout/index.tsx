"use client"

import { ChatSidebar } from "@/components/modules/chat/ChatSideBar"

interface ChatLayoutProps{
    readonly children: React.ReactNode
}

export default function ChatLayout({children}:ChatLayoutProps){
    return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      {children}
    </div>
    )
}