import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { Booking } from "@/stores/types/types"
import { useRouter } from "next/navigation"
import ReviewDialog from "./review-dialog"

export default function BookingActionsCompleted({ booking }: { booking: Booking }) {
  const router = useRouter()
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        className="flex-1"
        onClick={() => router.push(`/tour-guides/${booking.guideSnapshot.guideid}`)}
      >
        Xem chi tiết Hướng dẫn viên
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="flex-1"
        onClick={() => router.push(`/tour-guides/${booking.guideSnapshot.guideid}`)}
      >
        Đặt lại
      </Button>

      <ReviewDialog booking={booking} />
    </div>
  )
}

