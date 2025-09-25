"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TourGuideCard } from "@/components/common/tour-guide-card"
import { TourGuide } from "@/stores/types/types"
import { TourGuideRequest, useGetTourGuidesMutation } from "@/stores/services/tour-guide/tour-guide"
import { formatLanguage, formatLocation, formatSpecialty, formatVehicle, languages, vehicleTypes, locations, specialtyTypes } from "@/lib/utils"
import { useDebounce } from "@/lib/useDebounce"
import { set } from "lodash"

export function TourGuides() {
  const [tourGuides, setTourGuides] = useState<TourGuide[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [limit] = useState(6)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Filter states
  const [experienceYears, setExperienceYears] = useState<string>("any")
  const [location, setLocation] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("any")
  const [vehicle, setVehicle] = useState<string>("all")
  const [specialty, setSpecialty] = useState<string>("all")
  const [language, setLanguage] = useState<string>("all")
  const [searchName, setSearchName] = useState<string>("")
  const debouncedSearch = useDebounce(searchName, 500)

  const [getTourGuides] = useGetTourGuidesMutation()

  // Build request with optional page
  const buildFilterRequest = (page: number): TourGuideRequest => {
    const filter: any = {}

    if (experienceYears && experienceYears !== "any") {
      filter.experienceYears = { operator: "$gte", value: Number(experienceYears) }
    }

    if (location && location !== "all") {
      filter.location = { operator: "$eq", value: location }
    }

    if (language && language !== "all") {
      filter.languages = { operator: "$in", value: [language] }
    }

    if (priceRange && priceRange !== "any") {
      filter.pricePerDay = { operator: "$gte", value: Number(priceRange) }
    }

    if (vehicle && vehicle !== "all") {
      filter.vehicle = { operator: "$eq", value: vehicle }
    }

    if (specialty && specialty !== "all") {
      filter.specialties = { operator: "$in", value: [specialty] }
    }

    if (debouncedSearch.trim()) {
      filter['user.name'] = { operator: "$regex", value: debouncedSearch.trim() }
    }

    return {
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      options: {
        sortBy: "createdAt",
        limit,
        page
      }
    }
  }

  // Tách thành 2 hàm fetch riêng biệt
  const fetchNewFilter = async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const request = buildFilterRequest(1); // Luôn fetch page 1 khi filter thay đổi
      const response = await getTourGuides(request).unwrap();

      setTourGuides(response.results); // Thay thế hoàn toàn danh sách cũ
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
    } catch (error) {
      console.error("Failed to fetch tour guides:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMoreGuides = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const request = buildFilterRequest(currentPage);
      const response = await getTourGuides(request).unwrap();

      setTourGuides(prev => [...prev, ...response.results]); // Thêm vào danh sách hiện có
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
    } catch (error) {
      console.error("Failed to fetch more tour guides:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Effect cho filter changes
  useEffect(() => {
    setCurrentPage(1);
    fetchNewFilter();
  }, [experienceYears, location, language, priceRange, vehicle, specialty, debouncedSearch]);

  // Effect cho page changes
  useEffect(() => {
    if (currentPage > 1) { // Chỉ fetch khi page > 1
      fetchMoreGuides();
    }
  }, [currentPage]);

  const toggleFavorite = () => { }

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setCurrentPage(prev => prev + 1);
    }
  }

  const resetFilters = () => {
    setExperienceYears("any")
    setLocation("all")
    setPriceRange("any")
    setVehicle("all")
    setSpecialty("all")
    setLanguage("all")
    setSearchName("")
    // Không cần set currentPage vì đã có effect filter handle
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Tour Guides
          </h2>
          <p className="text-muted-foreground text-lg">
            Find the perfect tour guide for your Vietnam adventure
          </p>
          {totalResults > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {tourGuides.length} of {totalResults} tour guides
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-56"
          />

          <Select value={experienceYears} onValueChange={setExperienceYears}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Experience</SelectItem>
              <SelectItem value="1">From 1 year</SelectItem>
              <SelectItem value="3">From 3 years</SelectItem>
              <SelectItem value="5">From 5 years</SelectItem>
              <SelectItem value="10">From 10 years</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{formatLocation(loc)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map(lang => (
                <SelectItem key={lang} value={lang}>{formatLanguage(lang)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="50">From $50</SelectItem>
              <SelectItem value="100">From $100</SelectItem>
              <SelectItem value="150">From $150</SelectItem>
              <SelectItem value="200">From $200</SelectItem>
            </SelectContent>
          </Select>

          <Select value={vehicle} onValueChange={setVehicle}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Vehicle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Vehicle</SelectItem>
              {vehicleTypes.map(v => (
                <SelectItem key={v} value={v}>{formatVehicle(v)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Specialty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialtyTypes.map(s => (
                <SelectItem key={s} value={s}>{formatSpecialty(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters} className="px-4">
            Reset Filters
          </Button>
        </div>

        {/* Loading & No Results */}
        {isFetching && tourGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading tour guides...</p>
          </div>
        )}
        {!isFetching && tourGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tour guides found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Tour Guides Grid */}
        {tourGuides.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tourGuides.map(guide => (
              <TourGuideCard
                key={guide.id}
                guide={guide}
                variant="grid"
                isFavorite={false}
                onToggleFavorite={() => toggleFavorite()}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {tourGuides.length > 0 && currentPage < totalPages && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading..." : "Load More Tour Guides"}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
