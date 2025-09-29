"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Star, Route, MessageCircle, Loader2, ArrowRight } from "lucide-react"
import type { Booking } from "@/stores/types/types"
import { useGetBookingsHistoryQuery } from "@/stores/services/user/userApi"

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const { data: bookingsData, isLoading, error } = useGetBookingsHistoryQuery()

  const allBookings: Booking[] = bookingsData ?? []

  // Filter based on actual dates, not status
  const { upcomingBookings, completedBookings } = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset to start of day for accurate comparison

    const upcoming = allBookings.filter((booking) => {
      // Exclude cancelled bookings from both lists
      if (booking.status === "cancelled") return false
      
      const toDate = new Date(booking.toDate)
      toDate.setHours(23, 59, 59, 999) // End of day
      
      // Upcoming: tour end date is today or in the future
      return toDate >= now
    })

    const completed = allBookings.filter((booking) => {
      // Exclude cancelled bookings
      if (booking.status === "cancelled") return false
      
      const toDate = new Date(booking.toDate)
      toDate.setHours(23, 59, 59, 999)
      
      // Completed: tour end date is in the past
      return toDate < now
    })

    // Sort upcoming by fromDate (earliest first)
    upcoming.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
    
    // Sort completed by toDate (most recent first)
    completed.sort((a, b) => new Date(b.toDate).getTime() - new Date(a.toDate).getTime())

    return { upcomingBookings: upcoming, completedBookings: completed }
  }, [allBookings])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateRange = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    
    const fromStr = from.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const toStr = to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    
    return `${fromStr} - ${toStr}`
  }

  const calculateDuration = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const diffTime = Math.abs(to.getTime() - from.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    if (diffDays === 1) return "1 Day"
    return `${diffDays} Days`
  }

  const getDaysUntilTour = (fromDate: string) => {
    const now = new Date()
    const tour = new Date(fromDate)
    const diffTime = tour.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Ongoing"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `In ${diffDays} days`
  }

  const getStatusConfig = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending Confirmation", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      "wait-payment": { label: "Payment Required", variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" },
      confirmed: { label: "Confirmed", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { label: "Cancelled", variant: "destructive" as const, className: "bg-gray-100 text-gray-800 border-gray-200" },
      completed: { label: "Completed", variant: "secondary" as const, className: "bg-blue-100 text-blue-800 border-blue-200" },
    }

    return statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: "secondary" as const,
      className: "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const EmptyState = ({ type }: { type: "upcoming" | "completed" }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        {type === "upcoming" ? (
          <Calendar className="h-16 w-16 text-blue-400" />
        ) : (
          <Star className="h-16 w-16 text-amber-400" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {type === "upcoming" ? "No Upcoming Tours" : "No Completed Tours Yet"}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8 text-sm">
        {type === "upcoming"
          ? "You don't have any tours scheduled. Start exploring and book your next adventure!"
          : "Complete your first tour to see your journey history here."}
      </p>
      {type === "upcoming" && (
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg">
          Browse Tour Guides
        </Button>
      )}
    </div>
  )

  const BookingCard = ({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) => {
    const statusConfig = getStatusConfig(booking.status)
    
    return (
      <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Left Section - Guide Avatar & Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:w-48 flex flex-col items-center justify-center border-r border-gray-100">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md mb-3">
                <AvatarImage src="/default-avatar.png" />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-lg font-bold">
                  {booking.guideSnapshot.location
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  {booking.guideSnapshot.location}
                </div>
              </div>
            </div>

            {/* Right Section - Tour Details */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="font-bold text-lg text-foreground flex-1">{booking.tourSnapshot.title}</h3>
                    {isUpcoming && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                        {getDaysUntilTour(booking.fromDate)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className={`${statusConfig.className} border font-medium`}>
                      {statusConfig.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>•</span>
                      <span>Quantity: {booking.quanity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Price</div>
                  <div className="text-2xl font-bold text-blue-600">${booking.totalPrice}</div>
                </div>
              </div>

              {/* Date & Duration */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-foreground">{formatDateRange(booking.fromDate, booking.toDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-foreground">{calculateDuration(booking.fromDate, booking.toDate)}</span>
                  </div>
                </div>
              </div>

              {/* Tour Details Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs bg-white">
                  ${booking.guideSnapshot.pricePerDay}/day
                </Badge>
                <Badge variant="outline" className="text-xs bg-white">
                  {booking.tourSnapshot.duration}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {isUpcoming ? (
                  <>
                    {booking.status === "wait-payment" && (
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                        Complete Payment
                      </Button>
                    )}
                    {(booking.status === "confirmed" || booking.status === "pending") && (
                      <>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </>
                    )}
                    {booking.status === "pending" && (
                      <Button size="sm" variant="destructive" className="flex-1">
                        Cancel Booking
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                      <Star className="h-4 w-4 mr-2" />
                      Rate Tour
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Book Again
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white border-b border-border shadow-sm p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Journey</h1>
            <p className="text-muted-foreground">Track your tours and travel experiences</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="text-muted-foreground">Loading your bookings...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white border-b border-border shadow-sm p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Journey</h1>
            <p className="text-muted-foreground">Track your tours and travel experiences</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Failed to load bookings</h2>
            <p className="text-muted-foreground mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Journey</h1>
          <p className="text-muted-foreground">Track your tours and travel experiences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white shadow-sm">
              <TabsTrigger 
                value="upcoming" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-semibold"
              >
                <Calendar className="h-4 w-4" />
                Upcoming
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
                  {upcomingBookings.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="flex items-center gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 font-semibold"
              >
                <Star className="h-4 w-4" />
                Completed
                <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
                  {completedBookings.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingBookings.length === 0 ? (
                <EmptyState type="upcoming" />
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedBookings.length === 0 ? (
                <EmptyState type="completed" />
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
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