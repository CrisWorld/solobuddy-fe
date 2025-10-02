"use client"

import { Card, CardContent } from "@/components/ui/card"
import { decodeHtml, formatPrice } from "@/lib/utils"
import { Tour, useDeleteTourMutation } from "@/stores/services/tour-guide/tour-guide"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { UpdateTourForm } from "./update-tour-form"

interface TourGuideToursProps {
    tours: Tour[]
    refreshTours: () => Promise<void>
}

export function ToursList({ tours, refreshTours }: TourGuideToursProps) {
    const [deleteTour] = useDeleteTourMutation()
    const { showToast } = useApp()
    const [deletingId, setDeletingId] = useState<string | null>(null)

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

    const handleDelete = async (id: string) => {
        try {
            const res = await deleteTour(id).unwrap()
            if (res?.success) {
                showToast("Xóa tour thành công!", "success")
                await refreshTours()
            } else {
                showToast("Không thể xóa tour. Vui lòng thử lại!", "error")
            }
        } catch (error: any) {
            console.error("Delete error:", error)
            showToast(error?.data?.message || "Không thể xóa tour. Vui lòng thử lại!", "error")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Các tour cung cấp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tours.map((tour) => (
                        <div key={tour.id} className="bg-white rounded-lg overflow-hidden shadow-sm border flex flex-col">
                            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={tour.image || "da-nang-city-view-.jpg"}
                                    alt={tour.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-medium text-foreground mb-2">{tour.title}</h4>
                                <div
                                    className="text-xs text-muted-foreground mb-3 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: decodeHtml(tour.description) }}
                                />
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-xs text-muted-foreground">Thời lượng: {tour.duration}</div>
                                    <div className="text-sm font-bold text-foreground">
                                        {formatPrice(tour.price)} {tour.unit && `/ người`}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto">
                                    {/* Update button with modal */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">Sửa</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-7xl w-full h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Cập nhật tour</DialogTitle>
                                            </DialogHeader>
                                            <UpdateTourForm
                                                tour={tour}
                                                onUpdated={async () => {
                                                    showToast("Cập nhật tour thành công!", "success")
                                                    await refreshTours()
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete button with confirm modal */}
                                    <Dialog open={deletingId === tour.id} onOpenChange={(open) => setDeletingId(open ? tour.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="destructive">Xóa</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Bạn có chắc muốn xóa tour này?</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex justify-end gap-3 mt-4">
                                                <Button variant="outline" onClick={() => setDeletingId(null)}>Hủy</Button>
                                                <Button variant="destructive" onClick={() => handleDelete(tour.id)}>Xóa</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
