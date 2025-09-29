"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-600">
              Your booking has been confirmed.
            </p>
          </div>

          <Button
            onClick={() => router.push("/bookings-history")}
            className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 py-3"
          >
            View Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
