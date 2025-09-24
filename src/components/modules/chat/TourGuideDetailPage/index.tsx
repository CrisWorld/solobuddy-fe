"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft, Share, Heart, Star, MapPin, CalendarIcon, Users,
  MessageCircle, CheckCircle, Camera, Clock, Globe, Award,
} from "lucide-react"
import { format } from "date-fns"
import { useApp } from "@/lib/app-context"
import { formatPrice } from "@/lib/utils"

// Mock data như cũ
const getTourGuideDetails = (id: number) => {
  const guides = {
    1: {
      id: 1,
      name: "Do En Nguyen",
      avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
      rating: 4.94,
      reviews: 360,
      location: "Da Nang City, Vietnam",
      price: 950000,
      joinedYear: 2024,
      isVerified: true,
      isQualityChecked: true,
      specialties: ["Photograph", "Food", "History"],
      languages: ["English", "Vietnamese", "Native"],
      responseTime: "Usually within 2 hours",
      level: "Experienced with individual tours",
      availableAreas: "Da Nang, Hoi An and Hue city",
      certificates: ["/certificate-placeholder.jpg"],
      photos: ["/da-nang-bridge-sunset.jpg", "/hue-imperial-city.jpg", "/hoi-an-lanterns.jpg"],
      about: `Hi there! I'm En, a passionate and friendly local tour guide based in Da Nang, Vietnam. I was born and raised in Ho Chi Minh City, but I've spent the past few years exploring and falling in love with the culture, history, and natural beauty of Central Vietnam.

As your local guide, I'm excited to show you the hidden gems of Da Nang and nearby destinations like Hoi An and Hue – from peaceful beaches and breathtaking mountains to vibrant markets and delicious street food.

I specialize in cultural experiences, photography tours, and culinary adventures, and I love helping travelers uncover the rich stories behind each place. Whether you're into history, food, or just want an authentic local journey, I'm here to make your trip truly memorable.`,
      benefits: [
        "Personalized attention & flexible itinerary",
        "Safe & comfortable experience for solo travelers",
        "Local insights & hidden gems",
        "Photography assistance included",
        "24h advance booking recommended",
      ],
      tours: [
        {
          id: 1,
          title: "Da Nang Street Food Adventure",
          description:
            "Discover Da Nang's best street food with a local guide through bustling markets and authentic vendors.",
          image: "/da-nang-street-food.jpg",
          rating: 4.95,
          reviews: 68,
          price: 500000,
        },
        {
          id: 2,
          title: "Hue Imperial City & Perfume River Tour",
          description: "Explore the ancient capital of Vietnam and the majestic royal palaces along the Perfume River.",
          image: "/hue-imperial-city.jpg",
          rating: 4.92,
          reviews: 76,
          price: 200000,
        },
        {
          id: 3,
          title: "Hoi An Lantern & Culture Walk",
          description: "Experience the magic of Hoi An's ancient streets and learn about its rich cultural heritage.",
          image: "/hoi-an-lanterns.jpg",
          rating: 4.85,
          reviews: 94,
          price: 200000,
        },
        {
          id: 4,
          title: "Ba Na Hills & Golden Bridge Day Trip",
          description:
            "Visit the famous Golden Bridge and enjoy the scenic beauty of Ba Na Hills with a cable car ride.",
          image: "/ba-na-hills-golden-bridge.jpg",
          rating: 4.88,
          reviews: 131,
          price: 200000,
        },
      ],
      userReviews: [
        {
          id: 1,
          name: "Emily T.",
          avatar: "/reviewer-emily.jpg",
          rating: 5,
          date: "2 weeks ago",
          comment:
            "The Hoi An Lantern Walk was magical! Our guide spoke perfect English and shared a lot about Hoi An's history and culture. Highly recommended!",
        },
        {
          id: 2,
          name: "James M.",
          avatar: "/reviewer-james.jpg",
          rating: 5,
          date: "1 month ago",
          comment:
            "En was an amazing guide! Very knowledgeable about local history and took us to the best photo spots. The street food tour was incredible.",
        },
        {
          id: 3,
          name: "Sarah K.",
          avatar: "/reviewer-sarah.jpg",
          rating: 4,
          date: "1 month ago",
          comment:
            "Great experience overall. En was very professional and accommodating. Would definitely book again for our next visit to Vietnam.",
        },
      ],
    },
  }
  return guides[id as keyof typeof guides] || guides[1]
}

