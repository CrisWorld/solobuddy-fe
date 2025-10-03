"use client"

import { createContext, useContext, useEffect, useState } from "react"
import webLocalStorage from "@/lib/webLocalStorage"
import { LoginModal } from "@/components/common/login-modal"
import { RegisterModal } from "@/components/common/signup-modal"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  country?: string
  phone?: string
  isEmailVerified: boolean
} | null

interface AuthContextProps {
  user: User
  setUser: (user: User) => void
  logout: () => void

  // modal state
  isLoginOpen: boolean
  isRegisterOpen: boolean
  openLogin: () => void
  openRegister: () => void
  closeLogin: () => void
  closeRegister: () => void
  updateUser: (user: User) => void
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const storedUser = webLocalStorage.get("user")
    setUser(storedUser)
  }, [])

  const updateUser = (user: User) => {
    setUser(user)
    webLocalStorage.set("user", user)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("tokens")
    setUser(null)
    router.push("/")
  }

  const openLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const openRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }
  const closeLogin = () => setIsLoginOpen(false)
const closeRegister = () => setIsRegisterOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isLoginOpen,
        isRegisterOpen,
        openLogin,
        openRegister,
        closeLogin,
        closeRegister,
        updateUser,
      }}
    >
      {children}

      {/* Mount modals global */}
      <LoginModal
        isOpen={isLoginOpen}
        onSwitchToSignUp={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onSwitchToLogin={openLogin}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
