import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  _id: string;
  title: string;
  subjects: string[];
  city: string;
  state: string;
  salaryMin: number;
  salaryMax: number;
  jobType: string;
  status: string;
  totalApplications: number;
  isFeatured: boolean;
  createdAt: string;
  schoolId: {
    schoolName: string;
    logoUrl: string;
    city: string;
    rating: number;
  };
}

interface JobsState {
  jobs: Job[];
  savedJobs: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
  filters: {
    search: string;
    subjects: string[];
    city: string;
    jobType: string;
    experienceMin: number;
  };
}

const initialState: JobsState = {
  jobs: [],
  savedJobs: [],
  isLoading: false,
  error: null,
  pagination: { total: 0, page: 1, totalPages: 1 },
  filters: {
    search: '',
    subjects: [],
    city: '',
    jobType: '',
    experienceMin: 0,
  },
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<{ jobs: Job[]; pagination: any }>) => {
      state.jobs = action.payload.jobs;
      state.pagination = action.payload.pagination;
    },
    appendJobs: (state, action: PayloadAction<{ jobs: Job[]; pagination: any }>) => {
      state.jobs = [...state.jobs, ...action.payload.jobs];
      state.pagination = action.payload.pagination;
    },
    toggleSaveJob: (state, action: PayloadAction<string>) => {
      const idx = state.savedJobs.indexOf(action.payload);
      if (idx === -1) {
        state.savedJobs.push(action.payload);
      } else {
        state.savedJobs.splice(idx, 1);
      }
    },
    setFilters: (state, action: PayloadAction<Partial<JobsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setJobs, appendJobs, toggleSaveJob, setFilters, setLoading, setError } = jobsSlice.actions;
export default jobsSlice.reducer;
