"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TourGuideCard, TourGuideData } from "@/components/common/tour-guide-card"

const tourGuides: TourGuideData[] = [
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
    specialties: ["Photography", "Food", "History"],
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
    specialties: ["Photography", "Food"],
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
    specialties: ["History"],
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
    specialties: ["Photography", "Food"],
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
    specialties: ["Food", "History"],
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
    specialties: ["Photography", "History"],
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
            <TourGuideCard
              key={guide.id}
              guide={guide}
              variant="grid"
              isFavorite={favorites.includes(guide.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetails={(id) => console.log("View details for guide", id)}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="bg-black text-black hover:bg-white/90 rounded-full px-8">
            <div className="w-6 h-6 grid grid-cols-2 gap-0.5 mr-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            Load More Tours
          </Button>
        </div>
      </div>
    </section>
  )
}
