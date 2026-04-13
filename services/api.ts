// services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://trip-ledge.vercel.app/api/mobile';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest  { email: string; password: string }
export interface LoginResponse { token: string; user: UserProfile }
export interface UserProfile   { id: string; name: string; email: string; role?: string }

export interface OfficeLocation {
  latitude: number;
  longitude: number;
  name: string;
  radius?: number; // metres allowed for check-in
}

export interface VerifyLocationRequest  { latitude: number; longitude: number }
export interface VerifyLocationResponse {
  auto_approved: boolean;
  id?: string;
  requestId?: string;
  message?: string;
}

export interface CheckinStatusResponse {
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  approvedAt?: string;
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Attach JWT on every request
  client.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Global error normalisation
  client.interceptors.response.use(
    res => res,
    (err: AxiosError) => {
      if (err.response?.status === 401) {
        clearToken();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
      return Promise.reject(normaliseError(err));
    },
  );

  return client;
};

export const apiClient = createClient();

// ─── Token helpers ─────────────────────────────────────────────────────────────

const TOKEN_KEY = 'tc_jwt';

export const setToken = (token: string) => {
  // Prefer cookie, fall back to localStorage
  try {
    Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict' });
  } catch {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  try {
    return Cookies.get(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const clearToken = () => {
  try { Cookies.remove(TOKEN_KEY); } catch { /* noop */ }
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
};

export const isAuthenticated = () => Boolean(getToken());

// ─── Error helper ─────────────────────────────────────────────────────────────

export interface ApiError { message: string; status?: number }

const normaliseError = (err: AxiosError): ApiError => ({
  message:
    (err.response?.data as Record<string, string>)?.message ??
    err.message ??
    'An unexpected error occurred.',
  status: err.response?.status,
});

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', data);
    setToken(res.data.token);
    return res.data;
  },

  logout: () => { clearToken(); },
};

// ─── Check-in API ─────────────────────────────────────────────────────────────

export const checkinApi = {
  getOfficeLocation: async (): Promise<OfficeLocation> => {
    const res = await apiClient.get<OfficeLocation>('/checkin/office-location');
    return res.data;
  },

  verifyLocation: async (coords: VerifyLocationRequest): Promise<VerifyLocationResponse> => {
    const res = await apiClient.post<VerifyLocationResponse>('/checkin/verify-location', coords);
    return res.data;
  },

  getRequestStatus: async (requestId: string): Promise<CheckinStatusResponse> => {
    const res = await apiClient.get<CheckinStatusResponse>(`/checkin/request-status/${requestId}`);
    return res.data;
  },
};
