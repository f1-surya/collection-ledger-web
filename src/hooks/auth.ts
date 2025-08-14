import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: AuthTokens | null;
}

export default function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    tokens: null,
  });

  useEffect(() => {
    const accessToken = sessionStorage.accessToken;
    const refreshToken = sessionStorage.refreshToken;

    if (accessToken && refreshToken) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        tokens: {
          accessToken,
          refreshToken,
        },
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        tokens: null,
      });
    }
  }, []);

  const login = useCallback((tokens: AuthTokens) => {
    sessionStorage.setItem("accessToken", tokens.accessToken);
    sessionStorage.setItem("refreshToken", tokens.refreshToken);

    api.defaults.headers.common["Authorization"] =
      `Bearer ${tokens.accessToken}`;

    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      tokens,
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    delete api.defaults.headers.common["Authorization"];

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      tokens: null,
    });
  }, []);

  return { ...authState, login, logout };
}
