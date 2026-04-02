import axios from 'axios';
import { api, setAccessToken, clearAccessToken } from './api';
import { BASE_API_URL } from '@/lib/utils';


export const authService = {
  async register(email: string, password: string) {
    const { data } = await axios.post(`${BASE_API_URL}/auth/register`, { email, password });
    return data; // { message, userId }
  },

  async login(email: string, password: string) {
    // Backend sets httpOnly cookie "refreshToken" via Set-Cookie header
    // Backend returns only { accessToken } in body
    const { data } = await axios.post(
      `${BASE_API_URL}/auth/login`, { email, password }, { withCredentials: true }
    );
    setAccessToken(data.accessToken);
    return data.accessToken;
  },

  async refresh(): Promise<string | null> {
    try {
      const { data } = await axios.post(
        `${BASE_API_URL}/auth/refresh`, {}, { withCredentials: true }
      );
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      clearAccessToken();
      return null;
    }
  },

  async logout() {
    try { await api.post('/auth/logout'); } finally { clearAccessToken(); }
  },
};