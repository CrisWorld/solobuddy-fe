"use client"

import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/stores/types/types"
import { useGetBookingsHistoryQuery } from "@/stores/services/user/userApi"
import { useAuth } from "@/components/layout/AuthLayout"
import EmptyState from "../empty-state"
import BookingCard from "../booking-card"

export default function JourneyPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("upcoming")
  const { data: bookingsData, isLoading, error } = useGetBookingsHistoryQuery()

  const allBookings: Booking[] = bookingsData ?? []

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const { upcomingBookings, completedBookings } = useMemo(() => {
    const upcoming = allBookings.filter((b) => {
      if (b.status === "cancelled" || b.status === "completed") return false
      const toDate = new Date(b.toDate)
      toDate.setHours(23, 59, 59, 999)
      return toDate >= now
    })

    const completed = allBookings.filter((b) => {
      if (b.status === "cancelled") return false
      if (b.status === "completed") return true
      const toDate = new Date(b.toDate)
      toDate.setHours(23, 59, 59, 999)
      return toDate < now
    })

    upcoming.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
    completed.sort((a, b) => new Date(b.toDate).getTime() - new Date(a.toDate).getTime())

    return { upcomingBookings: upcoming, completedBookings: completed }
  }, [allBookings])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return <div className="flex-1 flex items-center justify-center text-red-500">Không tải được dữ liệu</div>
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b border-border shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Hành Trình Của Tôi</h1>
          <p className="text-muted-foreground">Theo dõi các chuyến đi và trải nghiệm du lịch của bạn</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white shadow-sm">
              <TabsTrigger value="upcoming" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Sắp diễn ra
                <Badge variant="secondary" className="ml-1">{upcomingBookings.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                Đã hoàn thành
                <Badge variant="secondary" className="ml-1">{completedBookings.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingBookings.length === 0 ? (
                <EmptyState type="upcoming" />
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((b) => (
                    <BookingCard key={b.id} booking={b} isUpcoming />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedBookings.length === 0 ? (
                <EmptyState type="completed" />
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((b) => (
                    <BookingCard key={b.id} booking={b} isUpcoming={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
