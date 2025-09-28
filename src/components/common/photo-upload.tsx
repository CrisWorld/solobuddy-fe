"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, ImageIcon, Loader2 } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloundinary"

interface PhotoUploadProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  disabled?: boolean
  maxPhotos?: number
}

export function PhotoUpload({ photos, onPhotosChange, disabled, maxPhotos = 10 }: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState<string[]>([]) // list các URL tạm đang upload

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || disabled) return

    for (const file of Array.from(files)) {
      const tempUrl = URL.createObjectURL(file) // tạm để hiển thị trước
      setUploading((prev) => [...prev, tempUrl])

      const url = await uploadToCloudinary(file)
      setUploading((prev) => prev.filter((u) => u !== tempUrl))

      if (url) {
        const updatedPhotos = [...photos, url].slice(0, maxPhotos)
        onPhotosChange(updatedPhotos)
      }
    }
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(updatedPhotos)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!disabled && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          } ${disabled ? "opacity-50" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag and drop photos here, or click to select
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="photo-upload"
              disabled={disabled}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={disabled || photos.length >= maxPhotos}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Photos
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {photos.length}/{maxPhotos} photos
            </p>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {(photos.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Hiển thị ảnh đã upload */}
          {photos.map((photo, index) => (
            <div key={`photo-${index}`} className="relative group">
              <img
                src={photo || "/placeholder.svg"}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              {!disabled && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}

          {/* Hiển thị ảnh đang upload */}
          {uploading.map((tempUrl, index) => (
            <div key={`uploading-${index}`} className="relative">
              <img
                src={tempUrl}
                alt="Uploading..."
                className="w-full h-24 object-cover rounded-lg border opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
