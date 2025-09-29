"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import {
  ArrowLeft, CheckCircle, Star, MapPin, Heart, Award, Sparkles,
  CalendarIcon, Globe, Clock
} from "lucide-react"

import { formatLanguages, formatLocation, formatPrice, formatSpecialty, formatVehicle } from "@/lib/utils"
import { useGetTourGuideDetailQuery, useGetToursByGuideMutation } from "@/stores/services/tour-guide/tour-guide"
import { useGetReviewsQuery } from "@/stores/services/review/review"
import { PhotoCarousel } from "@/components/common/photos-list"
import { TourGuideTours } from "./tours"
import { TourGuideReviews } from "./reviews"
import { BookingConfirmModal } from "./booking-confirm"
import { useAuth } from "@/components/layout/AuthLayout"

interface TourGuideDetailPageProps {
  guideId: string
}

export function TourGuideDetailPage({ guideId }: TourGuideDetailPageProps) {
  const {user, openLogin} = useAuth();
  const [selectedTourId, setSelectedTourId] = useState<string>("")
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [tours, setTours] = useState<any[]>([])
  const [toursLoading, setToursLoading] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Fetch tour guide detail
  const { data: guide, isLoading: guideLoading, error: guideError } = useGetTourGuideDetailQuery(guideId)

  // Fetch tours by guide with proper error handling and dependency tracking
  const [getToursByGuide] = useGetToursByGuideMutation()

  const fetchTours = useCallback(async () => {
    if (!guideId || toursLoading) return

    setToursLoading(true)

    try {
      const res = await getToursByGuide({
        filter: {
          guideId: guideId
        },
        options: {
          limit: 6,
          page: 1
        }
      }).unwrap()

      setTours(res.results || [])
    } catch (error) {
      console.error('Error fetching tours:', error)
      setTours([])
    } finally {
      setToursLoading(false)
    }
  }, [guideId, getToursByGuide, toursLoading])

  // Use useEffect with proper dependencies
  useEffect(() => {
    fetchTours()
  }, [guideId]) // Remove fetchTours from dependencies to avoid infinite loop

  // Fetch reviews with proper error handling
  const { data: reviewRes, isLoading: reviewLoading, error: reviewError } = useGetReviewsQuery(
    { guideId, page: 1, limit: 10 },
    { skip: !guideId }
  )

  // Memoize computed values
  const reviews = useMemo(() => reviewRes?.results || [], [reviewRes])
  const filteredTours = useMemo(() => tours.filter((tour) => !tour.deleted), [tours])
  const isFavorite = false // TODO: hook vào API/Redux nếu cần

  // Check if a date is available based on guide's schedule
  const isDateAvailable = useCallback((date: Date) => {
    if (!guide) return false

    if (guide.isRecur) {
      // Check day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayOfWeek = date.getDay()
      return guide.dayInWeek?.includes(dayOfWeek) || false
    } else {
      // Check available dates
      if (!guide.availableDates?.length) return false
      const dateStr = date.toISOString().split('T')[0]
      return guide.availableDates.some(availDate => {
        const availDateStr = new Date(availDate).toISOString().split('T')[0]
        return availDateStr === dateStr
      })
    }
  }, [guide])

  // Handlers
  const handleBack = useCallback(() => {
    window.history.back()
  }, [])

  const handleBookNow = useCallback(() => {
    if (!selectedTourId || !fromDate || !toDate) return
    if(!user){
      openLogin();
      return;
    }
    setIsBookingModalOpen(true)
  }, [selectedTourId, fromDate, toDate])


  const handleFromDateSelect = useCallback((date: Date | undefined) => {
    setFromDate(date)
    // Reset toDate if it's before the new fromDate
    if (date && toDate && date > toDate) {
      setToDate(undefined)
    }
  }, [toDate])

  const handleToDateSelect = useCallback((date: Date | undefined) => {
    setToDate(date)
  }, [])

  const handleTourChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTourId(e.target.value)
  }, [])

  // Loading states
  if (guideLoading) {
    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error states
  if (guideError || !guide) {
    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Tour Guide Details</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {guideError ? 'Error loading guide details' : 'Guide not found'}
            </p>
            <Button variant="outline" onClick={handleBack} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
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
                    <AvatarImage src={guide.user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {guide.user?.name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("") || "TG"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-foreground">{guide.user?.name}</h2>
                          {guide.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active Guide
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{guide.experienceYears} years experience</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{guide.ratingAvg || 0}</span>
                            <span className="text-muted-foreground">({guide.ratingCount || 0} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{guide.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right mt-4">
                      <div className="text-2xl font-bold text-foreground">{formatPrice(guide.pricePerDay)}</div>
                      <div className="text-sm text-muted-foreground">/ day</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Specialties Section */}
                  {guide.specialties?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-foreground">Specialties</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {guide.specialties.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm bg-blue-50 border-blue-200 text-blue-700"
                          >
                            {formatSpecialty(specialty)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favourites Section */}
                  {guide.favourites?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <h3 className="font-semibold text-foreground">Interests & Hobbies</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {guide.favourites.map((favourite) => (
                          <Badge
                            key={favourite._id}
                            variant="outline"
                            className="text-sm bg-purple-50 border-purple-200 text-purple-700"
                          >
                            {favourite.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {guide.photos?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <PhotoCarousel photos={guide.photos} photosPerPage={6} />
                </CardContent>
              </Card>
            )}

            {/* About Tour Guide */}
            {guide.bio && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">About Tour Guide {guide.user?.name}</h3>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{guide.bio}</div>
                </CardContent>
              </Card>
            )}

            {/* Tours Offered */}
            <TourGuideTours
              tours={filteredTours}
            />

            {/* Reviews */}
            <TourGuideReviews
              reviews={reviews}
              ratingAvg={guide.ratingAvg || 0}
              ratingCount={guide.ratingCount || 0}
            />
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={guide.user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {guide.user?.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("") || "TG"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-foreground">{guide.user?.name}</h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Select Tour</label>
                      <select
                        value={selectedTourId}
                        onChange={handleTourChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="">Choose a tour</option>
                        {filteredTours.map((tour) => (
                          <option key={tour.id} value={tour.id}>
                            {tour.title} - {formatPrice(tour.price)} {tour.unit && `/ ${tour.unit}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">From Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {fromDate ? format(fromDate, "PPP") : "Pick start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={handleFromDateSelect}
                            initialFocus
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              return date < today || !isDateAvailable(date)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">To Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-transparent"
                            disabled={!fromDate}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {toDate ? format(toDate, "PPP") : "Pick end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={handleToDateSelect}
                            initialFocus
                            disabled={(date) => {
                              if (!fromDate) return true
                              return date < fromDate || !isDateAvailable(date)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium mb-4"
                    onClick={handleBookNow}
                    disabled={!selectedTourId || !fromDate || !toDate}
                  >
                    {!selectedTourId ? 'Select Tour to Book' : !fromDate || !toDate ? 'Select Dates' : 'Book Now'}
                  </Button>

                  {/* Guide Info */}
                  <div className="space-y-4 text-sm">
                    {guide.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Location</div>
                          <div className="text-muted-foreground">{formatLocation(guide.location)}</div>
                        </div>
                      </div>
                    )}

                    {guide.languages?.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Languages</div>
                          <div className="text-muted-foreground">{formatLanguages(guide.languages)}</div>
                        </div>
                      </div>
                    )}

                    {guide.experienceYears && (
                      <div className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Experience</div>
                          <div className="text-muted-foreground">{guide.experienceYears} years</div>
                        </div>
                      </div>
                    )}

                    {guide.vehicle && (
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Vehicle</div>
                          <div className="text-muted-foreground">{formatVehicle(guide.vehicle)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {user && isBookingModalOpen &&
      <BookingConfirmModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        guide={guide}
        tour={filteredTours.find(t => t.id === selectedTourId)}
        fromDate={fromDate!}
        toDate={toDate!}
        traveler={{
          id: user.id, 
          name: user.name,
          email: user.email,
        }}     
      />      
      }
      

    </div>

  )
}