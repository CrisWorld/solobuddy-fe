import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { ChatContent } from "@/components/modules/chat/ChatPage"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-3 text-primary" />
          <p>Đang tải nội dung chat...</p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}
