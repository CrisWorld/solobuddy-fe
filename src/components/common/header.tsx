"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Globe, Menu, X } from "lucide-react"
import { LoginModal } from "./login-modal"
import { SignUpModal } from "./signup-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image src="/images/coconut-logo.png" alt="SoloBuddy" width={40} height={40} className="rounded-full" />
              <span className="text-xl font-bold text-foreground">SoloBuddy</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                <span>Home</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                <span>Tours</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                <span>Destinations</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                <span>Pages</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                <span>Blog</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <span className="cursor-pointer hover:text-primary">Contact</span>
            </nav>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setIsLoginOpen(true)}
                className="text-foreground hover:text-primary"
              >
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border">
              <nav className="flex flex-col gap-4 pt-4">
                <span className="cursor-pointer hover:text-primary">Home</span>
                <span className="cursor-pointer hover:text-primary">Tours</span>
                <span className="cursor-pointer hover:text-primary">Destinations</span>
                <span className="cursor-pointer hover:text-primary">Pages</span>
                <span className="cursor-pointer hover:text-primary">Blog</span>
                <span className="cursor-pointer hover:text-primary">Contact</span>
                <Button
                  variant="ghost"
                  onClick={() => setIsLoginOpen(true)}
                  className="justify-start text-foreground hover:text-primary"
                >
                  Signin
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginOpen(false)
          setIsSignUpOpen(true)
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </>
  )
}
