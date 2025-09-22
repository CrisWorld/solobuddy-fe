"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Star, MapPin, Heart } from "lucide-react"
import { useApp } from "@/lib/app-context"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
  tourGuides?: TourGuide[]
}

interface TourGuide {
  id: number
  name: string
  location: string
  price: string
  rating: number
  languages: string[]
  specialties: string[]
  avatar: string
}

export function ChatContent() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "user",
      content: "I'd love a beach destination, but not too crowded. Beautiful scenery and good food are a must.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: 2,
      type: "ai",
      content:
        "Great! Based on what you shared — you're interested in local history, photography, and trying local food — I've found a few tour guides who are a perfect match for you! 🌴\n\nHere are some guides you might enjoy exploring with: 👇",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      tourGuides: [
        {
          id: 1,
          name: "Do En Nguyen",
          location: "Da Nang",
          price: "49.92$ per day",
          rating: 4.56,
          languages: ["Vietnamese", "English"],
          specialties: ["Photography", "Food", "History"],
          avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
        },
        {
          id: 2,
          name: "Nguyen Truong Giang",
          location: "Da Nang",
          price: "49.92$ per day",
          rating: 4.52,
          languages: ["Vietnamese", "English"],
          specialties: ["Photography", "Food", "History"],
          avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
        },
      ],
    },
  ])

  const { favouriteGuides, toggleFavourite } = useApp()

  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const responses = [
      "That sounds like a wonderful adventure! Let me find some tour guides who specialize in those areas.",
      "I understand you're looking for something unique. Here are some recommendations based on your preferences.",
      "Perfect! I can help you find the ideal tour guide for that experience.",
      "Great choice! Let me search for guides who can provide exactly what you're looking for.",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const newAIMessage: Message = {
      id: Date.now(),
      type: "ai",
      content: randomResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newAIMessage])
    setIsLoading(false)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const newUserMessage: Message = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setMessage("")

    await simulateAIResponse(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            New chat
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-white rounded-lg p-4 max-w-md shadow-sm">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/images/coconut-logo.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Tour Guide Cards */}
                    {msg.tourGuides && (
                      <div className="mt-4 space-y-4">
                        {msg.tourGuides.map((guide) => (
                          <Card key={guide.id} className="bg-white shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={guide.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {guide.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-semibold text-foreground">{guide.name}</h3>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {guide.location}
                                        <span className="mx-2">•</span>
                                        <span>{guide.price}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">{guide.rating}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleFavourite(guide.id)}
                                        className="h-8 w-8"
                                      >
                                        <Heart
                                          className={`h-4 w-4 ${
                                            favouriteGuides.includes(guide.id)
                                              ? "fill-red-500 text-red-500"
                                              : "text-gray-400"
                                          }`}
                                        />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {guide.languages.map((lang) => (
                                      <Badge key={lang} variant="secondary" className="text-xs">
                                        {lang}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {guide.specialties.map((specialty) => (
                                      <Badge key={specialty} variant="outline" className="text-xs">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex justify-end mt-3">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                      Detail
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="/images/coconut-logo.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type '/' for commands"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
