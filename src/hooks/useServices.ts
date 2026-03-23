import { useState } from 'react';
import apiService from '../services/apiService';

interface ServiceResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  reference?: string;
}

export const useServices = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Purchase Airtime
  const purchaseAirtime = async (
    network: string,
    phoneNumber: string,
    amount: number,
    transactionPin: string
  ): Promise<ServiceResult> => {
    try {
      setIsLoading(true);
      const response = await apiService.purchaseAirtime({
        network,
        phoneNumber,
        amount,
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
          error: response.error || 'Airtime purchase failed',
        };
      }
    } catch (error) {
      console.error('Airtime purchase error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Airtime purchase failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Purchase Data
  const purchaseData = async (
    network: string,
    phoneNumber: string,
    dataBundle: string,
    amount: number,
    transactionPin: string
  ): Promise<ServiceResult> => {
    try {
      setIsLoading(true);
      const response = await apiService.purchaseData({
        network,
        phoneNumber,
        dataBundle,
        amount,
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
          error: response.error || 'Data purchase failed',
        };
      }
    } catch (error) {
      console.error('Data purchase error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Data purchase failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    purchaseAirtime,
    purchaseData,
  };
};
