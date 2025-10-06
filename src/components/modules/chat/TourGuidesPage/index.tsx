"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TourGuideCard } from "@/components/common/tour-guide-card"
import { useDebounce } from "@/lib/useDebounce"
import { TourGuideRequest, useGetTourGuidesMutation } from "@/stores/services/tour-guide/tour-guide"
import { TourGuide } from "@/stores/types/types"
import { createRegexPattern, formatLanguage, formatLocation, formatSpecialty, formatVehicle, languages, locations, specialtyTypes, vehicleTypes } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function TourGuidePage() {
  const [tourGuides, setTourGuides] = useState<TourGuide[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [limit, setLimit] = useState(6)
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
  const debouncedSearch = useDebounce(searchName, 300)

  const [getTourGuides] = useGetTourGuidesMutation()

  const buildFilterRequest = (page: number): TourGuideRequest => {
    const filter: any = {}

    if (experienceYears && experienceYears !== "any") {
      const [min] = experienceYears.split('-').map(Number)
      filter.experienceYears = { operator: "$gte", value: min }
    }

    if (location && location !== "all") {
      filter.location = { operator: "$eq", value: location }
    }

    if (language && language !== "all") {
      filter.languages = { operator: "$in", value: [language] }
    }

    if (priceRange && priceRange !== "any") {
      const [min] = priceRange.split('-').map(Number)
      filter.pricePerDay = { operator: "$gte", value: min }
    }

    if (vehicle && vehicle !== "all") {
      filter.vehicle = { operator: "$eq", value: vehicle }
    }

    if (specialty && specialty !== "all") {
      filter.specialties = { operator: "$in", value: [specialty] }
    }

    if (debouncedSearch.trim()) {
      filter.user_name = {
        operator: "$regex",
        value: createRegexPattern(debouncedSearch)
      }
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

  const fetchNewFilter = async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const request = buildFilterRequest(1);

      const response = await getTourGuides(request).unwrap();

      setTourGuides(response.results);
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

  // Sửa lại phần effects
  // Effect cho initial load và filter changes
  useEffect(() => {
    if (isFetching) return;
    setCurrentPage(1);
    fetchNewFilter();
  }, [experienceYears, location, language, priceRange, vehicle, specialty, debouncedSearch]);

  // Effect riêng cho load more
  useEffect(() => {
    if (currentPage > 1) {
      fetchMoreGuides();
    }
  }, [currentPage])

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setCurrentPage(prev => prev + 1)
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
  }
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-4">Danh sách hướng dẫn viên du lịch</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-56"
              />
            </div>

            <div className="flex gap-2">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa điểm</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {formatLocation(loc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Language */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngôn ngữ</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {formatLanguage(lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Mọi giá</SelectItem>
                  <SelectItem value="100000">Từ 100,000 VND</SelectItem>
                  <SelectItem value="500000">Từ 500,000 VND</SelectItem>
                  <SelectItem value="1000000">Từ 1,000,000 VND</SelectItem>
                  <SelectItem value="1500000">Từ 1,500,000 VNĐ</SelectItem>
                </SelectContent>
              </Select>

              {/* Vehicle */}
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phương tiện</SelectItem>
                  {vehicleTypes.map(v => (
                    <SelectItem key={v} value={v}>
                      {formatVehicle(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Specialty */}
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thế mạnh</SelectItem>
                  {specialtyTypes.map(s => (
                    <SelectItem key={s} value={s}>
                      {formatSpecialty(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="px-4"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Guides Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 text-sm text-muted-foreground">
            Hiển thị {tourGuides.length} trong số {totalResults} hướng dẫn viên
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourGuides.map((guide) => (
              <TourGuideCard
                key={guide.id}
                guide={guide}
                variant="list"
                isFavorite={false}
                onToggleFavorite={() => { }}
              />
            ))}
          </div>

          {tourGuides.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">Không tìm thấy hướng dẫn viên nào</div>
              <div className="text-sm text-muted-foreground">Hãy thử chọn lại bộ lọc </div>
            </div>
          )}
          {/* Load More Button */}
          {tourGuides.length > 0 && currentPage < totalPages && (
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-black text-black hover:bg-gray-800 rounded-full px-8"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                <div className="w-6 h-6 grid grid-cols-2 gap-0.5 mr-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                {isLoadingMore ? 'Đang tải...' : 'Tải thêm hướng dẫn viên'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
