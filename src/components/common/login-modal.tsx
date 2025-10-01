"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/stores/services/auth/auth";
import { useApp } from "@/lib/app-context";
import { motion } from "framer-motion";
import { useAuth } from "../layout/AuthLayout";

interface LoginModalProps {
  isOpen: boolean;
  onSwitchToSignUp: () => void;
}

export function LoginModal({ isOpen, onSwitchToSignUp }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [shake, setShake] = useState(false);

  const { showToast } = useApp();
  const [login, { isLoading }] = useLoginMutation();
  const { closeLogin } = useAuth();

  // Reset form
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setShake(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    closeLogin();
    resetForm();
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value: string) =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);

  const handleLogin = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    } else setEmailError("");

    if (!validatePassword(password)) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự, gồm cả chữ và số");
      valid = false;
    } else setPasswordError("");

    if (!valid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      setUser(result.user);
      showToast(`Chào mừng ${result.user.name}!`, "success");
      handleClose();
    } catch (error: any) {
      showToast(error?.data?.message || "Đăng nhập thất bại", "error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Đăng nhập
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              {"Chưa có tài khoản? "}
              <button
                onClick={onSwitchToSignUp}
                className="text-blue-500 hover:underline"
              >
                Đăng ký
              </button>
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <button className="text-sm text-blue-500 hover:underline">
                Quên mật khẩu?
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
