"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { TourGuideCard } from "@/components/common/tour-guide-card"

export function TourGuidePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const { favouriteGuides, toggleFavourite } = useApp()
  const { allTourGuides} = useApp();
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
