"use client"

import { store } from "@/stores"
import { TourGuide } from "@/stores/types/types"
import { createContext, useContext, useState, type ReactNode } from "react"
import { Provider } from "react-redux"
import { useToast } from "./useToast"
import { ToastContainer } from "@/components/common/toast-message"

type Page = "chat" | "tour-guide" | "favourite" | "journey" | "profile"

interface AppContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  favouriteGuides: number[]
  toggleFavourite: (guideId: number) => void
  bookedTours: Array<{
    id: number
    guideName: string
    location: string
    date: string
    status: "upcoming" | "completed"
  }>
  addBookedTour: (tour: any) => void
  allTourGuides: TourGuide[]
  showToast: (message: string, type?: "success" | "error" | "info") => void
  removeToast: (id: string) => void
}

const allTourGuides: TourGuide[] = [
  {
    id: 1,
    name: "Do En Nguyen",
    location: "Da Nang",
    price: 950000, // 950k VND
    rating: 4.56,
    languages: ["Vietnamese", "English"],
    specialties: ["Photography", "Food", "History"],
    avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
    description: "Passionate photographer and food enthusiast with 5 years of guiding experience.",
  },
  {
    id: 2,
    name: "Nguyen Truong Giang",
    location: "Da Nang",
    price: 980000,
    rating: 4.52,
    languages: ["Vietnamese", "English"],
    specialties: ["Photography", "Food", "History"],
    avatar: "/asian-male-tour-guide-with-glasses-and-map.jpg",
    description: "Local historian specializing in cultural tours and authentic dining experiences.",
  },
  {
    id: 3,
    name: "Linh Pham",
    location: "Ho Chi Minh City",
    price: 1200000,
    rating: 4.78,
    languages: ["Vietnamese", "English", "French"],
    specialties: ["Culture", "Shopping", "Nightlife"],
    avatar: "/asian-woman-tour-guide.jpg",
    description: "Energetic guide who knows all the best spots for shopping and nightlife in Saigon.",
  },
  {
    id: 4,
    name: "Minh Tran",
    location: "Hanoi",
    price: 870000,
    rating: 4.65,
    languages: ["Vietnamese", "English", "Japanese"],
    specialties: ["History", "Architecture", "Street Food"],
    avatar: "/asian-man-tour-guide-hanoi.jpg",
    description: "Architecture enthusiast with deep knowledge of Hanoi's historical sites and street food scene.",
  },
  {
    id: 5,
    name: "Thao Nguyen",
    location: "Hoi An",
    price: 820000,
    rating: 4.89,
    languages: ["Vietnamese", "English", "Korean"],
    specialties: ["Crafts", "Cooking", "Culture"],
    avatar: "/asian-woman-tour-guide-hoi-an.jpg",
    description: "Traditional craft expert offering hands-on cooking classes and cultural immersion experiences.",
  },
  {
    id: 6,
    name: "Duc Le",
    location: "Nha Trang",
    price: 890000,
    rating: 4.43,
    languages: ["Vietnamese", "English", "Russian"],
    specialties: ["Beach", "Water Sports", "Seafood"],
    avatar: "/asian-man-tour-guide-beach.jpg",
    description: "Beach and water sports specialist with extensive knowledge of coastal activities and fresh seafood.",
  },
]


const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("chat");
  const [favouriteGuides, setFavouriteGuides] = useState<number[]>([]);
  const [bookedTours, setBookedTours] = useState<
    Array<{
      id: number;
      guideName: string;
      location: string;
      date: string;
      status: "upcoming" | "completed";
    }>
  >([
    {
      id: 1,
      guideName: "Do En Nguyen",
      location: "Da Nang",
      date: "2024-01-15",
      status: "upcoming",
    },
  ]);

  // Toast hook
  const toast = useToast();

  const toggleFavourite = (guideId: number) => {
    setFavouriteGuides((prev) =>
      prev.includes(guideId) ? prev.filter((id) => id !== guideId) : [...prev, guideId]
    );
  };

  const addBookedTour = (tour: any) => {
    setBookedTours((prev) => [...prev, tour]);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        favouriteGuides,
        toggleFavourite,
        bookedTours,
        addBookedTour,
        allTourGuides,
        showToast: toast.showToast,
        removeToast: toast.removeToast,
      }}
    >
      <Provider store={store}>
        {children}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </Provider>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
