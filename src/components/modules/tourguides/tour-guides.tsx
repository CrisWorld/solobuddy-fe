"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, MapPin, DollarSign } from "lucide-react"

const tourGuides = [
  {
    id: 1,
    name: "Nguyen Minh Hoang Quoc",
    rating: 4.96,
    reviews: 672,
    location: "Da Nang",
    availability: "Available now",
    availabilityColor: "green",
    timeSlot: "08:00-22:00",
    price: 50.32,
    image: "/asian-male-tour-guide-with-glasses-and-map.jpg",
    languages: ["Vario 160"],
    specialties: ["Honda"],
  },
  {
    id: 2,
    name: "Do En Nguyen",
    rating: 4.56,
    reviews: 460,
    location: "Da Nang",
    availability: "Available now",
    availabilityColor: "green",
    timeSlot: "07:00-22:00",
    price: 49.92,
    image: "/young-asian-male-tour-guide-smiling.jpg",
    languages: ["Honda"],
    specialties: [],
  },
  {
    id: 3,
    name: "Nguyen Van Khanh",
    rating: 4.47,
    reviews: 540,
    location: "Da Nang",
    availability: "Available now",
    availabilityColor: "green",
    timeSlot: "08:00-22:00",
    price: 48.52,
    image: "/placeholder-fr6cz.png",
    languages: ["Vinfat"],
    specialties: [],
  },
  {
    id: 4,
    name: "Nguyen Thi Quynh Nhu",
    rating: 4.96,
    reviews: 672,
    location: "Da Nang",
    availability: "Available now",
    availabilityColor: "green",
    timeSlot: "15:00-22:00",
    price: 40.32,
    image: "/young-asian-female-tour-guide-with-glasses.jpg",
    languages: ["Vespa"],
    specialties: [],
  },
  {
    id: 5,
    name: "Nguyen Thi Lan",
    rating: 4.96,
    reviews: 672,
    location: "Da Nang",
    availability: "Available now",
    availabilityColor: "green",
    timeSlot: "15:00-22:00",
    price: 39.32,
    image: "/female-tour-guide-with-hat-outdoors.jpg",
    languages: ["Vario 160"],
    specialties: [],
  },
  {
    id: 6,
    name: "Le Duong Bao Lam",
    rating: 4.96,
    reviews: 672,
    location: "Da Nang",
    availability: "Available now",
    availabilityColor: "green",
    timeSlot: "15:00-22:00",
    price: 35.32,
    image: "/young-male-tour-guide-with-hat-and-backpack.jpg",
    languages: ["Vario 160"],
    specialties: [],
  },
]

export function TourGuides() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Tours Guide</h2>
          <p className="text-muted-foreground text-lg">Favorite tour guides based on customer reviews</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select defaultValue="20-25">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20-25">20-25</SelectItem>
              <SelectItem value="25-30">25-30</SelectItem>
              <SelectItem value="30-35">30-35</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="female">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="any">Any</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="da-nang">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="da-nang">Da Nang</SelectItem>
              <SelectItem value="ho-chi-minh">Ho Chi Minh</SelectItem>
              <SelectItem value="hanoi">Hanoi</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="50-60">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50-60">50$-60$</SelectItem>
              <SelectItem value="40-50">40$-50$</SelectItem>
              <SelectItem value="30-40">30$-40$</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="motorbike">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="motorbike">Motorbike</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="walking">Walking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tour Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tourGuides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={guide.image || "/placeholder.svg"} alt={guide.name} className="w-full h-64 object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className={`${
                      guide.timeSlot.includes("08:00")
                        ? "bg-green-100 text-green-800"
                        : guide.timeSlot.includes("07:00")
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {guide.timeSlot}
                  </Badge>
                </div>
                <button
                  onClick={() => toggleFavorite(guide.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(guide.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
                <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{guide.rating}</span>
                    <span className="text-xs text-muted-foreground">({guide.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{guide.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <div className={`w-2 h-2 rounded-full bg-${guide.availabilityColor}-500`}></div>
                      <span>{guide.availability}</span>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{guide.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {guide.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xl font-bold text-foreground">${guide.price}</span>
                      <span className="text-sm text-muted-foreground">/ day</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="bg-black text-white hover:bg-black/90 rounded-full px-8">
            <div className="w-6 h-6 grid grid-cols-2 gap-0.5 mr-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Load More Tours
          </Button>
        </div>
      </div>
    </section>
  )
}
