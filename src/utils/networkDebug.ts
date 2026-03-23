import { Platform } from 'react-native';

export const getNetworkInfo = () => {
  const platform = Platform.OS;
  const isDev = __DEV__;
  
  let expectedBaseURL = '';
  let troubleshooting = '';
  
  if (isDev) {
    if (platform === 'android') {
      expectedBaseURL = 'http://10.0.2.2:5000';
      troubleshooting = `
Android Emulator Troubleshooting:
• Make sure backend is running on localhost:5000
• Android emulator maps 10.0.2.2 to host localhost
• If using physical device, use your computer's IP address instead
• Run: adb reverse tcp:5000 tcp:5000 (alternative method)
      `;
    } else if (platform === 'ios') {
      expectedBaseURL = 'http://localhost:5000';
      troubleshooting = `
iOS Simulator Troubleshooting:
• Make sure backend is running on localhost:5000
• iOS simulator can access localhost directly
• If using physical device, use your computer's IP address instead
      `;
    } else {
      expectedBaseURL = 'http://localhost:5000';
      troubleshooting = `
Web/Other Platform:
• Make sure backend is running on localhost:5000
• Should work with standard localhost
      `;
    }
  } else {
    expectedBaseURL = 'https://your-production-api.com';
    troubleshooting = 'Production environment - check production URL configuration';
  }
  
  return {
    platform,
    isDev,
    expectedBaseURL,
    troubleshooting,
  };
};

export const testNetworkConnectivity = async () => {
  const info = getNetworkInfo();
  const results = [];
  
  // Test different URL variations
  const urlsToTest = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://10.0.2.2:5000', // Android emulator
    'http://172.20.10.10:5000', // Your computer's IP address
  ];
  
  for (const url of urlsToTest) {
    try {
      console.log(`🔍 Testing: ${url}`);
      const response = await fetch(url, { 
        method: 'GET',
      });
      
      const text = await response.text();
      
      results.push({
        url,
        success: response.ok,
        status: response.status,
        response: text.substring(0, 100), // First 100 chars
      });
    } catch (error) {
      results.push({
        url,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return {
    networkInfo: info,
    testResults: results,
  };
};
