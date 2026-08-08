"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/lib/types";
import { getCurrentUser, getUsers, saveUsers, setSession } from "@/lib/storage";

interface AuthContextValue {
  user: User | null;
  register: (u: User) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function register(newUser: User): { ok: boolean; error?: string } {
    const users = getUsers();
    if (users.some((u) => u.email === newUser.email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const updated = [...users, newUser];
    saveUsers(updated);
    setSession(newUser.email);
    setUser(newUser);
    return { ok: true };
  }

  function login(email: string, password: string): { ok: boolean; error?: string } {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { ok: false, error: "Invalid email or password." };
    }
    setSession(found.email);
    setUser(found);
    return { ok: true };
  }

  function logout() {
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
