import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Mail, Phone } from "lucide-react"
import type { Booking } from "@/stores/types/types"
import { useAuth } from "@/components/layout/AuthLayout"
import BookingActionsUpcoming from "./booking-action-upcoming"
import BookingActionsCompleted from "./booking-action-completed"
import { formatPrice } from "@/lib/utils"

const formatDateRange = (from: string, to: string) => {
  const f = new Date(from)
  const t = new Date(to)
  return `${f.toLocaleDateString("vi-VN", { month: "short", day: "numeric" })} - ${t.toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`
}

const calculateDuration = (from: string, to: string) => {
  const diffDays =
    Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)) + 1
  return diffDays === 1 ? "1 ngày" : `${diffDays} ngày`
}

const getDaysUntilTour = (fromDate: string) => {
  const diff = new Date(fromDate).getTime() - Date.now()
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return "Đang diễn ra"
  if (diffDays === 0) return "Hôm nay"
  if (diffDays === 1) return "Ngày mai"
  return `Còn ${diffDays} ngày`
}

export default function BookingCard({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) {
  const { user } = useAuth()
  const isUser = user?.role === "user"
  const target = isUser ? booking.guideSnapshot : booking.travelerSnapshot

  return (
    <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden rounded-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          {/* === CỘT TRÁI: HƯỚNG DẪN VIÊN === */}
          <div className="flex flex-col items-center md:items-start md:w-1/3">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src={target.avatar || "/default-avatar.png"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-lg font-bold">
                  {target.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{target.name}</h3>
                {target.email && (
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <Mail className="h-3 w-3" /> {target.email}
                  </div>
                )}
                {target.phone && (
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <Phone className="h-3 w-3" /> {target.phone}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  {!isUser
                    ? `${(target as any).location || ""}${target.country ? ", " + target.country : ""}`
                    : target.country || "Chưa rõ"}
                </div>
              </div>
            </div>

            {/* Giá tour */}
            <div className="w-full mt-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-2 border border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá tour</span>
                <span className="font-semibold text-blue-600">{formatPrice(booking.tourSnapshot.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá theo ngày</span>
                <span className="font-semibold">{formatPrice(booking.guideSnapshot.pricePerDay)}/ngày</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Tổng tiền</span>
                <span className="text-lg font-bold text-blue-700">{formatPrice(booking.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* === CỘT GIỮA: THÔNG TIN TOUR === */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-xl text-foreground">{booking.tourSnapshot.title}</h3>
              {isUpcoming && (
                <Badge
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getDaysUntilTour(booking.fromDate) === "Đang diễn ra"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                >
                  {getDaysUntilTour(booking.fromDate)}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                {formatDateRange(booking.fromDate, booking.toDate)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                {calculateDuration(booking.fromDate, booking.toDate)}
              </div>
            </div>

            {isUpcoming ? (
              <BookingActionsUpcoming booking={booking} />
            ) : isUser ? (
              <BookingActionsCompleted booking={booking} />
            ) : null}

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
