import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'scorten-auth' });

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000/api/v1'   // Android emulator → localhost
  : 'https://api.scorten.com/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getString('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getString('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

        storage.set('accessToken', data.data.accessToken);
        storage.set('refreshToken', data.data.refreshToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.data.accessToken}`,
        };

        return apiClient(originalRequest);
      } catch {
        storage.delete('accessToken');
        storage.delete('refreshToken');
        // Navigate to login - emit event
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
