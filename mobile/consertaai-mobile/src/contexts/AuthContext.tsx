import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const isWeb = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const storage = {
  async getItem(key: string) {
    if (isWeb) {
      return window.localStorage.getItem(key);
    }

    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string) {
    if (isWeb) {
      window.localStorage.setItem(key, value);
      return;
    }

    const SecureStore = await import("expo-secure-store");
    return SecureStore.setItemAsync(key, value);
  },

  async deleteItem(key: string) {
    if (isWeb) {
      window.localStorage.removeItem(key);
      return;
    }

    const SecureStore = await import("expo-secure-store");
    return SecureStore.deleteItemAsync(key);
  },
};

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  is_staff: boolean;
  is_tecnico: boolean;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  cadastro: (
    username: string,
    email: string,
    password: string,
    first_name: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarUsuario() {
    try {
      const savedToken = await storage.getItem("access_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;

      const response = await api.get("/auth/me");

      setToken(savedToken);
      setUser(response.data);
    } catch {
      await storage.deleteItem("access_token");
      await storage.deleteItem("refresh_token");

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username: string, password: string) {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    const { access, refresh } = response.data;

    await storage.setItem("access_token", access);
    await storage.setItem("refresh_token", refresh);

    api.defaults.headers.common.Authorization = `Bearer ${access}`;

    const me = await api.get("/auth/me");

    setToken(access);
    setUser(me.data);
  }

  async function cadastro(
    username: string,
    email: string,
    password: string,
    first_name: string
  ) {
    const response = await api.post("/auth/cadastro", {
      username,
      email,
      password,
      first_name,
    });

    const { access, refresh } = response.data;

    await storage.setItem("access_token", access);
    await storage.setItem("refresh_token", refresh);

    api.defaults.headers.common.Authorization = `Bearer ${access}`;

    const me = await api.get("/auth/me");

    setToken(access);
    setUser(me.data);
  }

  async function logout() {
    await storage.deleteItem("access_token");
    await storage.deleteItem("refresh_token");

    delete api.defaults.headers.common.Authorization;

    setUser(null);
    setToken(null);
  }

  useEffect(() => {
    carregarUsuario();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        cadastro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}