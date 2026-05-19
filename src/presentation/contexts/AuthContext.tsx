import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../../domain/entities/User';
import { AuthRepository } from '../../data/repositories/AuthRepository';
import { StorageService } from '../../infra/storage/StorageService';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const authRepo = new AuthRepository();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const [storedToken, storedUser] = await Promise.all([
        StorageService.getToken(),
        StorageService.getUser(),
      ]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const { token: jwt, user: profile } = await authRepo.login(email, password);
    await Promise.all([
      StorageService.saveToken(jwt),
      StorageService.saveUser(profile),
    ]);
    setToken(jwt);
    setUser(profile);
  }

  async function register(name: string, email: string, password: string) {
    await authRepo.register(name, email, password);
  }

  async function logout() {
    await Promise.all([StorageService.removeToken(), StorageService.removeUser()]);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
