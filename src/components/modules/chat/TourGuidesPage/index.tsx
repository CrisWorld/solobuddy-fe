"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { TourGuideCard, TourGuideData } from "@/components/common/tour-guide-card"

const allTourGuides: TourGuideData[] = [
  {
    id: 1,
    name: "Do En Nguyen",
    location: "Da Nang",
    price: "49.92$ per day",
    rating: 4.56,
    languages: ["Vietnamese", "English"],
    specialties: ["Photography", "Food", "History"],
    avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
    description: "Passionate photographer and food enthusiast with 5 years of guiding experience.",
  },
  {
    id: 2,
    name: "Nguyen Truong Giang",
    location: "Da Nang",
    price: "49.92$ per day",
    rating: 4.52,
    languages: ["Vietnamese", "English"],
    specialties: ["Photography", "Food", "History"],
    avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
    description: "Local historian specializing in cultural tours and authentic dining experiences.",
  },
  {
    id: 3,
    name: "Linh Pham",
    location: "Ho Chi Minh City",
    price: "55.00$ per day",
    rating: 4.78,
    languages: ["Vietnamese", "English", "French"],
    specialties: ["Culture", "Shopping", "Nightlife"],
    avatar: "/asian-woman-tour-guide.jpg",
    description: "Energetic guide who knows all the best spots for shopping and nightlife in Saigon.",
  },
  {
    id: 4,
    name: "Minh Tran",
    location: "Hanoi",
    price: "45.00$ per day",
    rating: 4.65,
    languages: ["Vietnamese", "English", "Japanese"],
    specialties: ["History", "Architecture", "Street Food"],
    avatar: "/asian-man-tour-guide-hanoi.jpg",
    description: "Architecture enthusiast with deep knowledge of Hanoi's historical sites and street food scene.",
  },
  {
    id: 5,
    name: "Thao Nguyen",
    location: "Hoi An",
    price: "42.00$ per day",
    rating: 4.89,
    languages: ["Vietnamese", "English", "Korean"],
    specialties: ["Crafts", "Cooking", "Culture"],
    avatar: "/asian-woman-tour-guide-hoi-an.jpg",
    description: "Traditional craft expert offering hands-on cooking classes and cultural immersion experiences.",
  },
  {
    id: 6,
    name: "Duc Le",
    location: "Nha Trang",
    price: "38.50$ per day",
    rating: 4.43,
    languages: ["Vietnamese", "English", "Russian"],
    specialties: ["Beach", "Water Sports", "Seafood"],
    avatar: "/asian-man-tour-guide-beach.jpg",
    description: "Beach and water sports specialist with extensive knowledge of coastal activities and fresh seafood.",
  },
]

export function TourGuidePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const { favouriteGuides, toggleFavourite } = useApp()

  const filteredGuides = allTourGuides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLocation = locationFilter === "all" || guide.location === locationFilter
    const matchesSpecialty = specialtyFilter === "all" || guide.specialties.includes(specialtyFilter)

    return matchesSearch && matchesLocation && matchesSpecialty
  })

  const locations = Array.from(new Set(allTourGuides.map((guide) => guide.location)))
  const specialties = Array.from(new Set(allTourGuides.flatMap((guide) => guide.specialties)))

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tour Guides</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guides, locations, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Guides Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredGuides.length} of {allTourGuides.length} tour guides
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <TourGuideCard
                key={guide.id}
                guide={guide}
                variant="list"
                isFavorite={favouriteGuides.includes(guide.id)}
                onToggleFavorite={toggleFavourite}
                onViewDetails={(id) => console.log("View details for guide", id)}
                onBookNow={(id) => console.log("Book guide", id)}
              />
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">No tour guides found</div>
              <div className="text-sm text-muted-foreground">Try adjusting your search or filters</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
