import { Button } from "@/components/ui/button"
import type { Booking } from "@/stores/types/types"
import { useAuth } from "@/components/layout/AuthLayout"
import { useRouter } from "next/navigation"
import { toDate } from "date-fns"

export default function BookingActionsUpcoming({ booking }: { booking: Booking }) {
  const { user } = useAuth()
  const isUser = user?.role === "user"
  const router = useRouter()
  const today = new Date()
  const fromDate = new Date(booking.fromDate)
  return (
    <div className="flex flex-wrap gap-2">
      {/* <Button size="sm" variant="outline" className="flex-1">
        {isUser ? "Liên hệ Hướng dẫn viên" : "Liên hệ Khách du lịch"}
      </Button> */}

      {isUser && (
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => router.push(`/tour-guides/${booking.guideSnapshot.guideid}`)}
        >
          Xem chi tiết Hướng dẫn viên
        </Button>
      )}

      {booking.status === "wait-payment" && isUser && (
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
        >
          Thanh toán
        </Button>
      )}

      {booking.status === "pending" && fromDate > today && (
        <Button size="sm" variant="destructive" className="flex-1">
          Hủy đặt tour
        </Button>
      )}
    </div>
  )
}
