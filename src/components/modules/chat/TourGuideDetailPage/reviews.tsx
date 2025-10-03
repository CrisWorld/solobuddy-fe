"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { format } from "date-fns"
import { Review } from "@/stores/services/review/review"

interface TourGuideReviewsProps {
  reviews: Review[]
  ratingAvg: number
  ratingCount: number
}

export function TourGuideReviews({ reviews, ratingAvg, ratingCount }: TourGuideReviewsProps) {
  // Calculate rating distribution for the breakdown
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => Math.floor(review.rating) === rating).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Reviews ({ratingCount})</h3>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-foreground">{ratingAvg.toFixed(2)}</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.floor(ratingAvg) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2 mb-6">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-2">{rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="text-xs text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <img
                    src={review.traveler?.avatar || "/default-avatar.png"}
                    alt={review.traveler?.name}
                    className="h-10 w-10 object-cover"
                  />
                  <AvatarFallback>
                    {review.traveler?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.traveler?.name || "Anonymous"}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Chưa có đánh giá nào.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
