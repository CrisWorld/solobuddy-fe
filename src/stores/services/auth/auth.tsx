'use client'

import { endpoints } from "@/config";
import { baseApi } from "../base";
import webLocalStorage from "@/lib/webLocalStorage";
import cookieStorageClient from "@/lib/cookieStorageClient";

interface RegisterRequest { name: string; email: string; password: string; }
interface LoginRequest { email: string; password: string; }

interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  country?: string
  phone?: string
  isEmailVerified: boolean
}

interface AuthResponse {
  user: AuthUser;
  tokens: {
    access: { token: string; expires: string; };
    refresh: { token: string; expires: string; };
  };
}
interface TokenRefreshResponse {
  access: { token: string; expires: string; };
  refresh: { token: string; expires: string; };
}

interface LogoutRequest { refreshToken: string; }

function handleAuthSuccess(data: AuthResponse) {
  cookieStorageClient.setToken(data.tokens.access.token);
  cookieStorageClient.setRefreshToken(data.tokens.refresh.token);
  webLocalStorage.set("user", data.user);
  cookieStorageClient.set("token-expiry", data.tokens.access.expires);
  cookieStorageClient.set("refresh-token-expiry", data.tokens.refresh.expires);
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: endpoints.authEndpoints.REGISTER,
        method: "POST",
        body,
      }),
      extraOptions: { skipAuth: true },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(data);
        } catch (err) {
          console.error("Register failed", err);
        }
      },
    }),

    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: endpoints.authEndpoints.LOGIN,
        method: "POST",
        body,
      }),
      extraOptions: { skipAuth: true },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(data);
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),

    logout: build.mutation<void, LogoutRequest>({
      query: (body) => ({
        url: endpoints.authEndpoints.LOGOUT,
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          cookieStorageClient.removeAll();
          localStorage.clear();
        } catch (err) {
          console.error("Logout failed", err);
        }
      },
    }),
    refreshToken: build.mutation<TokenRefreshResponse, void>({
      query: () => ({
        url: endpoints.authEndpoints.REFRESH_TOKEN,
        method: "POST",
        body: { refreshToken: cookieStorageClient.getRefreshToken() },
      }),
      extraOptions: {refreshToken: true },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          cookieStorageClient.setToken(data.access.token);
          cookieStorageClient.setRefreshToken(data.refresh.token);
          cookieStorageClient.set("token-expiry", data.access.expires);
          cookieStorageClient.set("refresh-token-expiry", data.refresh.expires);
        } catch (err) {
          console.error("Refresh token failed", err);
          cookieStorageClient.removeAll();
          localStorage.clear();
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
