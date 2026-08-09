import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface FacultyState {
  profile: any;
  courses: any[];
  students: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FacultyState = {
  profile: null,
  courses: [],
  students: [],
  isLoading: false,
  error: null,
};

export const fetchFacultyDashboard = createAsyncThunk(
  'faculty/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/faculty/dashboard');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchFacultyCourses = createAsyncThunk(
  'faculty/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/faculty/my-courses');
      return data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch courses');
    }
  }
);

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    clearFacultyError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacultyDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFacultyDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchFacultyDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFacultyCourses.fulfilled, (state, action) => {
        state.courses = action.payload.data || [];
      });
  },
});

export const { clearFacultyError } = facultySlice.actions;
export default facultySlice.reducer;
