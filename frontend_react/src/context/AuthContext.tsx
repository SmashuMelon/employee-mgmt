import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import api, { setAuthToken } from '../services/api';
import { Employee } from '../types/employee';

type AuthContextType = {
  user: Employee | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const authTokenKey = 'employee-auth-token';
const authUserKey = 'employee-auth-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(authTokenKey)
  );
  const [user, setUser] = useState<Employee | null>(() => {
    const persisted = localStorage.getItem(authUserKey);
    return persisted ? JSON.parse(persisted) : null;
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const persistUser = (profile: Employee | null) => {
    if (profile) {
      localStorage.setItem(authUserKey, JSON.stringify(profile));
    } else {
      localStorage.removeItem(authUserKey);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/employees/login/', {
        username,
        password,
      });

      const authToken = response.data.token;
      if (!authToken) {
        throw new Error('Missing auth token');
      }

      setToken(authToken);
      localStorage.setItem(authTokenKey, authToken);
      setAuthToken(authToken);

      let profile = response.data.profile as Employee | undefined;
      if (!profile) {
        const employeesResponse = await api.get('/api/employees/');
        const employees = employeesResponse.data as Employee[];
        profile = employees.find(
          (employee) =>
            employee.email.toLowerCase() === username.toLowerCase() ||
            employee.name.toLowerCase() === username.toLowerCase()
        );
      }

      if (!profile) {
        throw new Error('Unable to resolve authenticated user profile');
      }

      setUser(profile);
      persistUser(profile);
    } catch (error) {
      toast.error('Login failed. Please check your username and password.');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(authUserKey);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
