export interface TourGuide {
  id: number
  name: string
  location: string
  price: number
  rating: number
  languages: string[]
  specialties: string[]
  avatar: string
  description?: string
}