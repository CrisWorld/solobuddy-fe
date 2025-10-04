'use client'

import { endpoints } from "@/config";
import { baseApi } from "../base";

export interface Review {
  _id: string;
  bookingId: string;
  guideId: string;
  travelerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  traveler?: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

export interface ReviewResponse {
  results: Review[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface CreateReviewRequest {
  bookingId: string;
  guideId: string;
  rating: number;
  comment: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReviews: build.query<ReviewResponse, { guideId: string; page?: number; limit?: number; }>({
      query: ({ guideId, page = 1, limit = 10 }) => ({
        url: endpoints.reviewEndpoints.GET_REVIEWS,
        method: "GET",
        params: { guideId, page, limit }
      }),
      extraOptions: { skipAuth: true }
    }),

    createReview: build.mutation<Review, CreateReviewRequest>({
      query: (body) => ({
        url: endpoints.reviewEndpoints.GET_REVIEWS,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useGetReviewsQuery,
  useCreateReviewMutation 
} = reviewApi;