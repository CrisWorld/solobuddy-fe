'use client'
import { endpoints } from "@/config";
import { TourGuide } from "@/stores/types/types";
import { baseApi } from "../base";

// Define types
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
  mongo_filter?: MongoFilter;
}

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
    avatar?: string;
  };
}

const mapAPIToTourGuide = (apiGuide: APITourGuide): TourGuide => ({
  id: apiGuide._id,
  name: apiGuide.user.name,
  location: apiGuide.location,
  price: apiGuide.pricePerDay,
  rating: apiGuide.ratingAvg,
  languages: apiGuide.languages,
  specialties: apiGuide.specialties,
  avatar: apiGuide.user.avatar || "default-avatar.png",
  description: apiGuide.bio,
});

interface GuideResponse {
  results?: APITourGuide[];
  page?: number;
  limit?: number;
  totalPages?: number;
  totalResults?: number;
}

export const geminiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postAnswer: build.mutation<
      { response: AIResponse; guides: GuideResponse & { mappedResults: TourGuide[] } },
      { messages: Message[] }>({
      query: (body) => ({
        url: endpoints.geminiEndpoints.SEND_MESSAGE,
        method: "POST",
        body,
      }),
      extraOptions: { skipAuth: true },
      transformResponse: (response: { response: AIResponse; guides?: GuideResponse | [] }) => {
        // Nếu guides là mảng rỗng [], tạo cấu trúc mặc định
        const guidesData =
          Array.isArray(response.guides)
            ? { results: [], page: 1, limit: 0, totalPages: 0, totalResults: 0 }
            : response.guides || { results: [], page: 1, limit: 0, totalPages: 0, totalResults: 0 };

        return {
          ...response,
          guides: {
            ...guidesData,
            mappedResults: guidesData.results?.map(mapAPIToTourGuide) || [],
          },
        };
      },
    }),
  }),
});

export const { usePostAnswerMutation } = geminiApi;
