import { useState, useEffect, useCallback } from 'react';
import BiometricAuthService, { BiometricContext } from '../services/biometricAuthService';
import * as LocalAuthentication from 'expo-local-authentication';

export interface UseBiometricAuthReturn {
  isEnabled: boolean;
  isAvailable: boolean;
  isEnabledForTransactions: boolean;
  isEnabledForLogin: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  biometricNames: string[];
  isLoading: boolean;
  enableBiometric: () => Promise<{ success: boolean; error?: string }>;
  disableBiometric: () => Promise<{ success: boolean; error?: string }>;
  authenticate: (context?: BiometricContext, reason?: string) => Promise<{ success: boolean; error?: string }>;
  authenticateTransaction: (transactionType?: string, amount?: string) => Promise<{ success: boolean; error?: string }>;
  setTransactionBiometric: (enabled: boolean) => Promise<{ success: boolean; error?: string }>;
  setLoginBiometric: (enabled: boolean) => Promise<{ success: boolean; error?: string }>;
  checkAvailability: () => Promise<void>;
}

export const useBiometricAuth = (): UseBiometricAuthReturn => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabledForTransactions, setIsEnabledForTransactions] = useState(false);
  const [isEnabledForLogin, setIsEnabledForLogin] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [biometricNames, setBiometricNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAvailability = useCallback(async () => {
    try {
      const available = await BiometricAuthService.isAvailable();
      const types = await BiometricAuthService.getSupportedTypes();
      const names = BiometricAuthService.getBiometricTypeNames(types);
      
      setIsAvailable(available);
      setSupportedTypes(types);
      setBiometricNames(names);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
      setSupportedTypes([]);
      setBiometricNames([]);
    }
  }, []);

  const checkEnabled = useCallback(async () => {
    try {
      const enabled = await BiometricAuthService.isEnabled();
      const enabledForTransactions = await BiometricAuthService.isEnabledForTransactions();
      const enabledForLogin = await BiometricAuthService.isEnabledForLogin();
      
      setIsEnabled(enabled);
      setIsEnabledForTransactions(enabledForTransactions);
      setIsEnabledForLogin(enabledForLogin);
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      setIsEnabled(false);
      setIsEnabledForTransactions(false);
      setIsEnabledForLogin(false);
    }
  }, []);

  const enableBiometric = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await BiometricAuthService.enableBiometric();
      if (result.success) {
        await checkEnabled();
      }
      return result;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return {
        success: false,
        error: 'Failed to enable biometric authentication',
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkEnabled]);

  const disableBiometric = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await BiometricAuthService.disableBiometric();
      if (result.success) {
        setIsEnabled(false);
        setIsEnabledForTransactions(false);
        setIsEnabledForLogin(false);
      }
      return result;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return {
        success: false,
        error: 'Failed to disable biometric authentication',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticate = useCallback(async (context?: BiometricContext, reason?: string) => {
    if (!isEnabled || !isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication is not enabled or available',
      };
    }

    return await BiometricAuthService.authenticate(context, reason);
  }, [isEnabled, isAvailable]);

  const authenticateTransaction = useCallback(async (transactionType?: string, amount?: string) => {
    return await BiometricAuthService.authenticateTransaction(transactionType, amount);
  }, []);

  const setTransactionBiometric = useCallback(async (enabled: boolean) => {
    const result = await BiometricAuthService.setTransactionBiometric(enabled);
    if (result.success) {
      setIsEnabledForTransactions(enabled);
    }
    return result;
  }, []);

  const setLoginBiometric = useCallback(async (enabled: boolean) => {
    const result = await BiometricAuthService.setLoginBiometric(enabled);
    if (result.success) {
      setIsEnabledForLogin(enabled);
    }
    return result;
  }, []);

  useEffect(() => {
    const initializeBiometric = async () => {
      setIsLoading(true);
      await checkAvailability();
      await checkEnabled();
      setIsLoading(false);
    };

    initializeBiometric();
  }, [checkAvailability, checkEnabled]);

  return {
    isEnabled,
    isAvailable,
    isEnabledForTransactions,
    isEnabledForLogin,
    supportedTypes,
    biometricNames,
    isLoading,
    enableBiometric,
    disableBiometric,
    authenticate,
    authenticateTransaction,
    setTransactionBiometric,
    setLoginBiometric,
    checkAvailability,
  };
};
