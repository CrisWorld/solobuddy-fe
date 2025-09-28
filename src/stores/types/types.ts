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

export interface UpdateResponse {
  success: boolean;
  message?: string;
}
export interface Favourite {
  _id: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
}