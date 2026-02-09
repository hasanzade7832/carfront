import { create } from "zustand";
import { clearToken, getToken, setToken as saveToken } from "@/lib/auth";
import { setAuthToken } from "@/lib/api";
import { getRoleFromToken } from "@/lib/jwt";

type AuthState = {
  token: string | null;
  role: string | null;

  hydrate: () => void;
  setToken: (t: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  role: null,

  hydrate: () => {
    const t = getToken();
    setAuthToken(t);
    set({ token: t, role: t ? getRoleFromToken(t) : null });
  },

  setToken: (t) => {
    saveToken(t);
    setAuthToken(t);
    set({ token: t, role: getRoleFromToken(t) });
  },

  logout: () => {
    clearToken();
    setAuthToken(null);
    set({ token: null, role: null });
  },
}));
