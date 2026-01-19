import { useState, useEffect } from "react";
import apiClient from "@/api/client";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pos_token");
    const storedUser = localStorage.getItem("pos_user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password });
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem("pos_token", token);
        localStorage.setItem("pos_user", JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      }
      return { success: false, error: response.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem("pos_user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };
}
