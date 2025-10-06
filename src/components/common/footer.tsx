import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo textClass="text-white" />
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Khám phá những gợi ý địa phương để có trải nghiệm chân thực và đáng nhớ.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-gray-300">Cần hỗ trợ? Gọi ngay</span>
            </div>
            <div className="text-2xl font-bold text-primary">0961623771</div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Công ty</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Dịch vụ</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hướng dẫn viên
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Đặt lịch hẹn 
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Trợ lý AI
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Pháp lý</h3>
            <ul className="grid grid-cols-2 gap-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách Cookie
                </a>
              </li>
            </ul>
          </div>
        </div>      

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-800">
          <div className="text-gray-400 text-sm">© 2025 SoloBuddy Inc.</div>
          <div className="text-gray-400 text-sm mt-4 lg:mt-0">Theo dõi chúng tôi</div>
        </div>
      </div>
    </footer>
  )
}
