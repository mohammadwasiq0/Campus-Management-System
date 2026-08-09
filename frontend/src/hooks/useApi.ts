'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import toast from 'react-hot-toast';

export function useApiGet<T = any>(
  key: string | string[],
  url: string,
  params?: any,
  options?: any
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<T>({
    queryKey: [...queryKey, params],
    queryFn: () => apiService.get<T>(url, params),
    ...options,
  });
}

export function useApiPost<T = any>(
  url: string,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.post<T>(url, data),
    onSuccess: (data: T) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred';
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

export function useApiPut<T = any>(
  url: string,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.put<T>(url, data),
    onSuccess: (data: T) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred';
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

export function useApiPatch<T = any>(
  url: string,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.patch<T>(url, data),
    onSuccess: (data: T) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred';
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

export function useApiDelete<T = any>(
  url: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
    successMessage?: string;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.delete<T>(url),
    onSuccess: () => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred';
      toast.error(message);
      options?.onError?.(error);
    },
  });
}
