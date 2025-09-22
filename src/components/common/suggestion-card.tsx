"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { TourGuide } from "@/stores/types/types"
import { formatPrice } from "@/lib/utils"
interface SuggestionCardProps {
  guide: TourGuide
  favouriteGuides: number[]
  toggleFavourite: (id: number) => void
}

export function SuggestionCard({ guide, favouriteGuides, toggleFavourite }: SuggestionCardProps) {
  const router = useRouter()

  const handleDetail = () => {
    router.push(`/tour-guides/${guide.id}`)
  }

  return (
    <Card key={guide.id} className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={guide.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {guide.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{guide.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {guide.location}
                  <span className="mx-2">•</span>
                  <span>{formatPrice(guide.price)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{guide.rating}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavourite(guide.id)}
                  className="h-8 w-8"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favouriteGuides.includes(guide.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {guide.languages.map((lang) => (
                <Badge key={lang} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {guide.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleDetail}
              >
                Detail
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
