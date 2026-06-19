import apiClient from '../apiClient';

export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  sendOtp: (phone: string) => apiClient.post('/auth/send-otp', { phone }),
  verifyOtp: (data: { phone: string; otp: string; role?: string }) => apiClient.post('/auth/verify-otp', data),
  googleLogin: (token: string, role: string) => apiClient.post('/auth/google', { token, role }),
  refreshToken: (refreshToken: string) => apiClient.post('/auth/refresh-token', { refreshToken }),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => apiClient.post('/auth/reset-password', data),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
  updateFcmToken: (fcmToken: string) => apiClient.patch('/auth/fcm-token', { fcmToken }),
};
