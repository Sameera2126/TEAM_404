import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Language } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  selectedRole: UserRole | null;
  language: Language;
  setUser: (user: User | null) => void;
  setSelectedRole: (role: UserRole | null) => void;
  setLanguage: (lang: Language) => void;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  farmer: {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    role: 'farmer',
    language: 'en',
    avatar: undefined,
    location: 'Guntur, Andhra Pradesh',
    verified: true,
  },
  expert: {
    id: '2',
    name: 'Dr. Priya Sharma',
    phone: '+91 98765 43211',
    role: 'expert',
    language: 'en',
    avatar: undefined,
    location: 'Hyderabad, Telangana',
    verified: true,
  },
  government: {
    id: '3',
    name: 'Arun Patel',
    phone: '+91 98765 43212',
    role: 'government',
    language: 'en',
    avatar: undefined,
    location: 'Amaravati, Andhra Pradesh',
    verified: true,
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check for stored token and user data on mount
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Update localStorage when user changes
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (phone: string, role: UserRole) => {
    const mockUser = mockUsers[role];
    setUser({ ...mockUser, phone, language });
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        selectedRole,
        language,
        setUser,
        setSelectedRole,
        setLanguage,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
