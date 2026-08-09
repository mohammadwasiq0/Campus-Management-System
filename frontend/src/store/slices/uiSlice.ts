import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  isMobile: boolean;
  currentPage: string;
  breadcrumbs: { label: string; href?: string }[];
  loading: { [key: string]: boolean };
}

const initialState: UIState = {
  sidebarOpen: true,
  darkMode: false,
  isMobile: false,
  currentPage: '',
  breadcrumbs: [],
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
      if (action.payload) state.sidebarOpen = false;
    },
    setCurrentPage(state, action: PayloadAction<string>) {
      state.currentPage = action.payload;
    },
    setBreadcrumbs(
      state,
      action: PayloadAction<{ label: string; href?: string }[]>
    ) {
      state.breadcrumbs = action.payload;
    },
    setLoading(
      state,
      action: PayloadAction<{ key: string; value: boolean }>
    ) {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setDarkMode,
  setIsMobile,
  setCurrentPage,
  setBreadcrumbs,
  setLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
