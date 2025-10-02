'use client'

import { endpoints } from "@/config";
import { baseApi } from "../base";
import { Favourite, TourGuide, UpdateResponse } from "@/stores/types/types";
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
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



// Add new interface for tour guide detail
export interface TourGuideDetail {
  id: string;
  languages: string[];
  photos: string[];
  ratingAvg: number;
  ratingCount: number;
  isActive: boolean;
  availableDates: string[];
  specialties: string[];
  userId: string;
  bio: string;
  pricePerDay: number;
  location: string;
  experienceYears: number;
  vehicle: string;
  favourites: Favourite[];
  dayInWeek?: number[];
  isRecur?: boolean;
  user: {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    country?: string;
  };
}

// Update mapping function to use the new type
export const mapTourGuideDetailResponse = (data: any): TourGuideDetail => {
  return {
    id: data._id,
    languages: data.languages || [],
    photos: data.photos || [],
    ratingAvg: data.ratingAvg || 0,
    ratingCount: data.ratingCount || 0,
    isActive: data.isActive || false,
    availableDates: data.availableDates || [],
    specialties: data.specialties || [],
    userId: data.userId || "",
    bio: data.bio || "",
    pricePerDay: data.pricePerDay || 0,
    location: data.location || "",
    experienceYears: data.experienceYears || 0,
    vehicle: data.vehicle || "",
    favourites: (data.favourites || []) as Favourite[],
    dayInWeek: data.dayInWeek || [],
    isRecur: data.isRecur || false,
    user: {
      id: data.user?._id || "",
      avatar: data.user?.avatar || "/default-avatar.png",
      name: data.user?.name || "",
      email: data.user?.email || ""
    }
  };
};

// Add interfaces for the new API
export interface Tour {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
  image?: string;
  price: number;
  duration: string;
  guideId: string;
  unit?: string;
}

export interface GetToursByGuideRequest {
  filter: {
    guideId: string;
  };
  options: {
    sortBy?: string;
    limit?: number;
    page?: number;
    populate?: string;
  };
}

export interface GetToursByGuideResponse {
  results: Tour[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface CreateTourRequest {
  title: string;
  description: string;
  price: number;
  image?: string;
  unit: string;
  duration: string;
}

export interface UpdateTourRequest {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  unit?: string;
  duration?: string;
}


// interface cho request update
export interface UpdateTourGuideProfileRequest {
  bio?: string;
  pricePerDay?: number;
  location?: string;
  languages?: string[];
  experienceYears?: number;
  photos?: string[];
  vehicle?: string;
  specialties?: string[];
  favourites?: string[];
}

export interface UpdateAvailableDatesRequest {
  addDates: string[];    // luôn có nhưng có thể []
  removeDates: string[]; // luôn có nhưng có thể []
}

export interface UpdateWorkDaysRequest {
  isRecur: boolean;
  dayInWeek: number[]; // 0 -> 6
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
    getTourGuideDetail: build.query<TourGuideDetail, string>({
      query: (id) => ({
        url: `${endpoints.tourGuideEndpoints.GET_TOUR_GUIDE_DETAIL}/${id}`,
        method: "GET"
      }),
      transformResponse: (response: any) => mapTourGuideDetailResponse(response),
    }),
    getToursByGuide: build.mutation<GetToursByGuideResponse, GetToursByGuideRequest>({
      query: (body) => ({
        url: endpoints.tourEndpoints.GET_TOURS,
        method: 'POST',
        body
      })
    }),
    createTour: build.mutation<Tour, CreateTourRequest>({
      query: (body) => ({
        url: endpoints.tourGuideEndpoints.CREATE_TOUR,
        method: 'POST',
        body
      })
    }),
    updateTour: build.mutation<Tour, UpdateTourRequest>({
      query: ({ id, ...body }) => ({
        url: `${endpoints.tourGuideEndpoints.UPDATE_TOUR}/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteTour: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${endpoints.tourGuideEndpoints.DELETE_TOUR}/${id}`,
        method: "DELETE",
      }),      
      transformResponse: (__, meta: FetchBaseQueryMeta) => {
        if (meta?.response?.status === 204) {
          return { success: true }
        }
        return { success: false }
      },
    }),
    updateTourGuideProfile: build.mutation<UpdateResponse, UpdateTourGuideProfileRequest>({
      query: (body) => ({
        url: endpoints.tourGuideEndpoints.UPDATE_TOUR_GUIDE_PROFILE,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any, meta: FetchBaseQueryMeta | undefined): UpdateResponse => {
        if (meta?.response?.status === 200) {
          return { success: true };
        }
        return { success: false, message: response?.message || "Update tour guide profile failed" };
      },
    }),
    updateAvailableDates: build.mutation<UpdateResponse, UpdateAvailableDatesRequest>({
      query: (body) => ({
        url: endpoints.tourGuideEndpoints.UPDATE_AVAILABLE_DATES,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any, meta: FetchBaseQueryMeta | undefined): UpdateResponse => {
        if (meta?.response?.status === 200) {
          return { success: true };
        }
        return { success: false, message: response?.message || "Update dates failed" };
      },
    }),
    updateWorkDays: build.mutation<UpdateResponse, UpdateWorkDaysRequest>({
      query: (body) => ({
        url: endpoints.tourGuideEndpoints.UPDATE_WORK_DAYS,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any, meta: FetchBaseQueryMeta | undefined): UpdateResponse => {
        if (meta?.response?.status === 200) {
          return { success: true };
        }
        return { success: false, message: response?.message || "Update work days failed" };
      },
    }),
  }),
});

export const {
  useGetTourGuidesMutation,
  useGetTourGuideDetailQuery,
  useGetToursByGuideMutation,
  useCreateTourMutation,  
  useUpdateTourMutation,
  useDeleteTourMutation,
  useUpdateTourGuideProfileMutation,
  useUpdateAvailableDatesMutation,
  useUpdateWorkDaysMutation
} = tourGuideApi;
