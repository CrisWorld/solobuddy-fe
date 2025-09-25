'use client'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "@/config";
import { TourGuide } from "@/stores/types/types";
import { baseApi } from "../base";

// Define types for the request and response
interface Message {
  role: string;
  text: string;
}

interface MongoFilter {
  [key: string]: {
    operator: string;
    value: any;
  };
}

interface AIResponse {
  response_text: string;
  mongo_filter: MongoFilter;
}

// Define API response interface
interface APITourGuide {
  _id: string;
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
  favourites: any[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
}

// Add mapping function
const mapAPIToTourGuide = (apiGuide: APITourGuide): TourGuide => {
  return {
    id: parseInt(apiGuide._id.substring(18), 16), // Convert last 6 chars of _id to number
    name: apiGuide.user.name,
    location: apiGuide.location,
    price: apiGuide.pricePerDay,
    rating: apiGuide.ratingAvg,
    languages: apiGuide.languages,
    specialties: apiGuide.specialties,
    avatar: '/default-avatar.png', // Use first photo as avatar or empty string
    description: apiGuide.bio
  };
};

interface GuideResponse {
  results: APITourGuide[]; // Change to APITourGuide
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface AnswerResponse {
  response: AIResponse;
  guides: GuideResponse;
}

// Create the API endpoint with mapping
export const geminiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postAnswer: build.mutation<{ response: AIResponse; guides: GuideResponse & { mappedResults: TourGuide[] } }, { messages: Message[] }>({
      query: (body) => ({
        url: endpoints.geminiEndpoints.SEND_MESSAGE,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { response: AIResponse; guides: GuideResponse }) => {
        return {
          ...response,
          guides: {
            ...response.guides,
            mappedResults: response.guides.results.map(mapAPIToTourGuide)
          }
        };
      },
    }),
  }),
});

export const {
  usePostAnswerMutation
} = geminiApi;