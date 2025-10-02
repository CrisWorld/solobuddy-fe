import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// export const formatPrice = (price: number) => {
//     return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
// }
export const createRegexPattern = (searchTerm: string): string => {
  return `.*${searchTerm.trim()}.*`;
};


export function decodeHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.documentElement.textContent || ""
}

// Backend constants (đã việt hóa giá trị)
export const vehicleTypes = [
  "car",
  "van",
  "bus",
  "motorcycle",
  "bicycle",
  "walking",
  "other",
]

export const specialtyTypes = [
  "historical-tours",
  "cultural-tours",
  "adventure-tours",
  "food-tours",
  "nature-tours",
  "city-tours",
  "museum-tours",
  "photography-tours",
  "religious-tours",
  "shopping-tours",
]

export const favourites = [
  "Photography",
  "Reading Books",
  "Cooking",
  "Hiking",
  "Cycling",
  "Listening to Music",
  "Traveling",
  "Swimming",
  "Drawing & Painting",
  "Yoga & Meditation",
]

export const languages = [
  "english",
  "vietnamese",
  "thai",
  "french",
  "spanish",
  "chinese",
  "japanese",
  "korean",
]

export const locations = [
  "vietnam",
  "thailand",
  "france",
  "spain",
  "china",
  "japan",
  "korea",
  "usa",
  "uk",
  "germany",
]

export const countries = [
  "vietnam",
  "thailand",
  "france",
  "spain",
  "china",
  "japan",
  "korea",
  "usa",
  "uk",
  "germany",
]

// Utility functions to format display text
export const formatSpecialty = (specialty: string): string => {
  if (!specialty) return ""
  const map: Record<string, string> = {
    "historical-tours": "Tour lịch sử",
    "cultural-tours": "Tour văn hoá",
    "adventure-tours": "Tour phiêu lưu",
    "food-tours": "Tour ẩm thực",
    "nature-tours": "Tour thiên nhiên",
    "city-tours": "Tour thành phố",
    "museum-tours": "Tour bảo tàng",
    "photography-tours": "Tour nhiếp ảnh",
    "religious-tours": "Tour tôn giáo",
    "shopping-tours": "Tour mua sắm",
  }
  return map[specialty] || specialty
}

export const formatLanguage = (language: string): string => {
  if (!language) return ""
  const map: Record<string, string> = {
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
    thai: "Tiếng Thái",
    french: "Tiếng Pháp",
    spanish: "Tiếng Tây Ban Nha",
    chinese: "Tiếng Trung",
    japanese: "Tiếng Nhật",
    korean: "Tiếng Hàn",
  }
  return map[language.toLowerCase()] || language
}

export const formatLocation = (location: string): string => {
  if (!location) return ""
  const locationMap: { [key: string]: string } = {
    usa: "Mỹ",
    uk: "Anh",
    vietnam: "Việt Nam",
    thailand: "Thái Lan",
    france: "Pháp",
    spain: "Tây Ban Nha",
    china: "Trung Quốc",
    japan: "Nhật Bản",
    korea: "Hàn Quốc",
    germany: "Đức",
  }
  return locationMap[location.toLowerCase()] || location
}

export const formatVehicle = (vehicle: string): string => {
  if (!vehicle) return ""
  const vehicleMap: { [key: string]: string } = {
    motorcycle: "Xe máy",
    car: "Xe hơi",
    van: "Xe van",
    bus: "Xe buýt",
    bicycle: "Xe đạp",
    walking: "Đi bộ",
    other: "Khác",
  }
  return vehicleMap[vehicle.toLowerCase()] || vehicle
}

const favouriteMap: Record<string, string> = {
  "Photography": "Chụp ảnh",
  "Reading Books": "Đọc sách",
  "Cooking": "Nấu ăn",
  "Hiking": "Leo núi",
  "Cycling": "Đạp xe",
  "Listening to Music": "Nghe nhạc",
  "Traveling": "Du lịch",
  "Swimming": "Bơi lội",
  "Drawing & Painting": "Vẽ & hội họa",
  "Yoga & Meditation": "Yoga & thiền",
}

export const formatFavourite = (favourite: string): string => {
  if (!favourite) return ""
  return favouriteMap[favourite] || favourite
}

// Utility functions to format arrays
export const formatSpecialties = (specialties: string[]): string => {
  if (!specialties || specialties.length === 0) return ""
  return specialties.map(formatSpecialty).join(", ")
}

export const formatLanguages = (languageList: string[]): string => {
  if (!languageList || languageList.length === 0) return ""
  return languageList.map(formatLanguage).join(", ")
}

// Price formatting (VND thay vì USD)
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Experience years formatting (sang tiếng Việt)
export const formatExperienceYears = (years: number): string => {
  if (years === 1) return "1 năm"
  return `${years} năm`
}

// Rating formatting (vẫn giữ số, thêm chữ "điểm")
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)} điểm`
}
