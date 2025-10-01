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
      newErrors.name = "Vui lòng nhập tên."
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Vui lòng nhập email hợp lệ."
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) {
      newErrors.password = "Mật khẩu phải ít nhất 8 ký tự, gồm cả chữ và số."
    }
    if (!form.confirm) {
      newErrors.confirm = "Vui lòng nhập lại mật khẩu."
    } else if (form.password !== form.confirm) {
      newErrors.confirm = "Mật khẩu không khớp."
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
      showToast(`Chào mừng ${form.name}!`, "success")
      window.location.reload();
      handleClose()
    } catch (error: any) {
      showToast(error?.data?.message || "Đăng ký thất bại", "error")
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
            <DialogTitle className="text-2xl font-bold text-center">Đăng ký</DialogTitle>
            <p className="text-center text-muted-foreground">
              Đã có tài khoản?{" "}
              <button onClick={onSwitchToLogin} className="text-blue-500 hover:underline">
                Đăng nhập
              </button>
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Tên */}
            <div className="space-y-1">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                placeholder="Nhập họ và tên"
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
                placeholder="Nhập email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
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

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1">
              <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
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
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
