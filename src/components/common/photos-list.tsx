"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { PhotoZoomModal } from "./photo-modal"

interface PhotoCarouselProps {
  photos: string[]
  photosPerPage?: number
}

export function PhotoCarousel({ photos, photosPerPage = 6 }: PhotoCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  const totalPages = Math.ceil(photos.length / photosPerPage)
  const startIndex = currentPage * photosPerPage
  const visiblePhotos = photos.slice(startIndex, startIndex + photosPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(startIndex + index)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Photos</h3>
          <span className="text-sm text-muted-foreground">({photos.length})</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={totalPages <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={totalPages <= 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {visiblePhotos.map((photo, index) => (
          <div
            key={startIndex + index}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePhotoClick(index)}
          >
            <img
              src={photo || "/default-avatar.png"}
              alt={`Photo ${startIndex + index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <PhotoZoomModal
          photos={photos}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
          initialIndex={selectedPhotoIndex}
        />
      )}
    </div>
  )
}
