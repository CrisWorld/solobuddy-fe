"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleClick = () => {
    // Nếu có message, truyền qua URL params
    if (message.trim()) {
      router.push(`/chat?message=${encodeURIComponent(message)}`)
    } else {
      router.push("/chat")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute ">
        <div className="absolute top-20 left-10 w-8 h-8 text-yellow-300 opacity-60">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 text-orange-300 opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 w-4 h-4 text-yellow-400 opacity-50">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute top-60 right-10 w-12 h-12 text-orange-200 opacity-30">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Khám phá thế giới
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Khám phá những kỳ quan thế giới, từng hành trình một mình
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Sống tự do. Khám phá điều mới lạ. Du lịch một mình, tận hưởng trọn vẹn.
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Bạn cân gợi ý gì hôm nay?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-12 text-base"
                  />
                </div>
                <Button 
                  className="h-12 px-8 bg-black hover:bg-black/90 text-white rounded-full" 
                  onClick={handleClick}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gợi ý từ AI
                </Button>
              </div>
            </div>

          </div>

          <div className="relative">
            <div className="relative z-10">
              <img src="/anh-bia-du-lich-o-da-lat.jpg" alt="Người đi du lịch một mình" className="w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      
    </section>
  )
}