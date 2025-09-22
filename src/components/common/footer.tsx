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
              Dive into local recommendations for a truly authentic experience.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-gray-300">Need help? Call us</span>
            </div>
            <div className="text-2xl font-bold text-primary">1-800-222-8888</div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Jobs & Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Our Awards
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tour Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tour Booking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hotel Booking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Ticket Booking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Rental Services
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Forum support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div>
            <h3 className="font-semibold text-lg mb-6">Legal</h3>
            <ul className="grid grid-cols-2 gap-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Data Processing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Data Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Newsletter</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-800">
          <div className="text-gray-400 text-sm">© 2024 Travlia inc. All rights reserved.</div>
          <div className="text-gray-400 text-sm mt-4 lg:mt-0">Follow us</div>
        </div>
      </div>
    </footer>
  )
}
