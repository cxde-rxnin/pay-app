import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
export const USER_LOGIN_PIN_KEY = '@user_login_pin';
export const USER_DATA_KEY = '@user_data';

export class AuthStorageService {
  /**
   * Mark onboarding as completed
   */
  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  }

  /**
   * Check if onboarding is completed
   */
  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Store user login PIN (hashed)
   */
  static async setLoginPin(hashedPin: string): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_LOGIN_PIN_KEY, hashedPin);
    } catch (error) {
      console.error('Error storing login PIN:', error);
    }
  }

  /**
   * Check if user has login PIN set
   */
  static async hasLoginPin(): Promise<boolean> {
    try {
      const pin = await AsyncStorage.getItem(USER_LOGIN_PIN_KEY);
      return pin !== null;
    } catch (error) {
      console.error('Error checking login PIN:', error);
      return false;
    }
  }

  /**
   * Store user profile data
   */
  static async setUserData(userData: object): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Check if user data exists
   */
  static async hasUserData(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(USER_DATA_KEY);
      return data !== null;
    } catch (error) {
      console.error('Error checking user data:', error);
      return false;
    }
  }

  /**
   * Check if user is a returning user (has completed setup)
   */
  static async isReturningUser(): Promise<boolean> {
    try {
      const onboardingCompleted = await this.isOnboardingCompleted();
      const hasPin = await this.hasLoginPin();
      const hasData = await this.hasUserData();
      
      return onboardingCompleted && (hasPin || hasData);
    } catch (error) {
      console.error('Error checking returning user status:', error);
      return false;
    }
  }

  /**
   * Reset all auth data (for testing or logout)
   */
  static async resetAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        ONBOARDING_COMPLETED_KEY,
        USER_LOGIN_PIN_KEY,
        USER_DATA_KEY,
      ]);
    } catch (error) {
      console.error('Error resetting auth data:', error);
    }
  }

  /**
   * Mark user as set up (for testing)
   */
  static async markUserAsSetUp(): Promise<void> {
    try {
      await this.setOnboardingCompleted();
      await this.setLoginPin('dummy_hash_1234'); // In real app, this would be properly hashed
      await this.setUserData({ 
        name: 'Test User', 
        email: 'test@example.com',
        setupDate: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error marking user as set up:', error);
    }
  }
}

export default AuthStorageService;
