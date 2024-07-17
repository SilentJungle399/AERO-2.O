// components/AuthProvider.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Define types for User and AuthContextValue
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  // Add other properties as needed
}

interface AuthContextValue {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Create context with initial null value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Define Props type for AuthProvider component
interface AuthProviderProps {
  children: ReactNode; // ReactNode allows any valid React child: JSX, strings, components, etc.
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/users/login', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          logout(); // Log out user on error fetching user
        }
      }
    };
    fetchUser();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
    router.push('/'); // Redirect to home page after successful login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login'); // Redirect to login page after logout
  };

  // Ensure AuthContext.Provider receives the correct value type
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
