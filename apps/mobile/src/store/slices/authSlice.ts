import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';
import { authAPI } from '../../services/api/auth.api';

const storage = new MMKV({ id: 'scorten-auth' });

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'school' | 'parent' | 'admin';
  avatar?: string;
  isProfileComplete: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  walletBalance: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: storage.getString('accessToken') || null,
  refreshToken: storage.getString('refreshToken') || null,
  isAuthenticated: !!storage.getString('accessToken'),
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  },
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (data: { phone: string; otp: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  },
);

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  },
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      storage.set('accessToken', action.payload.accessToken);
      storage.set('refreshToken', action.payload.refreshToken);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      storage.delete('accessToken');
      storage.delete('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.isAuthenticated = true;
      storage.set('accessToken', action.payload.data.accessToken);
      storage.set('refreshToken', action.payload.data.refreshToken);
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.isAuthenticated = true;
      storage.set('accessToken', action.payload.data.accessToken);
      storage.set('refreshToken', action.payload.data.refreshToken);
    });

    // Verify OTP
    builder.addCase(verifyOtpThunk.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.isAuthenticated = true;
      storage.set('accessToken', action.payload.data.accessToken);
      storage.set('refreshToken', action.payload.data.refreshToken);
    });

    // Get Me
    builder.addCase(getMeThunk.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
    });
  },
});

export const { setTokens, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
