'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useCreateReviewMutation } from "@/stores/services/review/review"
import type { Booking } from "@/stores/types/types"
import { useApp } from "@/lib/app-context"

export default function ReviewDialog({ booking }: { booking: Booking }) {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [createReview, { isLoading }] = useCreateReviewMutation()
  const {showToast} = useApp();

  const handleSubmit = async () => {
    try {
      await createReview({
        bookingId: booking.id!,
        guideId: booking.guideSnapshot.guideid,
        rating,
        comment
      }).unwrap()
      setOpen(false)
      setRating(0)
      setComment("")
      showToast("Gửi đánh giá thành công!","success")
    } catch (error) {
      console.error(error)
      showToast("Gửi đánh giá thất bại, vui lòng thử lại.","error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        >
          <Star className="h-4 w-4 mr-2" /> Đánh giá Hướng dẫn viên
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá hướng dẫn viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                className={`w-7 h-7 cursor-pointer transition-colors ${
                  num <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
          >
            {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
