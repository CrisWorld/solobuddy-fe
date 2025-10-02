"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Logo } from "./Logo"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../layout/AuthLayout"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, openLogin } = useAuth()

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo textClass="text-foreground" />

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <span>{user.name}</span>
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />                  
                  <ChevronDown className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={openLogin}>
                Đăng nhập
              </Button>

            </>
          )}
          <Link href="/chat">
            <Button className="bg-primary text-white rounded-full px-6">
              Bắt đầu ngay
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-4 flex justify-between items-center border-b border-border">
                <Logo textClass="text-foreground" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        openLogin()
                        setIsMenuOpen(false)
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </>
                )}

                {/* Link khác (vd: Chat) */}
                <Link href="/chat" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full bg-primary text-white rounded-full px-6">
                    Bắt đầu ngay
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
