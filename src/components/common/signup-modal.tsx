"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useRegisterMutation } from "@/stores/services/auth/auth"
import { useApp } from "@/lib/app-context"
import { motion } from "framer-motion"
import { useAuth } from "../layout/AuthLayout"

interface RegisterModalProps {
  isOpen: boolean
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onSwitchToLogin }: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { setUser } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({})
  const [register, { isLoading }] = useRegisterMutation()
  const { showToast } = useApp()
  const [shake, setShake] = useState(false)
  const { closeRegister } = useAuth()
  const resetForm = () => {
    setForm({ name: "", email: "", password: "", confirm: "" })
    setErrors({})
    setShowPassword(false)
    setShowConfirm(false)
    setShake(false)
  }

  const handleClose = () => {
    closeRegister()
    resetForm()
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!form.name.trim()) {
      newErrors.name = "Name is required."
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password)) {
      newErrors.password = "Password must be at least 8 characters, with letters and numbers."
    }
    if (!form.confirm) {
      newErrors.confirm = "Please confirm your password."
    } else if (form.password !== form.confirm) {
      newErrors.confirm = "Passwords do not match."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return false
    }

    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    try {
      const result = await register({ name: form.name, email: form.email, password: form.password }).unwrap()
      setUser(result.user)
      showToast(`Welcome ${form.name}!`, "success")
      handleClose()
    } catch (error: any) {
      showToast(error?.data?.message || "Registration failed", "error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Register</DialogTitle>
            <p className="text-center text-muted-foreground">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="text-blue-500 hover:underline">
                Login
              </button>
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className={`w-full pr-10 ${errors.confirm ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-sm text-red-500">{errors.confirm}</p>}
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
