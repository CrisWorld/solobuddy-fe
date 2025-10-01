"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import type { Tour, TourGuideDetail } from "@/stores/services/tour-guide/tour-guide"
import type { TravelerSnapshot } from "@/stores/types/types"
import { Calendar, Star, User, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { useAddBookingMutation } from "@/stores/services/user/userApi"
import { useApp } from "@/lib/app-context"

interface BookingConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  guide: TourGuideDetail
  tour: Tour | undefined
  fromDate: Date
  toDate: Date
  traveler: TravelerSnapshot
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function BookingConfirmModal({
  isOpen,
  onClose,
  guide,
  tour,
  fromDate,
  toDate,
  traveler,
}: BookingConfirmModalProps) {
  const { showToast } = useApp()
  const [addBooking, { isLoading }] = useAddBookingMutation()
  
  const totalDays = useMemo(() => {
    if (!fromDate || !toDate) return 0
    const diff = toDate.getTime() - fromDate.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }, [fromDate, toDate])

  const totalPrice = useMemo(() => {
    if (!tour || !guide) return 0
    return tour.price + (guide.pricePerDay || 0) * totalDays
  }, [tour, guide, totalDays])

  const handleConfirm = async () => {
    if (!tour || !guide) return
    
    try {
      const formatDateToAPI = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const response = await addBooking({
        tourGuideId: guide.id,
        tourId: tour.id,
        fromDate: formatDateToAPI(fromDate),
        toDate: formatDateToAPI(toDate),
        quanity: 1,
      }).unwrap()

      if (response.checkoutUrl) {
        showToast("Đặt tour thành công! Đang chuyển tới trang thanh toán...", "success")
        window.location.href = response.checkoutUrl
      }
    } catch (error: any) {
      console.error("Booking error:", error)
      showToast(error?.data?.message || "Không thể tạo đơn đặt tour. Vui lòng thử lại.", "error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 shadow-2xl border-0">
        <DialogTitle className="sr-only">Xác nhận đặt tour</DialogTitle>
        
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 text-white p-6 overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Xác nhận đặt tour</h2>
              <p className="text-sm text-white/90 mt-0.5">Vui lòng kiểm tra lại thông tin chi tiết</p>
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-5">
          {/* Tour */}
          <div className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2.5 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                <span className="font-semibold text-sm text-gray-800">Gói tour</span>
              </div>
            </div>
            
            <div className="p-4 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border-2 border-amber-200">
                  <img
                    src="/da-nang-city-view-.jpg"
                    alt={tour?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{tour?.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>{tour?.duration}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-bold">
                  <span className="text-xs">Giá cơ bản</span>
                  <span className="text-lg">{formatPrice(tour?.price || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hướng dẫn viên */}
          <div className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-sm text-gray-800">Hướng dẫn viên của bạn</span>
              </div>
            </div>
            
            <div className="p-4 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 border-4 border-blue-200">
                  {guide.user?.avatar ? (
                    <img
                      src={guide.user.avatar || "/placeholder.svg"}
                      alt={guide.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-400">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{guide.user?.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{guide.location}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-bold">
                  <span>{formatPrice(guide.pricePerDay)}</span>
                  <span className="text-xs">/ngày × {totalDays} ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin khách & ngày */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-800">Thông tin khách</span>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">{traveler.name}</p>
                <p className="text-sm text-gray-600">{traveler.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-800">Ngày đi</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatDate(fromDate)}</p>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-px bg-gray-300"></div>
                <span className="text-xs">đến</span>
                <div className="w-4 h-px bg-gray-300"></div>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatDate(toDate)}</p>
              <p className="text-xs text-gray-500 mt-1">Tổng: {totalDays} ngày</p>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="bg-gray-900 rounded-2xl p-5 text-white">
            <div className="space-y-3">
              <div className="flex justify-between text-sm opacity-90">
                <span>Gói tour</span>
                <span className="font-semibold">{formatPrice(tour?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-90">
                <span>Dịch vụ hướng dẫn ({totalDays} ngày)</span>
                <span className="font-semibold">{formatPrice((guide.pricePerDay || 0) * totalDays)}</span>
              </div>
              <div className="border-t border-white/20 pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-semibold">Tổng cộng</span>
                <span className="text-3xl font-bold text-amber-400">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-3 p-6 bg-white border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl font-semibold"
          >
            Hủy
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-bold shadow-lg"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận đặt tour"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
