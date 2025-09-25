'use client'

import { endpoints } from "@/config";
import { baseApi } from "../base";
import { TourGuide } from "@/stores/types/types";
// payload khi gọi API
export interface TourGuideFilter {
  [key: string]: {
    operator: string
    value: string | number | boolean
  }
}

export interface TourGuideOptions {
  sortBy?: string
  limit?: number
  page?: number
}

export interface TourGuideRequest {
  filter?: TourGuideFilter
  options?: TourGuideOptions
}

// response gốc từ BE
export interface TourGuideResponse {
  results: TourGuide[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}
export const mapTourGuideApiResponse = (res: any): TourGuideResponse => {
  return {
    results: res.results.map((data: any): TourGuide => ({
      id: data._id,
      name: data.user?.name || "",
      location: data.location || "",
      price: data.pricePerDay || 0,
      rating: data.ratingAvg || 0,
      languages: data.languages || [],
      specialties: data.specialties || [],
      avatar: data.user?.avatar || "/default-avatar.png",
      description: data.bio || "",
    })),
    page: res.page,
    limit: res.limit,
    totalPages: res.totalPages,
    totalResults: res.totalResults,
  }
}

export const tourGuideApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTourGuides: build.mutation<TourGuideResponse, TourGuideRequest>({
      query: (body) => ({
        url: endpoints.tourGuideEndpoints.GET_TOUR_GUIDES,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => mapTourGuideApiResponse(response),
    }),
  }),
})

export const { useGetTourGuidesMutation } = tourGuideApi