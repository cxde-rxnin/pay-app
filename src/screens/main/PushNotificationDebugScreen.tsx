import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import PushNotificationService from '../../services/pushNotificationService';
import colors from '../../theme/colors';

/**
 * DEBUG SCREEN: Test Push Notifications
 * 
 * To use this screen:
 * 1. Add it to your navigator (e.g., in AppTabs or as a modal)
 * 2. Navigate to it
 * 3. Use the buttons to test different notification scenarios
 * 
 * IMPORTANT: After tapping a test button, MINIMIZE THE APP immediately
 * to see if the notification appears in your iPhone's notification tray!
 */

const PushNotificationDebugScreen: React.FC = () => {
  const { pushToken, permissionStatus, registerForPushNotifications } = usePushNotifications();
  const [lastTest, setLastTest] = useState<string>('');

  const testNotification = async (type: string, message: string) => {
    try {
      setLastTest(`Testing ${type}...`);
      console.log(`🧪 Testing ${type} notification`);
      
      await PushNotificationService.scheduleLocalNotification(
        `Test: ${type}`,
        message,
        { test: true, type: 'test' },
        2
      );
      
      setLastTest(`✅ ${type} notification scheduled`);
      
      Alert.alert(
        '✅ Notification Scheduled',
        `The ${type} notification will appear in 2 seconds.\n\n⚠️ MINIMIZE THE APP NOW (press home button) to see it in your notification tray!`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      setLastTest(`❌ Error: ${error.message}`);
      console.error('❌ Test failed:', error);
    }
  };

  const testTransactionNotification = async () => {
    try {
      setLastTest('Testing transaction...');
      console.log('🧪 Testing transaction notification');
      
      await PushNotificationService.sendTransactionNotification(
        'sent',
        5000,
        'You sent ₦5,000 to @testuser'
      );
      
      setLastTest('✅ Transaction notification scheduled');
      
      Alert.alert(
        '✅ Transaction Notification Scheduled',
        'The notification will appear in 2 seconds.\n\n⚠️ MINIMIZE THE APP NOW to see it!',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      setLastTest(`❌ Error: ${error.message}`);
      console.error('❌ Test failed:', error);
    }
  };

  const checkPermissions = async () => {
    const status = await PushNotificationService.getPermissionsStatus();
    Alert.alert(
      'Permission Status',
      `Current status: ${status}\n\nToken: ${pushToken ? 'Generated ✅' : 'Not generated ❌'}`,
      [{ text: 'OK' }]
    );
  };

  const requestPermissions = async () => {
    await registerForPushNotifications();
    Alert.alert(
      'Permissions Requested',
      'Check the console for the result',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔔 Push Notification Debugger</Text>
        
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Status</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Permission:</Text>
            <Text style={[
              styles.statusValue,
              { color: permissionStatus === 'granted' ? '#4CAF50' : '#F44336' }
            ]}>
              {permissionStatus}
            </Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Push Token:</Text>
            <Text style={[
              styles.statusValue,
              { color: pushToken ? '#4CAF50' : '#F44336' }
            ]}>
              {pushToken ? '✅ Generated' : '❌ Not generated'}
            </Text>
          </View>
          {pushToken && (
            <Text style={styles.tokenText} numberOfLines={2}>
              {pushToken}
            </Text>
          )}
          {lastTest && (
            <View style={styles.lastTestBox}>
              <Text style={styles.lastTestText}>{lastTest}</Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={[styles.section, styles.warningBox]}>
          <Text style={styles.warningTitle}>⚠️ IMPORTANT</Text>
          <Text style={styles.warningText}>
            After tapping any test button:{'\n'}
            1. Wait for the alert{'\n'}
            2. Tap "OK"{'\n'}
            3. IMMEDIATELY press HOME button{'\n'}
            4. Wait 3 seconds{'\n'}
            5. Swipe down to see notification!
          </Text>
        </View>

        {/* Permission Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Permissions</Text>
          <TouchableOpacity style={styles.button} onPress={checkPermissions}>
            <Text style={styles.buttonText}>Check Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={requestPermissions}
          >
            <Text style={styles.buttonText}>Request Permissions</Text>
          </TouchableOpacity>
        </View>

        {/* Simple Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Simple Tests</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => testNotification('Basic', 'This is a basic test notification')}
          >
            <Text style={styles.buttonText}>Test Basic Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => testNotification('Success', 'This is a success notification ✅')}
          >
            <Text style={styles.buttonText}>Test Success Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => testNotification('Error', 'This is an error notification ❌')}
          >
            <Text style={styles.buttonText}>Test Error Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💸 Transaction Test</Text>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={testTransactionNotification}
          >
            <Text style={styles.buttonText}>Test Transaction Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Console Log Helper */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 What to Check</Text>
          <Text style={styles.infoText}>
            Look for these in the console:{'\n\n'}
            ✅ Push Token Generated{'\n'}
            📲 Scheduling notification{'\n'}
            ✅ Notification scheduled with ID{'\n\n'}
            
            Then check your notification tray!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tokenText: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  lastTestBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  lastTestText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 20,
  },
});

export default PushNotificationDebugScreen;
