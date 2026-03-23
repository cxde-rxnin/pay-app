import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

interface User {
  id: string;
  email: string;
  usertag: string;
  balance: number;
  accountNumber: string;
  kycTier: string;
  kycVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, loginPin: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    email: string;
    usertag: string;
    loginPin: string;
    transactionPin: string;
    duressPin: string;
    bvn: string;
  }) => Promise<{ success: boolean; error?: string; userId?: string }>;
  verifyOTP: (userId: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await apiService.isAuthenticated();
      
      if (authenticated) {
        // Fetch user data
        await refreshUser();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getAccountDetails();
      
      if (response.success && response.data) {
        const userData: User = {
          id: '', // Will be populated from backend
          email: '', // Will be populated from backend
          usertag: response.data.usertag,
          balance: response.data.balance,
          accountNumber: response.data.accountNumber,
          kycTier: response.data.kycTier,
          kycVerified: true, // Will be populated from backend
        };
        
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.error || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout automatically, just log the error
    }
  };

  const login = async (email: string, loginPin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, loginPin });
      
      if (response.success && response.data) {
        await refreshUser();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    usertag: string;
    loginPin: string;
    transactionPin: string;
    duressPin: string;
    bvn: string;
  }): Promise<{ success: boolean; error?: string; userId?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.signup(userData);
      
      if (response.success && response.data) {
        return { 
          success: true, 
          userId: response.data.userId 
        };
      } else {
        return { 
          success: false, 
          error: response.error || 'Signup failed' 
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (userId: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.verifyOTP({ userId, otp });
      
      if (response.success && response.data) {
        await refreshUser();
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'OTP verification failed' 
        };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OTP verification failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    verifyOTP,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
