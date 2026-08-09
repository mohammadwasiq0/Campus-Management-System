import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  profilePicture?: string;
  roles: { role: string }[];
  isVerified: boolean;
  twoFactorEnabled: boolean;
  student?: any;
  faculty?: any;
  employee?: any;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresTwoFactor: boolean;
  twoFactorUserId: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requiresTwoFactor: false,
  twoFactorUserId: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string; twoFactorCode?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      role?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const { data } = await api.post('/auth/refresh', {
        refreshToken: state.auth.refreshToken,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.requiresTwoFactor = false;
      state.twoFactorUserId = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.requiresTwoFactor = false;
      state.twoFactorUserId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.requiresTwoFactor) {
          state.requiresTwoFactor = true;
          state.twoFactorUserId = action.payload.userId;
        } else {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
