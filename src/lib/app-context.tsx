"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("chat")
  const [favouriteGuides, setFavouriteGuides] = useState<number[]>([])
  const [bookedTours, setBookedTours] = useState<
    Array<{
      id: number
      guideName: string
      location: string
      date: string
      status: "upcoming" | "completed"
    }>
  >([
    {
      id: 1,
      guideName: "Do En Nguyen",
      location: "Da Nang",
      date: "2024-01-15",
      status: "upcoming",
    },
  ])

  const toggleFavourite = (guideId: number) => {
    setFavouriteGuides((prev) => (prev.includes(guideId) ? prev.filter((id) => id !== guideId) : [...prev, guideId]))
  }

  const addBookedTour = (tour: any) => {
    setBookedTours((prev) => [...prev, tour])
  }

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        favouriteGuides,
        toggleFavourite,
        bookedTours,
        addBookedTour,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
