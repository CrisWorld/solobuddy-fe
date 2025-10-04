"use client"

import { useAuth } from "@/components/layout/AuthLayout"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[] // Optional array of roles that are allowed to access the route
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!user || (roles && !roles.includes(user.role))) {
      router.replace("/forbidden")
    } else {
      setIsChecking(false)
    }
  }, [user, roles, router])

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