export function TourGuideDetailPage({ guideId }: { guideId: number }) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState("")
  const { toggleFavourite } = useApp()
  const guide = getTourGuideDetails(guideId)
  const isFavorite = false // bạn có thể quản lý riêng phần favourite nếu cần

  const handleBack = () => {
    window.history.back() // quay lại trang trước
  }

  const handleBookNow = () => {
    console.log("Booking tour guide:", guide.id, "Date:", selectedDate, "Guests:", guestCount)
  }

  const handleQuickMessage = () => {
    console.log("Sending message to guide:", guide.id, "Message:", message)
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Tour Guide Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guide Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={guide.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {guide.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-foreground">{guide.name}</h2>
                          {guide.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Identity Verified
                            </Badge>
                          )}
                          {guide.isQualityChecked && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Quality Checked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Joined {guide.joinedYear}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{guide.rating}</span>
                            <span className="text-muted-foreground">({guide.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{guide.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => toggleFavourite(guide.id)}>
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right mt-4">
                      <div className="text-2xl font-bold text-foreground">{formatPrice(guide.price)}</div>
                      <div className="text-sm text-muted-foreground">/ day</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favorites/Specialties */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-foreground">Favourites</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {guide.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photos & Certificates */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Photos & Certificates</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {guide.certificates.map((cert, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src="/formal-certificate.png" alt="Certificate" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {guide.photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`/da-nang-city-view-.jpg?height=200&width=200&query=Da Nang city view ${index + 1}`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About Tour Guide */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">About Tour Guide {guide.name}</h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{guide.about}</div>
                <Button variant="link" className="p-0 h-auto text-primary mt-2">
                  Read more ›
                </Button>
              </CardContent>
            </Card>

            {/* Tours Offered */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Tours Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guide.tours.map((tour) => (
                    <div key={tour.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                      <div className="aspect-video bg-gray-100">
                        <img
                          src={`/abstract-geometric-shapes.png?height=200&width=300&query=${tour.title}`}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-foreground mb-2">{tour.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tour.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{tour.rating}</span>
                            <span className="text-xs text-muted-foreground">({tour.reviews})</span>
                          </div>
                          <div className="text-sm font-bold text-foreground">{formatPrice(tour.price)} / day</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Reviews ({guide.reviews})</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-foreground">{guide.rating}</div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2 mb-6">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-2">{rating}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: rating === 5 ? "85%" : rating === 4 ? "12%" : "3%" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {rating === 5 ? "271" : rating === 4 ? "41" : "10"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {guide.userReviews.map((review) => (
                    <div key={review.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/reviewer-.jpg?height=32&width=32&query=reviewer ${review.name}`}
                        />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.name}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={guide.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {guide.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-foreground">{guide.name}</h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Select Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Number of Days</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number.parseInt(e.target.value) || 1)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium mb-4"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>

                  {/* Guide Info */}
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Available Areas</div>
                        <div className="text-muted-foreground">{guide.availableAreas}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Languages</div>
                        <div className="text-muted-foreground">{guide.languages.join(", ")}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Response Time</div>
                        <div className="text-muted-foreground">{guide.responseTime}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Level</div>
                        <div className="text-muted-foreground">{guide.level}</div>
                      </div>
                    </div>
                  </div>

                  {/* Solo Traveler Benefits */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-foreground">Solo Traveler Benefits</span>
                    </div>
                    <div className="space-y-2">
                      {guide.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
