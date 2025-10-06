"use client"

import { createContext, useContext, useEffect, useState } from "react"
import webLocalStorage from "@/lib/webLocalStorage"
import { LoginModal } from "@/components/common/login-modal"
import { RegisterModal } from "@/components/common/signup-modal"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRefreshTokenMutation } from "@/stores/services/auth/auth"
import cookieStorageClient from "@/lib/cookieStorageClient"
import { clearTokenCache } from "@/stores/services/base"

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
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(true) 
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  // --- session expired handling ---
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => Promise<any>) | null>(null)
  const [refreshToken, { isLoading: isRefreshing }] = useRefreshTokenMutation()

  useEffect(() => {
    ;(window as any).authContextRef = {
      setIsSessionExpired,
      setPendingAction,
    }
  }, [])

  const router = useRouter()

  useEffect(() => {
    const storedUser = webLocalStorage.get("user")
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false) // Khi đã đọc xong localStorage
  }, [])

  const updateUser = (user: User) => {
    setUser(user)
    webLocalStorage.set("user", user)
  }

  const logout = () => {
    setIsSessionExpired(false)
    setPendingAction(null)
    localStorage.removeItem("user")
    cookieStorageClient.removeAll()
    clearTokenCache()
    setUser(null)
    setIsLoading(true)
    router.push("/")
  }

  const handleContinue = async () => {
    try {
      const res = await refreshToken().unwrap()

      if (res.access?.token) {
        await cookieStorageClient.set("token", res.access.token)
        if (res.access?.expires) {
          await cookieStorageClient.set("token-expiry", res.access.expires)
        }
        clearTokenCache()
        await new Promise(resolve => setTimeout(resolve, 100))

        setIsSessionExpired(false)
        if (pendingAction) {
          await pendingAction()
          setPendingAction(null)
        }
      } else {
        console.error("No access token in response")
        handleLogout()
      }
    } catch (err) {
      console.error("Refresh token failed", err)
      handleLogout()
    }
  }

  const handleLogout = () => {    
    logout()
  }

  const openLogin = () => {
    setIsLoading(false)
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
        isLoading, 
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
      <LoginModal isOpen={isLoginOpen} onSwitchToSignUp={openRegister} />
      <RegisterModal isOpen={isRegisterOpen} onSwitchToLogin={openLogin} />

      {/* Session expired modal */}
      <Dialog open={isSessionExpired} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phiên đăng nhập đã hết hạn</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-2">
            Bạn có muốn tiếp tục phiên làm việc không?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleLogout} disabled={isRefreshing}>
              Đăng xuất
            </Button>
            <Button onClick={handleContinue} disabled={isRefreshing}>
              {isRefreshing ? "Đang xử lý..." : "Tiếp tục"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
