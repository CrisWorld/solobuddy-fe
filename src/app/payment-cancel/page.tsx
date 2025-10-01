"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PaymentCancelledPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán bị hủy</h1>
            <p className="text-gray-600">Đơn đặt Tour của bạn đã bị hủy.</p>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 py-3"
          >
            Trở về trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
