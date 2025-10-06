import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Booking } from "@/stores/types/types"
import { useAuth } from "@/components/layout/AuthLayout"
import { useRouter } from "next/navigation"
import { useUpdateBookingStatusMutation } from "@/stores/services/user/userApi"
import { useApp } from "@/lib/app-context"

export default function BookingActionsUpcoming({ booking }: { booking: Booking }) {
  const { user } = useAuth()
  const isUser = user?.role === "user"
  const router = useRouter()
  
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [updateBookingStatus, { isLoading }] = useUpdateBookingStatusMutation()
  const {showToast} = useApp()
  
  const today = new Date()
  const fromDate = new Date(booking.fromDate)

  const handleCancelBooking = async () => {
    // try {
    //   const result = await updateBookingStatus({
    //     id: booking.id,
    //     status: 'cancelled'
    //   }).unwrap()

    //   if (result.success) {
    //     showToast("Hủy đặt tour thành công", "success")
    //     setShowCancelDialog(false)
        
    //     // Refresh page or redirect
    //     router.refresh()
    //   } else {
    //     showToast("Hủy đặt tour thất bại", "error")
    //   }
    // } catch (error: any) {
    //   showToast(error?.data?.message || "Hủy đặt tour thất bại", "error")
    // }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
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
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex-1"
            onClick={() => setShowCancelDialog(true)}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Hủy đặt tour"}
          </Button>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đặt tour</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đặt tour này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-medium text-gray-900 text-sm">Thông tin tour:</p>
            <p className="text-gray-700 mt-2">{booking.tourSnapshot.title}</p>
            <p className="text-gray-600 text-sm mt-1">
              Từ ngày: {new Date(booking.fromDate).toLocaleDateString('vi-VN')} - 
              Đến ngày: {new Date(booking.toDate).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isLoading}
            >
              Không, giữ lại
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Có, hủy đặt tour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}