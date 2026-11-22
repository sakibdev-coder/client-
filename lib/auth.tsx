"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type User = { id: string; name: string; email: string; photo?: string; role: "Customer" | "Owner" | "Admin" };
type AuthContextValue = { user: User | null; token: string | null; loading: boolean; signIn: (token: string, user: User) => void; signOut: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/api\/?$/, "");

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("equiply_token");
    const storedUser = window.localStorage.getItem("equiply_user");
    if (storedToken && storedUser) {
      try { setToken(storedToken); setUser(JSON.parse(storedUser) as User); }
      catch { window.localStorage.removeItem("equiply_token"); window.localStorage.removeItem("equiply_user"); }
    } else {
      fetch(`${apiUrl}/api/auth/google-session`, {
        credentials: "include"
      })
        .then(async (response) => {
          if (!response.ok) return null;
          return await response.json() as { token: string; user: User };
        })
        .then((result) => {
          if (!result) return;
          window.localStorage.setItem("equiply_token", result.token);
          window.localStorage.setItem("equiply_user", JSON.stringify(result.user));
          setToken(result.token);
          setUser(result.user);
        })
        .catch(() => undefined);
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    user, token, loading,
    signIn: (nextToken: string, nextUser: User) => {
      window.localStorage.setItem("equiply_token", nextToken);
      window.localStorage.setItem("equiply_user", JSON.stringify(nextUser));
      setToken(nextToken); setUser(nextUser);
    },
    signOut: () => {
      window.localStorage.removeItem("equiply_token"); window.localStorage.removeItem("equiply_user");
      setToken(null); setUser(null);
    }
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
