import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
};

type AuthState = {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  updateAccessToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
      },
      updateAccessToken: (accessToken) => {
        set({ accessToken });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },
      isAuthenticated: () => {
        return !!get().accessToken;
      },
      isAdmin: () => {
        return get().user?.role === "ADMIN";
      },
    }),
    {
      name: "maaya-auth",
    },
  ),
);
