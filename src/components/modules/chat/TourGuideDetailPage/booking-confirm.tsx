"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import type { Tour, TourGuideDetail } from "@/stores/services/tour-guide/tour-guide"
import type { TravelerSnapshot } from "@/stores/types/types"
import { Calendar, Star, User, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
  return date.toLocaleDateString("en-US", {
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
  const router = useRouter()
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
      // Format dates to yyyy-mm-dd
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

      // Success - redirect to checkout
      if (response.checkoutUrl) {
        showToast("Booking created successfully! Redirecting to checkout...","success")
        window.location.href = response.checkoutUrl
      }
    } catch (error: any) {
      console.error("Booking error:", error)
        showToast(error?.data?.message || "Failed to create booking. Please try again.", "error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 shadow-2xl border-0">
        <DialogTitle className="sr-only">Confirm Your Booking</DialogTitle>
        
        {/* Premium Header */}
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 text-white p-6 overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Confirm Booking</h2>
              <p className="text-sm text-white/90 mt-0.5">Review your travel details</p>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-5">
          {/* Tour Section */}
          <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2.5 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                <span className="font-semibold text-sm text-gray-800">Tour Package</span>
              </div>
            </div>
            
            <div className="p-4 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-amber-200 shadow-sm">
                  <img
                    src="/da-nang-city-view-.jpg"
                    alt={tour?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{tour?.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>{tour?.duration}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  <span className="text-xs">Base Price</span>
                  <span className="text-lg">{formatPrice(tour?.price || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guide Section */}
          <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-sm text-gray-800">Your Personal Guide</span>
              </div>
            </div>
            
            <div className="p-4 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-200 shadow-md">
                  {guide.user?.avatar ? (
                    <img
                      src={guide.user.avatar || "/placeholder.svg"}
                      alt={guide.user.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  <span>{formatPrice(guide.pricePerDay)}</span>
                  <span className="text-xs">/day × {totalDays} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traveler and Dates Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Traveler Info */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-800">Traveler Info</span>
              </div>
              <div className="space-y-1.5 pl-13">
                <p className="font-bold text-lg text-gray-900">{traveler.name}</p>
                <p className="text-sm text-gray-600">{traveler.email}</p>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">Travel Dates</span>
              </div>
              <div className="space-y-1.5 pl-13">
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(fromDate)}
                </p>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-px bg-gray-300"></div>
                  <span className="text-xs">to</span>
                  <div className="w-4 h-px bg-gray-300"></div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(toDate)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total: {totalDays} days</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-5 text-white">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm opacity-90">
                <span>Tour Package</span>
                <span className="font-semibold">{formatPrice(tour?.price || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-90">
                <span>Guide Service ({totalDays} days)</span>
                <span className="font-semibold">{formatPrice((guide.pricePerDay || 0) * totalDays)}</span>
              </div>
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-3xl font-bold text-amber-400">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex gap-3 p-6 bg-white border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}