import { BASE_API_URL } from '@/lib/utils';
import axios from 'axios';


export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // ← sends "refreshToken" httpOnly cookie automatically
});

// In-memory access token — NOT localStorage, safe from XSS
let _accessToken: string | null = null;
export const setAccessToken = (t: string) => { _accessToken = t; };
export const getAccessToken = () => _accessToken;
export const clearAccessToken = () => { _accessToken = null; };

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  if (_accessToken) config.headers.Authorization = `Bearer ${_accessToken}`;
  return config;
});

// Silent refresh interceptor
let refreshing = false;
type QItem = { resolve: (t: string) => void; reject: (e: unknown) => void };
let queue: QItem[] = [];

const flushQueue = (err: unknown, token: string | null) =>
  queue.splice(0).forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token!)
  );

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config;
    if (error.response?.status !== 401 || orig._retry) return Promise.reject(error);

    if (refreshing) {
      return new Promise<string>((resolve, reject) =>
        queue.push({ resolve, reject })
      ).then((token) => {
        orig.headers.Authorization = `Bearer ${token}`;
        return api(orig);
      });
    }

    orig._retry = true;
    refreshing = true;

    try {
      // Cookie sent automatically — no body needed
      const { data } = await axios.post(
        `${BASE_API_URL}/auth/refresh`, {}, { withCredentials: true }
      );
      setAccessToken(data.accessToken);
      flushQueue(null, data.accessToken);
      orig.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(orig);
    } catch (err) {
      flushQueue(err, null);
      clearAccessToken();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      refreshing = false;
    }
  }
);