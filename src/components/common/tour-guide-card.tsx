"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Heart, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatLanguage, formatLocation, formatPrice, formatSpecialty } from "@/lib/utils"

export interface TourGuideData {
    id: string
    name: string
    rating: number
    reviews?: number
    location: string
    price: number // giữ dạng number để format
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
    onToggleFavorite?: (id: string) => void
}

export function TourGuideCard({
    guide,
    variant = "grid",
    isFavorite = false,
    onToggleFavorite
}: TourGuideCardProps) {
    const router = useRouter();
    const handleDetailClick = (id: string) => {
        router.push(`/tour-guides/${id}`);
    }
    if (variant === "grid") {
        return (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-2xl p-0">
                <div className="relative">
                    <img
                        src={guide.image || guide.avatar || "/placeholder.svg"}
                        alt={guide.name}
                        className="w-full h-60 object-cover"
                    />

                    {/* Favorite button */}
                    {onToggleFavorite && (
                        <button
                            onClick={() => onToggleFavorite(guide.id)}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition"
                        >
                            <Heart
                                className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                                    }`}
                            />
                        </button>
                    )}

                    {/* Rating badge */}
                    <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{guide.rating}</span>
                            {guide.reviews && (
                                <span className="text-xs text-muted-foreground">
                                    ({guide.reviews})
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <CardContent className="p-4 space-y-3 relative">
                    {/* Name + price */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-1">
                            {guide.name}
                        </h3>
                        <span className="text-base font-bold text-foreground">
                            {formatPrice(guide.price)+"/day"}
                        </span>
                    </div>

                    {/* Availability + location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 ml-2" />
                        <span>{formatLocation(guide.location)}</span>
                    </div>

                    {/* Languages */}
                    {guide.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {guide.languages.map((lang, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-[11px] px-2 py-0.5"
                                >
                                    {formatLanguage(lang)}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Specialties */}
                    {guide.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {guide.specialties.map((specialty, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-[11px] px-2 py-0.5"
                                >
                                    {formatSpecialty(specialty)}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Detail button - fixed ở góc phải dưới */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-3 right-3 
                    hover:bg-primary hover:text-primary-foreground 
                    hover:shadow-md hover:scale-105 
                    active:scale-95 active:shadow-sm 
                    transition-all duration-200"
                        onClick={() => handleDetailClick(guide.id)}
                    >
                        Detail
                    </Button>

                </CardContent>
            </Card>
        )
    }

    // List variant giữ nguyên, chỉ đổi format giá
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
                                    <span className="truncate">{formatLocation(guide.location)}</span>
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
                            <span className="text-sm font-medium text-primary">{formatPrice(guide.price)+"/day"}</span>
                        </div>

                        {guide.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{guide.description}</p>
                        )}

                        <div className="flex flex-wrap gap-1 mt-3">
                            {guide.languages.slice(0, 2).map((lang) => (
                                <Badge key={lang} variant="secondary" className="text-xs">
                                    {formatLanguage(lang)}
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
                                    {formatSpecialty(specialty)}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button
                                size="sm"
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => handleDetailClick(guide.id)}
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
