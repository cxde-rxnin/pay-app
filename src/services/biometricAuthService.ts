import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_SETTINGS_KEY = '@biometric_settings';

export interface BiometricSettings {
  isEnabled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  lastEnabledDate: string;
  enabledForTransactions: boolean;
  enabledForLogin: boolean;
}

export enum BiometricContext {
  LOGIN = 'login',
  TRANSACTION = 'transaction',
  SETTINGS = 'settings',
  GENERAL = 'general'
}

export class BiometricAuthService {
  private static instance: BiometricAuthService;

  private constructor() {}

  static getInstance(): BiometricAuthService {
    if (!BiometricAuthService.instance) {
      BiometricAuthService.instance = new BiometricAuthService();
    }
    return BiometricAuthService.instance;
  }

  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return isAvailable && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric authentication types
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  }

  /**
   * Get friendly names for biometric types
   */
  getBiometricTypeNames(types: LocalAuthentication.AuthenticationType[]): string[] {
    const names: string[] = [];
    
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      names.push('Fingerprint');
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      names.push('Face ID');
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      names.push('Iris');
    }
    
    return names.length > 0 ? names : ['Biometric'];
  }

  /**
   * Get context-specific authentication messages
   */
  private getContextMessage(context: BiometricContext): string {
    switch (context) {
      case BiometricContext.LOGIN:
        return 'Use biometric authentication to log in to your account';
      case BiometricContext.TRANSACTION:
        return 'Authenticate to authorize this transaction';
      case BiometricContext.SETTINGS:
        return 'Verify your identity to access security settings';
      case BiometricContext.GENERAL:
      default:
        return 'Authenticate to access your account';
    }
  }

  /**
   * Authenticate using biometrics with context-specific messaging
   */
  async authenticate(
    context: BiometricContext = BiometricContext.GENERAL,
    customReason?: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const isAvailable = await this.isAvailable();
      
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device or no biometrics are enrolled.',
        };
      }

      // Get context-specific prompt message
      const reason = customReason || this.getContextMessage(context);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false, // Set to true for Expo Go to show Face ID
      });

      if (result.success) {
        return { success: true };
      } else {
        let errorMessage = 'Authentication failed';
        
        if (result.error === 'user_cancel') {
          errorMessage = 'Authentication was cancelled';
        } else if (result.error === 'user_fallback') {
          errorMessage = 'User chose to use fallback authentication';
        } else if (result.error === 'system_cancel') {
          errorMessage = 'Authentication was cancelled by the system';
        } else if (result.error === 'passcode_not_set') {
          errorMessage = 'No passcode set on device';
        } else if (result.error === 'not_available') {
          errorMessage = 'Biometric authentication is not available';
        } else if (result.error === 'not_enrolled') {
          errorMessage = 'No biometrics enrolled on this device';
        } else if (result.error === 'lockout') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (result.error === 'authentication_failed') {
          errorMessage = 'Authentication failed. Please try again.';
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during authentication',
      };
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometric(): Promise<{ success: boolean; error?: string }> {
    try {
      const isAvailable = await this.isAvailable();
      
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available. Please ensure biometrics are set up on your device.',
        };
      }

      // Test authentication before enabling
      const authResult = await this.authenticate(
        BiometricContext.SETTINGS,
        'Verify your identity to enable biometric authentication'
      );
      
      if (!authResult.success) {
        return authResult;
      }

      // Save biometric settings
      const supportedTypes = await this.getSupportedTypes();
      const settings: BiometricSettings = {
        isEnabled: true,
        supportedTypes,
        lastEnabledDate: new Date().toISOString(),
        enabledForTransactions: true,
        enabledForLogin: true,
      };

      await AsyncStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify(settings));
      
      console.log('✅ Biometric authentication enabled successfully');
      return { success: true };
    } catch (error) {
      console.error('Error enabling biometric authentication:', error);
      return {
        success: false,
        error: 'Failed to enable biometric authentication',
      };
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<{ success: boolean; error?: string }> {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_SETTINGS_KEY);
      console.log('✅ Biometric authentication disabled');
      return { success: true };
    } catch (error) {
      console.error('Error disabling biometric authentication:', error);
      return {
        success: false,
        error: 'Failed to disable biometric authentication',
      };
    }
  }

  /**
   * Check if biometric authentication is enabled
   */
  async isEnabled(): Promise<boolean> {
    try {
      const settings = await AsyncStorage.getItem(BIOMETRIC_SETTINGS_KEY);
      if (!settings) return false;
      
      const parsed: BiometricSettings = JSON.parse(settings);
      return parsed.isEnabled;
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }

  /**
   * Get current biometric settings
   */
  async getSettings(): Promise<BiometricSettings | null> {
    try {
      const settings = await AsyncStorage.getItem(BIOMETRIC_SETTINGS_KEY);
      if (!settings) return null;
      
      return JSON.parse(settings);
    } catch (error) {
      console.error('Error getting biometric settings:', error);
      return null;
    }
  }

  /**
   * Check if biometric authentication is enabled for transactions
   */
  async isEnabledForTransactions(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      return !!(settings?.isEnabled && settings?.enabledForTransactions);
    } catch (error) {
      console.error('Error checking transaction biometric status:', error);
      return false;
    }
  }

  /**
   * Check if biometric authentication is enabled for login
   */
  async isEnabledForLogin(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      return !!(settings?.isEnabled && settings?.enabledForLogin);
    } catch (error) {
      console.error('Error checking login biometric status:', error);
      return false;
    }
  }

  /**
   * Update transaction biometric preference
   */
  async setTransactionBiometric(enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSettings = await this.getSettings();
      if (!currentSettings?.isEnabled) {
        return {
          success: false,
          error: 'Biometric authentication must be enabled first',
        };
      }

      const updatedSettings: BiometricSettings = {
        ...currentSettings,
        enabledForTransactions: enabled,
      };

      await AsyncStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify(updatedSettings));
      return { success: true };
    } catch (error) {
      console.error('Error updating transaction biometric setting:', error);
      return {
        success: false,
        error: 'Failed to update transaction biometric setting',
      };
    }
  }

  /**
   * Update login biometric preference
   */
  async setLoginBiometric(enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSettings = await this.getSettings();
      if (!currentSettings?.isEnabled) {
        return {
          success: false,
          error: 'Biometric authentication must be enabled first',
        };
      }

      const updatedSettings: BiometricSettings = {
        ...currentSettings,
        enabledForLogin: enabled,
      };

      await AsyncStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify(updatedSettings));
      return { success: true };
    } catch (error) {
      console.error('Error updating login biometric setting:', error);
      return {
        success: false,
        error: 'Failed to update login biometric setting',
      };
    }
  }

  /**
   * Authenticate for transaction signing
   */
  async authenticateTransaction(
    transactionType: string = 'transaction',
    amount?: string
  ): Promise<{ success: boolean; error?: string }> {
    const isEnabledForTransactions = await this.isEnabledForTransactions();
    
    if (!isEnabledForTransactions) {
      return {
        success: false,
        error: 'Biometric authentication is not enabled for transactions',
      };
    }

    const reason = amount 
      ? `Authenticate to authorize ${transactionType} of ${amount}`
      : `Authenticate to authorize this ${transactionType}`;

    return await this.authenticate(BiometricContext.TRANSACTION, reason);
  }
}

export default BiometricAuthService.getInstance();
