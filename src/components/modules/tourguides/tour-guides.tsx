"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TourGuideCard } from "@/components/common/tour-guide-card"
import { TourGuide } from "@/stores/types/types"
import { TourGuideRequest, useGetTourGuidesMutation } from "@/stores/services/tour-guide/tour-guide"
import { formatLanguage, formatLocation, formatSpecialty, formatVehicle, languages, vehicleTypes, locations, specialtyTypes, createRegexPattern } from "@/lib/utils"
import { useDebounce } from "@/lib/useDebounce"

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
  const debouncedSearch = useDebounce(searchName, 300)

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
            Các Hướng Dẫn Viên Du Lịch Của Chúng Tôi
          </h2>
          <p className="text-muted-foreground text-lg">
            Tìm hướng dẫn viên hoàn hảo cho chuyến phiêu lưu một mình của bạn.
          </p>
          {totalResults > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Hiển thị {tourGuides.length} trong số {totalResults} hướng dẫn viên
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-56"
          />

          <Select value={experienceYears} onValueChange={setExperienceYears}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Năm kinh nghiệm</SelectItem>
              <SelectItem value="1">Từ 1 năm</SelectItem>
              <SelectItem value="3">Từ 3 năm</SelectItem>
              <SelectItem value="5">Từ 5 năm</SelectItem>
              <SelectItem value="10">Từ 10 năm</SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="50">Từ 100,000 VND</SelectItem>
              <SelectItem value="100">Từ 500,000 VND</SelectItem>
              <SelectItem value="150">Từ 1,000,000 VND</SelectItem>
              <SelectItem value="200">Từ 1,500,00 VNĐ</SelectItem>
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

        {/* Loading & No Results */}
        {isFetching && tourGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải hướng dẫn viên...</p>
          </div>
        )}
        {!isFetching && tourGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy hướng dẫn viên. Hãy thử thay đổi bộ lọc.</p>
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
              {isLoadingMore ? "Đang tải..." : "Tải thêm hướng dẫn viên"}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
