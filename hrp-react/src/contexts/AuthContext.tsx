import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, AuthContextType } from "../types/auth";
import { ROLES } from "../constants/rbac";
import { api } from "../services/api";

const DEMO_USERS: Record<string, { user: User; password: string }> = {
  "admin@example.com": {
    password: "password123",
    user: { id: "demo-1", email: "admin@example.com", name: "Admin User", role: "admin", department: "Management", createdAt: new Date().toISOString() },
  },
  "hr@example.com": {
    password: "password123",
    user: { id: "demo-2", email: "hr@example.com", name: "HR Manager", role: "hr", department: "Human Resources", createdAt: new Date().toISOString() },
  },
  "owner@example.com": {
    password: "password123",
    user: { id: "demo-3", email: "owner@example.com", name: "Company Owner", role: "owner", department: "Executive", createdAt: new Date().toISOString() },
  },
  "employee@example.com": {
    password: "password123",
    user: { id: "demo-4", email: "employee@example.com", name: "Employee User", role: "employee", department: "Engineering", createdAt: new Date().toISOString() },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      // Try real API first
      const response = await api.post<{ user: User; token: string }>(
        "/auth/login",
        { email, password }
      );

      if (!response.error && response.data) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setIsLoading(false);
        return;
      }

      // If the server responded with "Invalid credentials", don't fall back
      if (response.error === "Invalid credentials") {
        throw new Error("Invalid email or password");
      }

      // Server unreachable — try demo credentials
      const demo = DEMO_USERS[email];
      if (demo && demo.password === password) {
        setUser(demo.user);
        localStorage.setItem("user", JSON.stringify(demo.user));
        localStorage.setItem("token", `demo_${demo.user.id}`);
        setIsLoading(false);
        return;
      }

      throw new Error("Invalid email or password");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const hasPermission = useCallback(
    (
      resource: string,
      action: "create" | "read" | "update" | "delete",
    ): boolean => {
      if (!user) return false;

      const role = ROLES[user.role];
      if (!role) return false;

      return role.permissions.some(
        (perm) => perm.resource === resource && perm.actions.includes(action),
      );
    },
    [user],
  );

  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user],
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
