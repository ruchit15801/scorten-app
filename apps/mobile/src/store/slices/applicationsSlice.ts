import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApplicationsState {
  applications: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  isLoading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<any[]>) => {
      state.applications = action.payload;
    },
    updateApplication: (state, action: PayloadAction<{ id: string; updates: any }>) => {
      const idx = state.applications.findIndex(a => a._id === action.payload.id);
      if (idx !== -1) {
        state.applications[idx] = { ...state.applications[idx], ...action.payload.updates };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
  },
});

export const { setApplications, updateApplication, setLoading, setError } = applicationsSlice.actions;
export default applicationsSlice.reducer;
