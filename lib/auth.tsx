"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_URL, getApiOrigin } from "./config";
import { betterAuthClient } from "./better-auth";

export type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  phone?: string;
  address?: string;
  role: "Customer" | "Owner" | "Admin";
  createdAt?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (token: string, user: User) => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<User | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function writeAuthCookies(token: string, role: User["role"]) {
  document.cookie = `equiply_token=${encodeURIComponent(token)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `equiply_role=${encodeURIComponent(role)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearAuthCookies() {
  document.cookie = "equiply_token=; Path=/; Max-Age=0; SameSite=Lax";
  document.cookie = "equiply_role=; Path=/; Max-Age=0; SameSite=Lax";
}

function persistSession(token: string, user: User) {
  window.localStorage.setItem("equiply_token", token);
  window.localStorage.setItem("equiply_user", JSON.stringify(user));
  writeAuthCookies(token, user.role);
}

function clearSession() {
  window.localStorage.removeItem("equiply_token");
  window.localStorage.removeItem("equiply_user");
  clearAuthCookies();
}

async function fetchGoogleBridge() {
  const response = await fetch(`${getApiOrigin()}/api/auth/google-session`, { credentials: "include" });
  if (!response.ok) return null;
  return await response.json() as { token: string; user: User };
}

async function fetchMe(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) return null;
  const data = await response.json() as { user?: User };
  return data.user || null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = useCallback((nextToken: string, nextUser: User) => {
    persistSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const updateUser = useCallback((nextUser: User) => {
    const currentToken = window.localStorage.getItem("equiply_token");
    if (currentToken) persistSession(currentToken, nextUser);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = window.localStorage.getItem("equiply_token");
    if (!currentToken) return null;
    const nextUser = await fetchMe(currentToken);
    if (!nextUser) {
      clearSession();
      setToken(null);
      setUser(null);
      return null;
    }
    persistSession(currentToken, nextUser);
    setToken(currentToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await betterAuthClient.signOut();
    } catch {
      // Local session clear still proceeds if BetterAuth session is already gone.
    }
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedToken = window.localStorage.getItem("equiply_token");
      const storedUser = window.localStorage.getItem("equiply_user");

      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as User;
          if (!cancelled) {
            setToken(storedToken);
            setUser(parsed);
            writeAuthCookies(storedToken, parsed.role);
          }
          const fresh = await fetchMe(storedToken);
          if (!cancelled && fresh) {
            persistSession(storedToken, fresh);
            setUser(fresh);
          } else if (!cancelled && !fresh) {
            clearSession();
            setToken(null);
            setUser(null);
          }
        } catch {
          clearSession();
          if (!cancelled) {
            setToken(null);
            setUser(null);
          }
        }
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const bridged = await fetchGoogleBridge();
        if (!cancelled && bridged) {
          persistSession(bridged.token, bridged.user);
          setToken(bridged.token);
          setUser(bridged.user);
        }
      } catch {
        // No Google session available.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrap();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    signIn,
    updateUser,
    refreshUser,
    signOut
  }), [loading, refreshUser, signIn, signOut, token, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export { fetchGoogleBridge };
