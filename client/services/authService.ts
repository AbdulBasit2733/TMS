import { api } from "./api";

export interface AuthUser {
  id: string;
  email: string;
}

export const authService = {
  async register(email: string, password: string): Promise<void> {
    await api.post("/auth/register", { email, password });
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post("/auth/login", { email, password });
    return { id: data.userId, email: data.email };
  },

  async refresh(): Promise<AuthUser | null> {
    try {
      const { data } = await api.post("/auth/refresh");
      console.log("data", data)
      return { id: data.userId, email: data.email };
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      return;
    }
  },
};