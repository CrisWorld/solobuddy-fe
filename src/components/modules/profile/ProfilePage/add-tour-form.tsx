"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloundinary"
import { Editor } from "@tinymce/tinymce-react"
import { constants } from "@/config"
import { useCreateTourMutation } from "@/stores/services/tour-guide/tour-guide"
import { useApp } from "@/lib/app-context"

export interface Tour {
  id: string
  deleted: boolean
  title: string
  description: string
  image?: string
  price: number
  duration: string
  guideId: string
  unit?: string
}

export interface AddTourFormData {
  title: string
  description: string
  image?: string
  price: number
  duration: string
}

export function AddTourForm() {
  const [createTour, { isLoading: isSubmitting }] = useCreateTourMutation()
  const {showToast} = useApp()
  
  const [formData, setFormData] = useState<AddTourFormData>({
    title: "",
    description: "",
    image: undefined,
    price: 0,
    duration: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setImageFile(file)

    // Upload to Cloudinary
    setIsUploadingImage(true)
    try {
      const url = await uploadToCloudinary(file)
      if (url) {
        setFormData({ ...formData, image: url })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      showToast("Không thể tải hình ảnh. Vui lòng thử lại!",  "error" )
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData({ ...formData, image: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const tourData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        image: formData.image || undefined,
        duration: formData.duration,
        unit: "person"
      }

      const result = await createTour(tourData).unwrap()
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        image: undefined,
        price: 0,
        duration: "",
      })
      setImageFile(null)
      setImagePreview(null)
    } catch (error: any) {
      console.error("Error creating tour:", error)
      showToast(error?.data?.message || "Không thể thêm tour. Vui lòng thử lại!", "error")
    }
  }

  const isFormValid = formData.title && formData.description && formData.price > 0 && formData.duration

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Tên tour <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nhập tên tour"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Hình ảnh</Label>
        {!imagePreview ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="tour-image-upload"
              disabled={isUploadingImage || isSubmitting}
            />
            <label htmlFor="tour-image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                {isUploadingImage ? (
                  <>
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    <p className="text-sm text-muted-foreground">Đang tải lên...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nhấp để tải lên hoặc kéo thả hình ảnh</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF tối đa 10MB</p>
                  </>
                )}
              </div>
            </label>
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Tour preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage || isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description with TinyMCE */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Mô tả <span className="text-destructive">*</span>
        </Label>
        <Editor
          apiKey={constants.TINYMCE_API_KEY}
          value={formData.description}
          onEditorChange={(content) => setFormData({ ...formData, description: content })}
          disabled={isSubmitting}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Giá (VNĐ/người) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="1000"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          placeholder="0"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration">
          Thời lượng <span className="text-destructive">*</span>
        </Label>
        <Input
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="Ví dụ: 3 ngày 2 đêm"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!isFormValid || isSubmitting || isUploadingImage}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Thêm Tour"
          )}
        </Button>
      </div>
    </form>
  )
}