"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Check, X, Upload, Star, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TourGuideProfile, useGetProfileQuery, UserProfile } from "@/stores/services/user/userApi"
import {
  useUpdateTourGuideProfileMutation,
  useUpdateAvailableDatesMutation,
  useUpdateWorkDaysMutation,
  UpdateTourGuideProfileRequest,
  UpdateAvailableDatesRequest,
  UpdateWorkDaysRequest,
  useGetToursByGuideMutation
} from "@/stores/services/tour-guide/tour-guide"
import { countries, favourites, formatFavourite, formatPrice, formatSpecialty, formatVehicle, languages, specialtyTypes, vehicleTypes } from "@/lib/utils"
import { PhotoUpload } from "@/components/common/photo-upload"
import { DaySelector } from "@/components/common/day-selector"
import { CalendarPicker } from "@/components/common/calendar-picker"
import { uploadToCloudinary } from "@/lib/cloundinary"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useApp } from "@/lib/app-context"
import { AddTourForm } from "./add-tour-form"
import { ToursList } from "./tours"

export function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingTourGuide, setIsEditingTourGuide] = useState(false)
  const [tours, setTours] = useState<any[]>([])
  const [toursLoading, setToursLoading] = useState(false)
  const { showToast } = useApp()
  // Fetch user profile data
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery()
  // Fetch tours by guide with proper error handling and dependency tracking
  const [getToursByGuide] = useGetToursByGuideMutation()

  useEffect(() => {
    const fetchTours = async () => {
      if (!profileData || profileData.role !== "guide" || !profileData.tourGuides || profileData.tourGuides.length === 0) return;
      setToursLoading(true)
      try {
        const res = await getToursByGuide({
          filter: { guideId: profileData.tourGuides[0].id },
          options: { limit: 6, page: 1 }
        }).unwrap()
        setTours(res.results || [])
      } catch (err) {
        console.error(err)
        setTours([])
      } finally {
        setToursLoading(false)
      }
    }

    if (profileData?.role === "guide") {
      fetchTours()
    }
  }, [profileData, getToursByGuide])

  const refreshTours = async () => {
    if (!profileData || profileData.role !== "guide" || !profileData.tourGuides || profileData.tourGuides.length === 0) return;
    setToursLoading(true)
    try {
      const res = await getToursByGuide({
        filter: { guideId: profileData.tourGuides[0].id },
        options: { limit: 6, page: 1 }
      }).unwrap()
      setTours(res.results || [])
    } catch (err) {
      console.error(err)
      setTours([])
    } finally {
      setToursLoading(false)
    }
  }

  // Mutations for updating tour guide data
  const [updateTourGuideProfile, { isLoading: isUpdatingProfile }] = useUpdateTourGuideProfileMutation()
  const [updateAvailableDates, { isLoading: isUpdatingDates }] = useUpdateAvailableDatesMutation()
  const [updateWorkDays, { isLoading: isUpdatingWorkDays }] = useUpdateWorkDaysMutation()

  // Local state for editing
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [editedTourGuideProfile, setEditedTourGuideProfile] = useState<TourGuideProfile | null>(null)

  // Store original data for comparison
  const [originalTourGuideProfile, setOriginalTourGuideProfile] = useState<TourGuideProfile | null>(null)

  // Initialize editing state when data is loaded
  useEffect(() => {
    if (profileData) {
      setEditedProfile({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        country: profileData.country,
        role: profileData.role,
        isEmailVerified: profileData.isEmailVerified,
        avatar: profileData.avatar,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
      })

      // If user is a guide and has tour guide profile
      if (profileData.role === "guide" && profileData.tourGuides && profileData.tourGuides.length > 0) {
        const tourGuideData = profileData.tourGuides[0]
        setEditedTourGuideProfile(tourGuideData)
        setOriginalTourGuideProfile(tourGuideData)
      }
    }
  }, [profileData])

  const handleSaveProfile = async () => {
    if (!editedProfile) return

    try {
      // TODO: Add API call to update user profile
      // await updateProfile(editedProfile)

      setIsEditingProfile(false)
      showToast("Hồ sơ cá nhân đã được update thành công", "success");
      // Refetch data to get updated profile
      refetch()
    } catch (error) {
      console.error('Có lỗi trong lúc update hồ sơ:', error)
      showToast("Có lỗi trong lúc update hồ sơ", "error");
    }
  }

  const handleCancelProfile = () => {
    if (profileData) {
      setEditedProfile({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        country: profileData.country,
        role: profileData.role,
        isEmailVerified: profileData.isEmailVerified,
        avatar: profileData.avatar,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
      })
    }
    setIsEditingProfile(false)
  }

  const handleSaveTourGuide = async () => {
    if (!editedTourGuideProfile || !originalTourGuideProfile) return

    try {
      const isUpdating = isUpdatingProfile || isUpdatingDates || isUpdatingWorkDays
      if (isUpdating) return // Prevent multiple simultaneous requests

      // 1. Update basic tour guide profile info
      const profileChanges: UpdateTourGuideProfileRequest = {}
      let hasProfileChanges = false

      if (editedTourGuideProfile.bio !== originalTourGuideProfile.bio) {
        profileChanges.bio = editedTourGuideProfile.bio
        hasProfileChanges = true
      }
      if (editedTourGuideProfile.pricePerDay !== originalTourGuideProfile.pricePerDay) {
        profileChanges.pricePerDay = editedTourGuideProfile.pricePerDay
        hasProfileChanges = true
      }
      if (editedTourGuideProfile.location !== originalTourGuideProfile.location) {
        profileChanges.location = editedTourGuideProfile.location
        hasProfileChanges = true
      }
      if (JSON.stringify(editedTourGuideProfile.languages) !== JSON.stringify(originalTourGuideProfile.languages)) {
        profileChanges.languages = editedTourGuideProfile.languages
        hasProfileChanges = true
      }
      if (editedTourGuideProfile.experienceYears !== originalTourGuideProfile.experienceYears) {
        profileChanges.experienceYears = editedTourGuideProfile.experienceYears
        hasProfileChanges = true
      }
      if (JSON.stringify(editedTourGuideProfile.photos) !== JSON.stringify(originalTourGuideProfile.photos)) {
        profileChanges.photos = editedTourGuideProfile.photos
        hasProfileChanges = true
      }
      if (editedTourGuideProfile.vehicle !== originalTourGuideProfile.vehicle) {
        profileChanges.vehicle = editedTourGuideProfile.vehicle
        hasProfileChanges = true
      }
      if (JSON.stringify(editedTourGuideProfile.specialties) !== JSON.stringify(originalTourGuideProfile.specialties)) {
        profileChanges.specialties = editedTourGuideProfile.specialties
        hasProfileChanges = true
      }

      // Handle favourites - convert to string array for API
      const editedFavouriteNames = editedTourGuideProfile.favourites.map(f => f.name)
      const originalFavouriteNames = originalTourGuideProfile.favourites.map(f => f.name)
      if (JSON.stringify(editedFavouriteNames) !== JSON.stringify(originalFavouriteNames)) {
        profileChanges.favourites = editedFavouriteNames
        hasProfileChanges = true
      }

      // 2. Update available dates
      const originalDates = new Set(originalTourGuideProfile.availableDates)
      const editedDates = new Set(editedTourGuideProfile.availableDates)

      const addDates = editedTourGuideProfile.availableDates.filter(date => !originalDates.has(date))
      const removeDates = originalTourGuideProfile.availableDates.filter(date => !editedDates.has(date) || date < new Date().toISOString().split('T')[0])

      const hasDateChanges = addDates.length > 0 || removeDates.length > 0

      // 3. Update work days
      const hasWorkDayChanges =
        editedTourGuideProfile.isRecur !== originalTourGuideProfile.isRecur ||
        JSON.stringify(editedTourGuideProfile.dayInWeek) !== JSON.stringify(originalTourGuideProfile.dayInWeek)

      // Execute API calls
      const promises = []

      if (hasProfileChanges) {
        promises.push(updateTourGuideProfile(profileChanges))
      }

      if (hasDateChanges) {
        const dateRequest: UpdateAvailableDatesRequest = {
          addDates,
          removeDates
        }
        promises.push(updateAvailableDates(dateRequest))
      }

      if (hasWorkDayChanges) {
        const workDayRequest: UpdateWorkDaysRequest = {
          isRecur: editedTourGuideProfile.isRecur || false,
          dayInWeek: editedTourGuideProfile.dayInWeek || []
        }
        promises.push(updateWorkDays(workDayRequest))
      }

      if (promises.length === 0) {
        setIsEditingTourGuide(false)
        showToast("Không có thay đổi nào để lưu", "info");
        return
      }

      const results = await Promise.all(promises)

      const allSuccessful = results.every(result => {
        const hasData = 'data' in result && result.data
        const isSuccess = hasData && result.data.success === true
        return isSuccess
      })

      if (allSuccessful) {
        setIsEditingTourGuide(false)
        showToast("Hồ sơ hướng dẫn viên đã được update thành công", "success");
        // Refetch data to get updated profile
        refetch()
      } else {
        // Handle partial success or failures
        const failedResults = results.filter(result => {
          const hasData = 'data' in result && result.data
          return !hasData || !result.data.success
        })
        showToast("Một vài update đã thất bại. Vui lòng thử lại sau", "error");

        console.error('Failed results:', failedResults)

        // Check if any succeeded
        const succeededCount = results.filter(result => 'data' in result && result.data && result.data.success).length
        const totalCount = results.length

        if (succeededCount > 0 && succeededCount < totalCount) {
          showToast("Một vài update đã thành công nhưng đã có update thất bại", "info");
        } else if (succeededCount === 0) {
          showToast("Tất cả các update đều thất bại. Vui lòng thử lại sau", "error");
        }

        // If some succeeded, still refetch to get partial updates
        if (succeededCount > 0) {
          refetch()
        }
      }
    } catch (error) {
      console.error('Update thất bại:', error)
      showToast("Update thất bại", "error");
    }
  }

  const handleCancelTourGuide = () => {
    if (originalTourGuideProfile) {
      setEditedTourGuideProfile({ ...originalTourGuideProfile })
    }
    setIsEditingTourGuide(false)
  }

  const handleAvatarUpload = async (file: File) => {
    if (!editedProfile) return;

    const url = await uploadToCloudinary(file); // upload thật sự
    if (!url) return;

    setEditedProfile({ ...editedProfile, avatar: url });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="bg-card border-b border-border p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-1" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Đã xảy ra lỗi khi tải hồ sơ. Vui lòng thử lại.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} className="mt-4">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!profileData || !editedProfile) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Không có dữ liệu hồ sơ để hiển thị.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  const isTourGuide = profileData.role === "guide"
  const tourGuideProfile = profileData.tourGuides && profileData.tourGuides.length > 0 ? profileData.tourGuides[0] : null
  const isUpdating = isUpdatingProfile || isUpdatingDates || isUpdatingWorkDays

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={editedProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {editedProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditingProfile && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <input type="file" accept="image/*" className="hidden" id="avatar-upload" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{editedProfile.name}</h1>
              <p className="text-muted-foreground">{editedProfile.email}</p>
              {editedProfile.isEmailVerified && (
                <Badge variant="secondary" className="mt-1">
                  Email đã xác minh
                </Badge>
              )}
            </div>
          </div>

          {!isEditingProfile ? (
            <Button onClick={() => setIsEditingProfile(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa hồ sơ
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} className="bg-green-600 text-white hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Lưu
              </Button>
              <Button onClick={handleCancelProfile} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Thông tin cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  {isEditingProfile ? (
                    <Input id="name" value={editedProfile.name} onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })} placeholder="Nhập họ tên" />
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-sm">{profileData.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Quốc gia</Label>
                  {isEditingProfile ? (
                    <Select value={editedProfile.country} onValueChange={(value) => setEditedProfile({ ...editedProfile, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country.charAt(0).toUpperCase() + country.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {profileData.country ? profileData.country.charAt(0).toUpperCase() + profileData.country.slice(1) : "Chưa có"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">{profileData.email}</div>
                </div>

                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {profileData.role === "guide" ? "Hướng dẫn viên" : "Khách du lịch"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hồ sơ hướng dẫn viên */}
          {isTourGuide && tourGuideProfile && editedTourGuideProfile && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Hồ sơ hướng dẫn viên
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-normal">
                          {tourGuideProfile.ratingAvg} ({tourGuideProfile.ratingCount} đánh giá)
                        </span>
                      </div>
                    </CardTitle>
                  </div>
                  {!isEditingTourGuide ? (
                    <Button onClick={() => setIsEditingTourGuide(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveTourGuide}
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={isUpdating}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {isUpdating ? "Saving..." : "Save"}
                      </Button>
                      <Button onClick={handleCancelTourGuide} variant="outline" disabled={isUpdating}>
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bio */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="bio">Giới thiệu</Label>
                    {isEditingTourGuide ? (
                      <Textarea
                        id="bio"
                        value={editedTourGuideProfile.bio}
                        onChange={(e) => setEditedTourGuideProfile({ ...editedTourGuideProfile, bio: e.target.value })}
                        placeholder="Giới thiệu bản thân..."
                        rows={3}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md text-sm">{tourGuideProfile.bio}</div>
                    )}
                  </div>

                  {/* Price Per Day */}
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Giá thuê mỗi ngày ($)</Label>
                    {isEditingTourGuide ? (
                      <Input
                        id="pricePerDay"
                        type="number"
                        value={editedTourGuideProfile.pricePerDay}
                        onChange={(e) =>
                          setEditedTourGuideProfile({ ...editedTourGuideProfile, pricePerDay: Number(e.target.value) })
                        }
                        placeholder="50"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md text-sm">{formatPrice(tourGuideProfile.pricePerDay)}</div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm</Label>
                    {isEditingTourGuide ? (
                      <Input
                        id="location"
                        value={editedTourGuideProfile.location}
                        onChange={(e) =>
                          setEditedTourGuideProfile({ ...editedTourGuideProfile, location: e.target.value })
                        }
                        placeholder="Ho Chi Minh City"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md text-sm">{tourGuideProfile.location}</div>
                    )}
                  </div>

                  {/* Experience Years */}
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Kinh nghiệm (Năm)</Label>
                    {isEditingTourGuide ? (
                      <Input
                        id="experienceYears"
                        type="number"
                        value={editedTourGuideProfile.experienceYears}
                        onChange={(e) =>
                          setEditedTourGuideProfile({
                            ...editedTourGuideProfile,
                            experienceYears: Number(e.target.value),
                          })
                        }
                        placeholder="5"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md text-sm">{tourGuideProfile.experienceYears} năm</div>
                    )}
                  </div>

                  {/* Vehicle */}
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Phương tiện</Label>
                    {isEditingTourGuide ? (
                      <Select
                        value={editedTourGuideProfile.vehicle}
                        onValueChange={(value) =>
                          setEditedTourGuideProfile({ ...editedTourGuideProfile, vehicle: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phương tiện" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((vehicle) => (
                            <SelectItem key={vehicle} value={vehicle}>
                              {formatVehicle(vehicle)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {formatVehicle(tourGuideProfile.vehicle)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <Label>Ngôn ngữ giao tiếp</Label>
                  {isEditingTourGuide ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {languages.map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`lang-${lang}`}
                            checked={editedTourGuideProfile.languages.includes(lang)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditedTourGuideProfile({
                                  ...editedTourGuideProfile,
                                  languages: [...editedTourGuideProfile.languages, lang],
                                })
                              } else {
                                setEditedTourGuideProfile({
                                  ...editedTourGuideProfile,
                                  languages: editedTourGuideProfile.languages.filter((l) => l !== lang),
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`lang-${lang}`} className="text-sm">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tourGuideProfile.languages.map((lang) => (
                        <Badge key={lang} variant="secondary">
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <Label>Thế mạnh</Label>
                  {isEditingTourGuide ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specialtyTypes.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`specialty-${specialty}`}
                            checked={editedTourGuideProfile.specialties.includes(specialty)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditedTourGuideProfile({
                                  ...editedTourGuideProfile,
                                  specialties: [...editedTourGuideProfile.specialties, specialty],
                                })
                              } else {
                                setEditedTourGuideProfile({
                                  ...editedTourGuideProfile,
                                  specialties: editedTourGuideProfile.specialties.filter((s) => s !== specialty),
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`specialty-${specialty}`} className="text-sm">
                            {formatSpecialty(specialty)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tourGuideProfile.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {formatSpecialty(specialty)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Favourites */}
                <div className="space-y-2">
                  <Label>Sở thích</Label>
                  {isEditingTourGuide ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {favourites.map((fav) => (
                        <div key={fav} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`fav-${fav}`}
                            checked={editedTourGuideProfile.favourites.some((f) => f.name === fav)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditedTourGuideProfile({
                                  ...editedTourGuideProfile,
                                  favourites: [...editedTourGuideProfile.favourites, { _id: fav, name: fav }],
                                })
                              } else {
                                setEditedTourGuideProfile({
                                  ...editedTourGuideProfile,
                                  favourites: editedTourGuideProfile.favourites.filter((f) => f.name !== fav),
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`fav-${fav}`} className="text-sm">
                            {formatFavourite(fav)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tourGuideProfile.favourites.map((fav) => (
                        <Badge key={fav._id} variant="secondary">
                          {fav.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <PhotoUpload
                    photos={isEditingTourGuide ? editedTourGuideProfile.photos : tourGuideProfile.photos}
                    onPhotosChange={(photos) => setEditedTourGuideProfile({ ...editedTourGuideProfile, photos })}
                    disabled={!isEditingTourGuide}
                    maxPhotos={10}
                  />
                </div>

                {/* Scheduling */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isRecur"
                      checked={isEditingTourGuide ? editedTourGuideProfile.isRecur : tourGuideProfile.isRecur}
                      onCheckedChange={(checked) =>
                        isEditingTourGuide && setEditedTourGuideProfile({ ...editedTourGuideProfile, isRecur: checked })
                      }
                      disabled={!isEditingTourGuide}
                    />
                    <Label htmlFor="isRecur">Lịch trình theo ngày trong tuần</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Day of Week Selection - only if recurring */}
                    {(isEditingTourGuide ? editedTourGuideProfile.isRecur : tourGuideProfile.isRecur) && (
                      <DaySelector
                        selectedDays={
                          isEditingTourGuide ? editedTourGuideProfile.dayInWeek || [] : tourGuideProfile.dayInWeek || []
                        }
                        onDaysChange={(days) =>
                          isEditingTourGuide &&
                          setEditedTourGuideProfile({ ...editedTourGuideProfile, dayInWeek: days })
                        }
                        disabled={!isEditingTourGuide}
                      />
                    )}

                    {/* Available Dates - always shown */}
                    <CalendarPicker
                      selectedDates={
                        isEditingTourGuide ? editedTourGuideProfile.availableDates : tourGuideProfile.availableDates
                      }
                      onDatesChange={(dates) =>
                        isEditingTourGuide &&
                        setEditedTourGuideProfile({ ...editedTourGuideProfile, availableDates: dates })
                      }
                      disabled={!isEditingTourGuide}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          )}
          {isTourGuide && (
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Các tour du lịch</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">+ Thêm Tour</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl w-full h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Thêm Tour mới</DialogTitle>
                    </DialogHeader>
                    {/* Form thêm tour */}
                    <AddTourForm refreshTours={refreshTours}  />
                      
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {toursLoading ? (
                  <p className="text-muted-foreground">Đang load các tour...</p>
                ) : (
                  <ToursList refreshTours={refreshTours} tours={tours} />
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}