"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MapPin, Shield } from "lucide-react"

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI thông minh",
      desc: "SoloBuddy dùng AI để gợi ý hành trình cá nhân hóa, giúp bạn tiết kiệm thời gian và có trải nghiệm phù hợp."
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Hướng dẫn viên bản địa",
      desc: "Kết nối với hướng dẫn viên giàu kinh nghiệm, am hiểu địa phương để mang lại trải nghiệm chân thực."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "An tâm & Tự tin",
      desc: "Dù đi một mình, bạn luôn có sự hỗ trợ từ công nghệ và chuyên gia để chuyến đi an toàn, thú vị."
    },
  ]

  return (
    <section className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Tại sao chọn SoloBuddy?</h2>
      <p className="text-muted-foreground mb-10">
        Không chỉ là nền tảng đặt tour – SoloBuddy là người bạn đồng hành,
        mang đến cho bạn sự tự do, an toàn và trải nghiệm khó quên.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {reasons.map((reason, index) => (
          <Card key={index} className="p-6 text-left">
            <CardHeader className="flex flex-col items-start space-y-2">
              {reason.icon}
              <CardTitle>{reason.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{reason.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
