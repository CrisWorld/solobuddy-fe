"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Star, MapPin, Heart, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { SuggestionCard } from "@/components/common/suggestion-card"
import { TourGuide } from "@/stores/types/types"
import { usePostAnswerMutation } from "@/stores/services/ai/gemini"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
  tourGuides?: TourGuide[]
}

export function ChatContent() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [expandedResponses, setExpandedResponses] = useState<{ [key: number]: boolean }>({})

  const [postAnswer] = usePostAnswerMutation()
  const { favouriteGuides, toggleFavourite } = useApp()

  const toggleExpanded = (messageId: number) => {
    setExpandedResponses(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const messageHistory = messages
        .filter(msg => msg.type === "user")
        .map(msg => ({
          role: "user",
          text: msg.content
        }))

      messageHistory.push({
        role: "user",
        text: message
      })

      const response = await postAnswer({
        messages: messageHistory
      }).unwrap()

      const aiMessage: Message = {
        id: Date.now(),
        type: "ai",
        content: response.response.response_text,
        timestamp: new Date(),
        tourGuides: response.guides.mappedResults
      }
      setMessages(prev => [...prev, aiMessage])

      setExpandedResponses(prev => ({
        ...prev,
        [aiMessage.id]: false
      }))

    } catch (error) {
      console.error("Failed to get AI response:", error)
      const errorMessage: Message = {
        id: Date.now(),
        type: "ai",
        content: "Xin lỗi, tôi gặp sự cố. Vui lòng thử lại.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setExpandedResponses({});
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f5f7fb]">
      {/* Header */}
      <div className="bg-white border-b border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Trợ lý AI</h1>
          <Button
            variant="outline"
            className="gap-2 bg-transparent hover:bg-gray-50"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            Cuộc trò chuyện mới
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Welcome Banner */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">
                Chào mừng đến với SoloBuddy Assistant!
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Tôi ở đây để giúp bạn tìm hướng dẫn viên du lịch phù hợp nhất.  
                Hãy hỏi tôi về địa điểm, ngôn ngữ, chuyên môn, hoặc yêu cầu cụ thể!
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium mb-2">Bạn có thể thử hỏi:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>"Tìm hướng dẫn viên nói tiếng Anh ở Việt Nam"</p>
                  <p>"Tôi cần hướng dẫn viên chuyên về tour ẩm thực"</p>
                  <p>"Hiển thị hướng dẫn viên có kinh nghiệm trên 5 năm"</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl py-2 px-4 max-w-[60%] shadow-sm">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0 ring-2 ring-primary/10">
                    <AvatarImage src="/images/coconut-logo.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-[60%]">
                    <div className="bg-white rounded-2xl py-2 px-4 shadow-sm">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {msg.tourGuides && msg.tourGuides.length > 0 && (
                      <div className="mt-3">
                        {msg.tourGuides.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mb-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => toggleExpanded(msg.id)}
                          >
                            {expandedResponses[msg.id] ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Thu gọn
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Xem tất cả {msg.tourGuides.length} gợi ý
                              </>
                            )}
                          </Button>
                        )}

                        <div className="space-y-3">
                          {msg.tourGuides
                            .slice(0, expandedResponses[msg.id] ? undefined : 2)
                            .map((guide) => (
                              <SuggestionCard
                                key={guide.id}
                                guide={guide}
                                favouriteGuides={favouriteGuides}
                                toggleFavourite={toggleFavourite}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0 ring-2 ring-primary/10">
                <AvatarImage src="/images/coconut-logo.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-white rounded-2xl py-2 px-4 shadow-sm w-fit">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border p-4 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Hãy hỏi tôi bất kỳ điều gì về hướng dẫn viên..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-full bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
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
