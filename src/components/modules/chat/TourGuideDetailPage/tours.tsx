"use client"

import TourDescription from "@/components/common/tour-description"
import { Card, CardContent } from "@/components/ui/card"
import {  formatPrice } from "@/lib/utils"
import { Tour } from "@/stores/services/tour-guide/tour-guide"

interface TourGuideToursProps {
  tours: Tour[]
}

export function TourGuideTours({ tours }: TourGuideToursProps) {
  if (!tours || tours.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6">Các tour cung cấp</h3>
          <p className="text-muted-foreground">Hiện tại chưa có tour nào.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-6">Các tour cung cấp</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="aspect-video bg-gray-100">
                <img
                  src={tour.image || "da-nang-city-view-.jpg"}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-foreground mb-2">{tour.title}</h4>
                <TourDescription description={tour.description} />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Thời lượng: {tour.duration}</div>
                  <div className="text-sm font-bold text-foreground">
                    {formatPrice(tour.price)} {tour.unit && `/ người`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
