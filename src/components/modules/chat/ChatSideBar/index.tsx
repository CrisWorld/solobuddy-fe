"use client"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, MapPin, Heart, Route, User, LogOut } from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { useAuth } from "@/components/layout/AuthLayout"
import { useEffect, useState } from "react"

export function ChatSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, openLogin } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // tránh render mismatch SSR/CSR
    return null
  }

  // define all menu items
  const menuItems = [
    { id: "chat", label: "Trợ lý AI", icon: MessageCircle, href: "/chat" },
    { id: "tour-guide", label: "Hướng dẫn viên", icon: MapPin, href: "/tour-guides" },
    {
      id: "favourite",
      label: "Yêu thích",
      icon: Heart,
      href: "/favourite",
      roles: ["user"], // chỉ cho user
    },
    {
      id: "journey",
      label: "Danh sách đặt Tour",
      icon: Route,
      href: "/bookings-history",
      roles: ["user", "guide"], // cho user & guide
    },
  ]

  // filter theo role
  const visibleMenu = menuItems.filter((item) => {
    if (!item.roles) return true // không giới hạn role
    if (!user) return false // chưa login thì không thấy
    return item.roles.includes(user.role)
  })

  return (
    <div className="w-64 bg-white border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Logo textClass="text-foreground" />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {visibleMenu.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10"
                onClick={() => !isActive && router.push(item.href)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Avatar className="h-8 w-8">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.name || "Traveler"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || "T"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">
                {user?.name || "Traveler"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user && (
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Hồ sơ cá nhân
              </DropdownMenuItem>
            )}
            {user ? (
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={openLogin}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng nhập
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
