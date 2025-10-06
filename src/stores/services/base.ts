import { constants } from "@/config"
import cookieStorageClient from "@/lib/cookieStorageClient"
import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react"
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface CustomExtraOptions {
  skipAuth?: boolean
  refreshToken?: boolean
}

// Cache token expiry check để tránh gọi lại nhiều lần
let cachedTokenCheck: { expired: boolean; timestamp: number } | null = null
const TOKEN_CHECK_CACHE_MS = 1000 // Cache 1 giây

async function isAccessTokenExpired(): Promise<boolean> {
  const now = Date.now()
  
  // Sử dụng cache nếu còn hợp lệ
  if (cachedTokenCheck && now - cachedTokenCheck.timestamp < TOKEN_CHECK_CACHE_MS) {
    return cachedTokenCheck.expired
  }

  const token = cookieStorageClient.getToken()
  const expiry = await cookieStorageClient.get("token-expiry")

  if (!token || !expiry) {
    cachedTokenCheck = { expired: false, timestamp: now }
    return false
  }

  const expired = new Date(expiry as string) <= new Date()
  cachedTokenCheck = { expired, timestamp: now }
  return expired
}

// Clear cache khi cần
export function clearTokenCache() {
  cachedTokenCheck = null
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers, { extra }) => {
    const skipAuth = (extra as CustomExtraOptions)?.skipAuth
    headers.set("Access-Control-Allow-Origin", "*")
    // Chỉ thêm token nếu không skipAuth
    if (!skipAuth) {
      const accessToken = cookieStorageClient.getToken()
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`)
      }
    }

    return headers
  },
})

// Tách logic xử lý session expired
async function handleExpiredSession(
  args: string | FetchArgs,
  api: any,
  extraOptions?: CustomExtraOptions
): Promise<any> {
  const authCtx = (window as any).authContextRef
  
  if (!authCtx) {
    // Nếu không có authContext, return error thay vì tiếp tục
    return {
      error: {
        status: 401,
        data: { message: "Session expired" }
      }
    }
  }

  return new Promise((resolve) => {
    authCtx.setIsSessionExpired(true)
    authCtx.setPendingAction(() => async () => {
      const result = await rawBaseQuery(args, { ...api, extra: extraOptions }, extraOptions || {})
      resolve(result)
    })
  })
}

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  CustomExtraOptions
> = async (args, api, extraOptions) => {
  // Nếu skipAuth, bỏ qua mọi logic authentication
  if (extraOptions?.skipAuth || extraOptions?.refreshToken) {
    return rawBaseQuery(args, { ...api, extra: extraOptions }, extraOptions || {})
  }

  // Check token expiry (async)
  if (await isAccessTokenExpired()) {
    return handleExpiredSession(args, api, extraOptions)
  }

  // Execute query bình thường
  return rawBaseQuery(args, { ...api, extra: extraOptions }, extraOptions || {})
}

export const baseApi = createApi({
  baseQuery,
  endpoints: () => ({})
})