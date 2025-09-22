"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Heart, MapPin, DollarSign } from "lucide-react"

export interface TourGuideData {
  id: number
  name: string
  rating: number
  reviews?: number
  location: string
  availability?: string
  availabilityColor?: string
  timeSlot?: string
  price: number | string
  image?: string
  avatar?: string
  languages: string[]
  specialties: string[]
  description?: string
}

interface TourGuideCardProps {
  guide: TourGuideData
  variant?: "grid" | "list"
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onViewDetails?: (id: number) => void
  onBookNow?: (id: number) => void
}

export function TourGuideCard({
  guide,
  variant = "grid",
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
  onBookNow,
}: TourGuideCardProps) {
  const formatPrice = (price: number | string) => {
    if (typeof price === "string") return price
    return `$${price.toFixed(2)}`
  }

  const getAvailabilityDot = () => {
    if (!guide.availability || !guide.availabilityColor) return null
    return <div className={`w-2 h-2 rounded-full bg-${guide.availabilityColor}-500`}></div>
  }

  if (variant === "grid") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={guide.image || guide.avatar || "/placeholder.svg"}
            alt={guide.name}
            className="w-full h-64 object-cover"
          />

          {/* Time slot badge */}
          {guide.timeSlot && (
            <div className="absolute top-4 left-4">
              <Badge
                variant="secondary"
                className={`${
                  guide.timeSlot.includes("08:00")
                    ? "bg-green-100 text-green-800"
                    : guide.timeSlot.includes("07:00")
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                }`}
              >
                {guide.timeSlot}
              </Badge>
            </div>
          )}

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(guide.id)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>
          )}

          {/* Rating badge */}
          <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{guide.rating}</span>
              {guide.reviews && <span className="text-xs text-muted-foreground">({guide.reviews} reviews)</span>}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{guide.name}</h3>

              {/* Availability and location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {getAvailabilityDot()}
                {guide.availability && <span>{guide.availability}</span>}
                <MapPin className="w-4 h-4 ml-2" />
                <span>{guide.location}</span>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-1 mb-2">
                {guide.languages.map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>

              {/* Specialties */}
              {guide.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guide.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xl font-bold text-foreground">{formatPrice(guide.price)}</span>
                {typeof guide.price === "number" && <span className="text-sm text-muted-foreground">/ day</span>}
              </div>
              <Button variant="outline" size="sm" onClick={() => onViewDetails?.(guide.id)}>
                Detail
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // List variant
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={guide.avatar || guide.image || "/placeholder.svg"} />
            <AvatarFallback>
              {guide.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground truncate">{guide.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{guide.location}</span>
                </div>
              </div>

              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(guide.id)}
                  className="h-8 w-8 flex-shrink-0"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{guide.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm font-medium text-primary">{formatPrice(guide.price)}</span>
            </div>

            {guide.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{guide.description}</p>
            )}

            <div className="flex flex-wrap gap-1 mt-3">
              {guide.languages.slice(0, 2).map((lang) => (
                <Badge key={lang} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
              {guide.languages.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{guide.languages.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {guide.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onViewDetails?.(guide.id)}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
