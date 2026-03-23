import { useState } from 'react';
import apiService from '../services/apiService';

interface TransferResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  reference?: string;
}

interface BankInfo {
  name: string;
  code: string;
  slug: string;
}

interface AccountVerification {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export const useTransfers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<BankInfo[]>([]);

  // Internal Transfer (Lemo to Lemo)
  const internalTransfer = async (
    recipientUsertag: string,
    amount: number,
    transactionPin: string,
    description?: string
  ): Promise<TransferResult> => {
    try {
      setIsLoading(true);
      const response = await apiService.internalTransfer({
        recipientUsertag,
        amount,
        description,
        transactionPin,
      });

      if (response.success && response.data) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          reference: response.data.reference,
        };
      } else {
        return {
          success: false,
          error: response.error || 'Transfer failed',
        };
      }
    } catch (error) {
      console.error('Internal transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // External Transfer (Lemo to Bank)
  const externalTransfer = async (
    recipientAccountNumber: string,
    recipientBankCode: string,
    amount: number,
    transactionPin: string,
    description?: string
  ): Promise<TransferResult> => {
    try {
      setIsLoading(true);
      const response = await apiService.externalTransfer({
        recipientAccountNumber,
        recipientBankCode,
        amount,
        description,
        transactionPin,
      });

      if (response.success && response.data) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          reference: response.data.reference,
        };
      } else {
        return {
          success: false,
          error: response.error || 'Transfer failed',
        };
      }
    } catch (error) {
      console.error('External transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Get list of banks for external transfers
  const loadBanks = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.getBankList();

      if (response.success && response.data) {
        setBanks(response.data.banks);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to load banks',
        };
      }
    } catch (error) {
      console.error('Load banks error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load banks',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify account number for external transfers
  const verifyAccountNumber = async (
    accountNumber: string,
    bankCode: string
  ): Promise<{ success: boolean; data?: AccountVerification; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.verifyAccountNumber({
        accountNumber,
        bankCode,
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: response.error || 'Account verification failed',
        };
      }
    } catch (error) {
      console.error('Account verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Account verification failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Lookup user for internal transfers
  const lookupUser = async (
    usertag: string
  ): Promise<{ 
    success: boolean; 
    data?: { usertag: string; displayName?: string; avatar?: string }; 
    error?: string 
  }> => {
    try {
      setIsLoading(true);
      const response = await apiService.lookupUser(usertag);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: response.error || 'User not found',
        };
      }
    } catch (error) {
      console.error('User lookup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'User lookup failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    banks,
    internalTransfer,
    externalTransfer,
    loadBanks,
    verifyAccountNumber,
    lookupUser,
  };
};
