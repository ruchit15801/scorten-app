import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isLoading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning'; visible: boolean } | null;
  bottomSheet: { id: string; data?: any } | null;
}

const initialState: UiState = {
  isLoading: false,
  toast: null,
  bottomSheet: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: UiState['toast']['type'] }>) => {
      state.toast = { ...action.payload, visible: true };
    },
    hideToast: (state) => {
      state.toast = null;
    },
    openBottomSheet: (state, action: PayloadAction<{ id: string; data?: any }>) => {
      state.bottomSheet = action.payload;
    },
    closeBottomSheet: (state) => {
      state.bottomSheet = null;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { showToast, hideToast, openBottomSheet, closeBottomSheet, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
