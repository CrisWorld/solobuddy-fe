import { Button } from "@/components/ui/button"
import { Calendar, Star } from "lucide-react"
import { useAuth } from "@/components/layout/AuthLayout"

export default function EmptyState({ type }: { type: "upcoming" | "completed" }) {
  const { user } = useAuth()
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        {type === "upcoming" ? (
          <Calendar className="h-16 w-16 text-blue-400" />
        ) : (
          <Star className="h-16 w-16 text-amber-400" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {type === "upcoming" ? "Chưa có chuyến đi nào" : "Chưa có chuyến đi hoàn thành"}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8 text-sm">
        {type === "upcoming"
          ? "Bạn chưa đặt tour nào. Hãy bắt đầu khám phá và đặt chuyến đi mới ngay hôm nay!"
          : "Hoàn thành tour đầu tiên để xem lịch sử hành trình của bạn tại đây."}
      </p>
      {type === "upcoming" && user?.role === "user" && (
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          Tìm Hướng dẫn viên
        </Button>
      )}
    </div>
  )
}
