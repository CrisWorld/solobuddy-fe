"use client"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, MapPin, Heart, Route, User, LogOut } from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { useAuth } from "@/components/layout/AuthLayout"

export function ChatSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, openLogin } = useAuth()

  const menuItems = [
    { id: "chat", label: "Chat", icon: MessageCircle, href: "/chat" },
    { id: "tour-guide", label: "Tour guide", icon: MapPin, href: "/tour-guides" },
    { id: "favourite", label: "Favourite", icon: Heart, href: "/favourite" },
    { id: "journey", label: "Bookings", icon: Route, href: "/bookings-history" },
  ]

  return (
    <div className="w-64 bg-white border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Logo textClass="text-foreground" />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
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
              <Avatar className="h-6 w-6">
                <Image
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.name || "Traveler"}
                  width={24}
                  height={24}
                  className="rounded-full"
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
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            {user ? (
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={openLogin}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign In
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
