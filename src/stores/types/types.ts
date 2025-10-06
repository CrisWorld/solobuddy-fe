export interface TourGuide {
  id: string
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

export interface Booking {
  id: string;
  tourSnapshot: TourSnapshot;
  guideSnapshot: GuideSnapshot;
  travelerSnapshot: TravelerSnapshot;
  status: "pending" | "wait-payment" | "confirmed" | "cancelled" | "completed"; // có thể mở rộng
  totalPrice: number;
  fromDate: string; // ISO string
  toDate: string;   // ISO string
  quanity: number;  
}

export interface TourSnapshot {
  id: string;
  title: string;
  price: number;
  duration: string;
}

export interface GuideSnapshot {
  guideid: string;
  name: string;
  avatar: string;
  email: string;
  country?: string;
  phone?: string;
  location: string;
  pricePerDay: number;
}

export interface TravelerSnapshot {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  country?: string;
}
