"use client"

import { useAuth } from "@/components/layout/AuthLayout"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoading) return // 🔸 đợi load user xong

    if (!user || (roles && !roles.includes(user.role))) {
      router.replace("/forbidden")
    } else {
      setIsChecking(false)
    }
  }, [user, roles, router, isLoading])

  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
