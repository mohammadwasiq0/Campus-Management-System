import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { logout, refreshToken } from '@/store/slices/authSlice';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result = await store.dispatch(refreshToken());
        if (refreshToken.fulfilled.match(result)) {
          const newToken = result.payload.accessToken;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          processQueue(error, null);
          store.dispatch(logout());
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
export const apiService = {
  get: <T = any>(url: string, params?: any) =>
    api.get<T>(url, { params }).then((res) => res.data),

  post: <T = any>(url: string, data?: any) =>
    api.post<T>(url, data).then((res) => res.data),

  put: <T = any>(url: string, data?: any) =>
    api.put<T>(url, data).then((res) => res.data),

  patch: <T = any>(url: string, data?: any) =>
    api.patch<T>(url, data).then((res) => res.data),

  delete: <T = any>(url: string) =>
    api.delete<T>(url).then((res) => res.data),

  upload: <T = any>(url: string, formData: FormData) =>
    api.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data),
};

export default api;
