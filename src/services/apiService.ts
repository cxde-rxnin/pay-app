import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// NOTE: Backend integration temporarily disabled.
// This ApiService is a local stub that simulates responses and avoids any network requests.

const SIMULATED_DELAY = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private static instance: ApiService;
  private tokenKey = '@auth_token';

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Token helpers (still use AsyncStorage locally)
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Health Check - always succeed locally
  async healthCheck(): Promise<ApiResponse<string>> {
    await SIMULATED_DELAY(200);
    return {
      success: true,
      data: 'local-backend-disabled',
      message: 'Backend integration disabled - running in local stub mode',
    };
  }

  // Authentication Methods (simulate flows locally)
  async signup(userData: {
    email: string;
    usertag: string;
    loginPin: string;
    transactionPin: string;
    duressPin: string;
    bvn: string;
  }): Promise<ApiResponse<{ userId: string }>> {
    await SIMULATED_DELAY(400);
    // Simulate always-successful signup in local mode
    return { success: true, data: { userId: 'local-user-1' }, message: 'Signup simulated' };
  }

  async verifyOTP(userData: { userId: string; otp: string; }): Promise<ApiResponse<{ token: string; user: any }>> {
    await SIMULATED_DELAY(300);
    const token = 'local-token';
    await this.setAuthToken(token);
    return { success: true, data: { token, user: { id: userData.userId, email: 'local@local', usertag: 'local' } }, message: 'OTP verified (simulated)' };
  }

  async login(credentials: { email: string; loginPin: string; }): Promise<ApiResponse<{ token: string; user: any }>> {
    await SIMULATED_DELAY(300);
    // Accept any credentials in stub mode
    const token = 'local-token';
    await this.setAuthToken(token);
    return { success: true, data: { token, user: { id: 'local-user-1', email: credentials.email, usertag: 'local' } }, message: 'Login simulated' };
  }

  async checkEmailAvailability(data: { email: string; }): Promise<ApiResponse<{ userId: string }>> {
    await SIMULATED_DELAY(200);
    // Simulate email available
    return { success: true, data: { userId: 'local-user-1' }, message: 'Email available (simulated)' };
  }

  async verifyEmail(data: { userId: string; code: string; }): Promise<ApiResponse> {
    await SIMULATED_DELAY(200);
    return { success: true, message: 'Email verified (simulated)' };
  }

  async resetPin(data: { email: string; newPin: string; pinType: 'login' | 'transaction'; }): Promise<ApiResponse> {
    await SIMULATED_DELAY(200);
    return { success: true, message: 'PIN reset simulated' };
  }

  // Account Methods - simulated responses
  async createVirtualAccount(): Promise<ApiResponse<{ accountNumber: string; bankName: string }>> {
    await SIMULATED_DELAY(300);
    return { success: true, data: { accountNumber: '0000000000', bankName: 'Local Bank' }, message: 'Virtual account created (simulated)' };
  }

  async getAccountBalance(): Promise<ApiResponse<{ balance: number }>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: { balance: 100000 }, message: 'Balance (simulated)' };
  }

  async getAccountDetails(): Promise<ApiResponse<{ accountNumber: string; balance: number; usertag: string; kycTier: string; }>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: { accountNumber: '0000000000', balance: 100000, usertag: 'local', kycTier: 'A' }, message: 'Account details (simulated)' };
  }

  // Transfer Methods
  async internalTransfer(transferData: { recipientUsertag: string; amount: number; description?: string; transactionPin: string; }): Promise<ApiResponse<{ transactionId: string; reference: string }>> {
    await SIMULATED_DELAY(300);
    return { success: true, data: { transactionId: `tx-${Date.now()}`, reference: `ref-${Date.now()}` }, message: 'Internal transfer simulated' };
  }

  async externalTransfer(transferData: { recipientAccountNumber: string; recipientBankCode: string; amount: number; description?: string; transactionPin: string; }): Promise<ApiResponse<{ transactionId: string; reference: string }>> {
    await SIMULATED_DELAY(400);
    return { success: true, data: { transactionId: `tx-${Date.now()}`, reference: `ref-${Date.now()}` }, message: 'External transfer simulated' };
  }

  // Service Methods (Airtime/Data)
  async purchaseAirtime(data: { network: string; phoneNumber: string; amount: number; transactionPin: string; }): Promise<ApiResponse<{ transactionId: string; reference: string }>> {
    await SIMULATED_DELAY(300);
    return { success: true, data: { transactionId: `airtime-${Date.now()}`, reference: `ref-${Date.now()}` }, message: 'Airtime purchase simulated' };
  }

  async purchaseData(data: { network: string; phoneNumber: string; dataBundle: string; amount: number; transactionPin: string; }): Promise<ApiResponse<{ transactionId: string; reference: string }>> {
    await SIMULATED_DELAY(300);
    return { success: true, data: { transactionId: `data-${Date.now()}`, reference: `ref-${Date.now()}` }, message: 'Data purchase simulated' };
  }

  // KYC Methods
  async updateKYC(kycData: { bvn?: string; nin?: string; selfieUrl?: string; utilityBillUrl?: string; }): Promise<ApiResponse> {
    await SIMULATED_DELAY(300);
    return { success: true, message: 'KYC updated (simulated)' };
  }

  async getKYCStatus(): Promise<ApiResponse<{ kycTier: string; kycVerified: boolean; kycDocuments: any; }>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: { kycTier: 'A', kycVerified: true, kycDocuments: [] }, message: 'KYC status (simulated)' };
  }

  async submitBVN(bvn: string): Promise<ApiResponse> {
    await SIMULATED_DELAY(300);
    return { success: true, message: 'BVN submitted (simulated)' };
  }

  // Transaction History
  async getTransactionHistory(params?: { page?: number; limit?: number; type?: string; }): Promise<ApiResponse<{ transactions: any[]; pagination: { page: number; limit: number; total: number; pages: number; }; }>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: { transactions: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }, message: 'Transaction history (simulated)' };
  }

  // Notification Methods
  async getNotifications(): Promise<ApiResponse<any[]>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: [], message: 'Notifications (simulated)' };
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    await SIMULATED_DELAY(100);
    return { success: true, message: 'Marked as read (simulated)' };
  }

  // Utility Methods
  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }

  // Bank Information
  async getBankList(): Promise<ApiResponse<{ banks: Array<{ name: string; code: string; slug: string; }>; }>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: { banks: [{ name: 'Local Bank', code: '000', slug: 'local' }] }, message: 'Banks (simulated)' };
  }

  async verifyAccountNumber(data: { accountNumber: string; bankCode: string; }): Promise<ApiResponse<{ accountName: string; accountNumber: string; bankName: string; }>> {
    await SIMULATED_DELAY(200);
    return { success: true, data: { accountName: 'Local Account', accountNumber: data.accountNumber, bankName: 'Local Bank' }, message: 'Account verified (simulated)' };
  }

  // User lookup for internal transfers
  async lookupUser(usertag: string): Promise<ApiResponse<{ usertag: string; displayName?: string; avatar?: string; }>> {
    await SIMULATED_DELAY(150);
    return { success: true, data: { usertag, displayName: 'Local User', avatar: undefined }, message: 'User lookup (simulated)' };
  }
}

export default ApiService.getInstance();
