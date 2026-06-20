import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api/auth.api';

interface User {
  _id: string;
  // Teacher fields
  firstName?: string;
  lastName?: string;
  // School fields
  schoolName?: string;
  affiliationNumber?: string;
  board?: string;
  principalName?: string;
  city?: string;
  // Common
  email: string;
  phone?: string;
  role: 'teacher' | 'school' | 'parent' | 'admin';
  avatar?: string;
  isProfileComplete: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  walletBalance: number;
}

// Helper to persist auth data
const persistAuth = (data: { accessToken: string; refreshToken: string; role: string }) => {
  AsyncStorage.setItem('accessToken', data.accessToken);
  AsyncStorage.setItem('refreshToken', data.refreshToken);
  AsyncStorage.setItem('userRole', data.role); // persist role for route restore
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastRegisteredSCortenId: string | null;
  pendingSuccessScreen: boolean; // true after school registers → show success before dashboard
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastRegisteredSCortenId: null,
  pendingSuccessScreen: false,
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
      AsyncStorage.setItem('accessToken', action.payload.accessToken);
      AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      AsyncStorage.removeItem('userRole');
    },
    clearError: (state) => {
      state.error = null;
    },
    // Call this when school taps "Go to Dashboard" from the success screen
    clearSuccessScreen: (state) => {
      state.pendingSuccessScreen = false;
      state.isAuthenticated = true; // NOW unlock the school dashboard
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
      persistAuth({
        accessToken: action.payload.data.accessToken,
        refreshToken: action.payload.data.refreshToken,
        role: action.payload.data.user?.role || 'teacher',
      });
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      const role = action.payload.data.user?.role;
      const scortenId = action.payload.data.scortenId || null;

      state.user            = action.payload.data.user;
      state.accessToken     = action.payload.data.accessToken;
      state.refreshToken    = action.payload.data.refreshToken;
      state.lastRegisteredSCortenId = scortenId;

      if (role === 'school' && scortenId) {
        // School: show success screen FIRST, then authenticate
        state.pendingSuccessScreen = true;
        state.isAuthenticated = false;
      } else {
        // Teacher: go straight to app
        state.isAuthenticated = true;
        state.pendingSuccessScreen = false;
      }

      persistAuth({
        accessToken:  action.payload.data.accessToken,
        refreshToken: action.payload.data.refreshToken,
        role:         role || 'teacher',
      });
      if (scortenId) {
        AsyncStorage.setItem('schoolSCortenId', scortenId);
      }
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOtpThunk.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.isAuthenticated = true;
      persistAuth({
        accessToken: action.payload.data.accessToken,
        refreshToken: action.payload.data.refreshToken,
        role: action.payload.data.user?.role || 'teacher',
      });
    });

    // Get Me
    builder.addCase(getMeThunk.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
    });
  },
});

export const { setTokens, setUser, logout, clearError, clearSuccessScreen } = authSlice.actions;
export default authSlice.reducer;
