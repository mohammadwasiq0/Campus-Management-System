import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface StudentState {
  profile: any;
  attendance: any[];
  attendanceStats: any;
  results: any[];
  fees: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  profile: null,
  attendance: [],
  attendanceStats: null,
  results: [],
  fees: [],
  isLoading: false,
  error: null,
};

export const fetchStudentDashboard = createAsyncThunk(
  'student/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/students/dashboard');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchStudentAttendance = createAsyncThunk(
  'student/fetchAttendance',
  async (params: any, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/students/my-attendance', { params });
      return data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch attendance');
    }
  }
);

export const fetchStudentResults = createAsyncThunk(
  'student/fetchResults',
  async (params: any, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/students/my-results', { params });
      return data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch results');
    }
  }
);

export const fetchStudentFees = createAsyncThunk(
  'student/fetchFees',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/students/my-fees');
      return data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch fees');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearStudentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.attendance = action.payload.data || [];
        state.attendanceStats = action.payload.stats;
      })
      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.results = action.payload.data || [];
      })
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        state.fees = action.payload.data || [];
      });
  },
});

export const { clearStudentError } = studentSlice.actions;
export default studentSlice.reducer;
