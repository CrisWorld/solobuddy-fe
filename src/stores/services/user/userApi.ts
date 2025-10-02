'use client'

import { endpoints } from "@/config";
import { baseApi } from "../base";
import { Booking, Favourite } from "@/stores/types/types";
import { get } from "lodash";

export interface UserProfile {
  id: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  name: string;
  email: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}
export interface UpdateProfileRequest {
    name?: string;
    country?: string;
    avatar?: string; // URL
}
export interface TourGuideProfile {
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
}

// Kết hợp User + TourGuide nếu role = guide
export type ProfileResponse = UserProfile & {
  tourGuides?: TourGuideProfile[];
};

export const mapUserProfileResponse = (data: any): ProfileResponse => {
  const baseProfile: UserProfile = {
    id: data._id,
    avatar: data.avatar || "/default-avatar.png",
    role: data.role,
    isEmailVerified: data.isEmailVerified || false,
    name: data.name,
    email: data.email,
    country: data.country,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  if (data.role === "guide" && Array.isArray(data.tourGuides)) {
    const tourGuides: TourGuideProfile[] = data.tourGuides.map((g: any) => ({
      id: g._id,
      languages: g.languages || [],
      photos: g.photos || [],
      ratingAvg: g.ratingAvg || 0,
      ratingCount: g.ratingCount || 0,
      isActive: g.isActive || false,
      availableDates: g.availableDates || [],
      specialties: g.specialties || [],
      userId: g.userId,
      bio: g.bio || "",
      pricePerDay: g.pricePerDay || 0,
      location: g.location || "",
      experienceYears: g.experienceYears || 0,
      vehicle: g.vehicle || "",
      favourites: (g.favourites || []) as Favourite[],
      dayInWeek: g.dayInWeek || [],
      isRecur: g.isRecur || false,
    }));

    return {
      ...baseProfile,
      tourGuides,
    };
  }

  return baseProfile;
};

export interface AddBookingRequest {
  tourGuideId: string;
  tourId: string;
  fromDate: string; //yyyy-mm-dd
  toDate: string; //yyyy-mm-dd
  quanity: number;
}

export interface AddBookingResponse {
  booking: Booking;
  checkoutUrl: string; 
}

export interface UpdateUserInfoRequest {
  name?: string;
  country?: string;
  avatar?: string; // URL
  phone?: string;
}


export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ProfileResponse, void>({
      query: () => ({
        url: endpoints.userEndpoints.GET_PROFILE,
        method: "GET",
      }),
      transformResponse: (response: any) => mapUserProfileResponse(response),
    }),
    addBooking: build.mutation<AddBookingResponse, AddBookingRequest>({
      query: (body) => ({
        url: endpoints.userEndpoints.BOOKING,
        method: "POST",
        body,
      }),
    }),
    getBookingsHistory: build.query< Booking[] , void>({
      query: () => ({
        url: endpoints.userEndpoints.BOOKING,
        method: 'GET',
      }),
    })
  }),
});

export const { useGetProfileQuery
, useAddBookingMutation,
  useGetBookingsHistoryQuery
 } = userApi;