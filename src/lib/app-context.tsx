"use client"

import { store } from "@/stores"
import { createContext, useContext, useState, type ReactNode } from "react"
import { Provider } from "react-redux"
import { useToast } from "./useToast"
import { ToastContainer } from "@/components/common/toast-message"

type Page = "chat" | "tour-guide" | "favourite" | "journey" | "profile"

interface AppContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  favouriteGuides: string[]
  toggleFavourite: (guideId: string) => void
  bookedTours: Array<{
    id: number
    guideName: string
    location: string
    date: string
    status: "upcoming" | "completed"
  }>
  addBookedTour: (tour: any) => void
  showToast: (message: string, type?: "success" | "error" | "info") => void
  removeToast: (id: string) => void
}



const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("chat");
  const [favouriteGuides, setFavouriteGuides] = useState<string[]>([]);
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

  const toggleFavourite = (guideId: string) => {
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
