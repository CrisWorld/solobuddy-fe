"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TourGuideCard, TourGuideData } from "@/components/common/tour-guide-card"
import { useApp } from "@/lib/app-context"

export function TourGuides() {
  const [favorites, setFavorites] = useState<number[]>([])
  const { allTourGuides } = useApp();
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
          {allTourGuides.map((guide) => (
            <TourGuideCard
              key={guide.id}
              guide={guide}
              variant="grid"
              isFavorite={favorites.includes(guide.id)}
              onToggleFavorite={toggleFavorite}
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
            Load More Tour Guides
          </Button>
        </div>
      </div>
    </section>
  )
}
