import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: any) => void
}

const baseURL = import.meta.env.VITE_API_BASE_URL!

const api: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    // ensure headers exists
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// refresh state
let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async (err: AxiosError) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = err.response?.status

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        originalRequest._retry = true

        if (isRefreshing) {
          // queue up any other calls while we refresh
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((newToken: string) => {
            // once we get the new token, retry this request
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          })
        }

        isRefreshing = true
        try {
          // fire off one refresh request
          const { data } = await axios.post(
            `${baseURL}/auth/refresh/`,
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          )
          const newAccess = data.access as string

          // store it
          useAuthStore.getState().setTokens(newAccess, refreshToken)
          // let all the queued requests go
          processQueue(null, newAccess)

          // retry original
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return api(originalRequest)
        } catch (refreshErr) {
          processQueue(refreshErr, null)
          // if refresh fails, force logout
          useAuthStore.getState().logout()
          window.location.href = '/login'
          return Promise.reject(refreshErr)
        } finally {
          isRefreshing = false
        }
      }
    }

    // for any other errors, or no refresh token, just reject
    return Promise.reject(err)
  }
)

export default api
