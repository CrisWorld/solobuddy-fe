"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { TourGuideCard, TourGuideData } from "@/components/common/tour-guide-card"

const allTourGuides: TourGuideData[] = [
  {
    id: 1,
    name: "Do En Nguyen",
    location: "Da Nang",
    price: 800000,
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
    price: 900000,
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
    price: 1000000,
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
    price: 1000000,
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
    price: 1000000,
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
    price: 1000000,
    rating: 4.43,
    languages: ["Vietnamese", "English", "Russian"],
    specialties: ["Beach", "Water Sports", "Seafood"],
    avatar: "/asian-man-tour-guide-beach.jpg",
    description: "Beach and water sports specialist with extensive knowledge of coastal activities and fresh seafood.",
  },
]

export function FavouritePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { favouriteGuides, toggleFavourite } = useApp()

  const favouriteGuidesData = allTourGuides.filter((guide) => favouriteGuides.includes(guide.id))

  const filteredFavourites = favouriteGuidesData.filter((guide) => {
    return (
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-4">Favourite Tour Guides</h1>

          {favouriteGuidesData.length > 0 && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your favourite guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {favouriteGuidesData.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No favourite guides yet</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Start exploring tour guides and add them to your favourites by clicking the heart icon. Your saved
                guides will appear here for easy access.
              </p>
              <Button
                onClick={() => {
                  // This would navigate to tour guide page in a real app
                  const event = new CustomEvent("navigate", { detail: "tour-guide" })
                  window.dispatchEvent(event)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Browse Tour Guides
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredFavourites.length} of {favouriteGuidesData.length} favourite guides
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavourites.map((guide) => (
                  <TourGuideCard
                    key={guide.id}
                    guide={guide}
                    variant="list"
                    isFavorite={true}
                    onToggleFavorite={toggleFavourite}
                  />
                ))}
              </div>

              {filteredFavourites.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">No favourite guides match your search</div>
                  <div className="text-sm text-muted-foreground">Try a different search term</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
