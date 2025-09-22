"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Star, Route, MessageCircle } from "lucide-react"
import { useApp } from "@/lib/app-context"

interface BookedTour {
  id: number
  guideName: string
  guideAvatar: string
  location: string
  date: string
  time: string
  duration: string
  status: "upcoming" | "completed" | "cancelled"
  price: string
  rating?: number
  description: string
  specialties: string[]
}

const mockBookedTours: BookedTour[] = [
  {
    id: 1,
    guideName: "Do En Nguyen",
    guideAvatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
    location: "Da Nang",
    date: "2024-01-15",
    time: "09:00 AM",
    duration: "Full Day",
    status: "upcoming",
    price: "49.92$",
    description: "Photography and food tour around Da Nang's hidden gems",
    specialties: ["Photography", "Food", "History"],
  },
  {
    id: 2,
    guideName: "Thao Nguyen",
    guideAvatar: "/asian-woman-tour-guide-hoi-an.jpg",
    location: "Hoi An",
    date: "2024-01-20",
    time: "02:00 PM",
    duration: "Half Day",
    status: "upcoming",
    price: "42.00$",
    description: "Traditional craft workshop and cooking class experience",
    specialties: ["Crafts", "Cooking", "Culture"],
  },
  {
    id: 3,
    guideName: "Minh Tran",
    guideAvatar: "/asian-man-tour-guide-hanoi.jpg",
    location: "Hanoi",
    date: "2023-12-10",
    time: "10:00 AM",
    duration: "Full Day",
    status: "completed",
    price: "45.00$",
    rating: 5,
    description: "Historical architecture tour with street food tasting",
    specialties: ["History", "Architecture", "Street Food"],
  },
  {
    id: 4,
    guideName: "Linh Pham",
    guideAvatar: "/asian-woman-tour-guide.jpg",
    location: "Ho Chi Minh City",
    date: "2023-11-25",
    time: "07:00 PM",
    duration: "Evening",
    status: "completed",
    price: "55.00$",
    rating: 4,
    description: "Nightlife and cultural exploration in Saigon",
    specialties: ["Culture", "Shopping", "Nightlife"],
  },
]

export function JourneyPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const { bookedTours } = useApp()

  // In a real app, this would come from the context/API
  const allTours = mockBookedTours

  const upcomingTours = allTours.filter((tour) => tour.status === "upcoming")
  const completedTours = allTours.filter((tour) => tour.status === "completed")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const EmptyState = ({ type }: { type: "upcoming" | "completed" }) => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Route className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {type === "upcoming" ? "No upcoming tours" : "No completed tours yet"}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {type === "upcoming"
          ? "You don't have any tours scheduled. Start exploring and book your next adventure!"
          : "Complete your first tour to see your journey history here."}
      </p>
      {type === "upcoming" && (
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Browse Tour Guides</Button>
      )}
    </div>
  )

  const TourCard = ({ tour }: { tour: BookedTour }) => (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={tour.guideAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              {tour.guideName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{tour.guideName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {tour.location}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-primary">{tour.price}</div>
                {tour.status === "completed" && tour.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{tour.rating}/5</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{tour.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(tour.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {tour.time} • {tour.duration}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {tour.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              {tour.status === "upcoming" ? (
                <>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Guide
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    Book Again
                  </Button>
                  {!tour.rating && (
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Rate Tour
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-4">My Journey</h1>
          <p className="text-muted-foreground">Track your tours and travel experiences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming ({upcomingTours.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Completed ({completedTours.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingTours.length === 0 ? (
                <EmptyState type="upcoming" />
              ) : (
                <div className="space-y-4">
                  {upcomingTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedTours.length === 0 ? (
                <EmptyState type="completed" />
              ) : (
                <div className="space-y-4">
                  {completedTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
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
