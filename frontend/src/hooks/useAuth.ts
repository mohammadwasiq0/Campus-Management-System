'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  loginUser,
  registerUser,
  logout,
  clearError,
  fetchProfile,
} from '@/store/slices/authSlice';
import { useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import type { AppDispatch } from '@/store';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    requiresTwoFactor,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchProfile());
    }
  }, [accessToken, user, dispatch]);

  const login = useCallback(
    (credentials: { email: string; password: string; twoFactorCode?: string }) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      role?: string;
    }) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    api.post('/auth/logout').catch(() => {});
    dispatch(logout());
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const hasRole = useCallback(
    (role: string) => {
      return user?.roles?.some((r) => r.role === role) ?? false;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    requiresTwoFactor,
    login,
    register,
    signOut,
    dismissError,
    hasRole,
    hasAnyRole,
  };
}
