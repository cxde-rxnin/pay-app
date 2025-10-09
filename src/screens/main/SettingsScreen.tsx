import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { useNotificationPreferences } from '../../contexts/NotificationPreferencesContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { 
  Profile, 
  SecurityUser, 
  Notification, 
  FingerScan, 
  Lock, 
  Brush, 
  MessageQuestion, 
  ShieldTick, 
  Logout,
  ArrowRight2,
  User,
  Call,
  Sms,
  Award,
  InfoCircle
} from 'iconsax-react-nativejs';

const { height } = Dimensions.get('window');

interface SettingItem {
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info';
  danger?: boolean;
  onPress: () => void;
}

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Biometric auth hook
  const {
    isEnabled: biometricEnabled,
    isAvailable: biometricAvailable,
    biometricNames,
    isLoading: biometricLoading,
    enableBiometric,
    disableBiometric,
  } = useBiometricAuth();

  const handleBiometricToggle = async () => {
    if (!biometricAvailable) {
      const biometricName = biometricNames.length > 0 ? biometricNames.join(' or ') : 'Biometric authentication';
      Alert.alert(
        'Not Available',
        `${biometricName} is not available on this device or not set up. Please ensure you have enrolled biometric authentication in your device settings.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (biometricLoading) return;

    try {
      if (biometricEnabled) {
        const result = await disableBiometric();
        if (!result.success) {
          Alert.alert('Error', result.error || 'Failed to disable biometric authentication');
        }
      } else {
        const result = await enableBiometric();
        if (!result.success) {
          Alert.alert('Error', result.error || 'Failed to enable biometric authentication');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // Clear user session and reset navigation stack to onboarding
            (navigation as any).reset({
              index: 0,
              routes: [{ name: 'Auth', params: { screen: 'Onboarding' } }],
            });
          }
        }
      ]
    );
  };

  const accountItems: SettingItem[] = [
    { 
      label: 'My Profile', 
      icon: <Profile size={22} color={colors.primary} variant="Bold" />,
      onPress: () => setShowProfileModal(true)
    },
    { 
      label: 'Account Verification', 
      icon: <SecurityUser size={22} color={colors.primary} variant="Bold" />,
      badge: 'Tier 1',
      badgeType: 'warning',
      onPress: () => navigation.navigate('AccountVerification')
    },
  ];

  const securityItems: SettingItem[] = [
    { 
      label: 'Security', 
      icon: <Lock size={22} color={colors.primary} variant="Bold" />,
      onPress: () => setShowSecurityModal(true)
    },
    { 
      label: 'Biometric Authentication', 
      subtitle: !biometricAvailable 
        ? 'Not available on this device'
        : biometricNames.length > 0 
          ? `Using ${biometricNames.join(', ')}`
          : 'Available',
      icon: <FingerScan size={22} color={colors.primary} variant="Bold" />,
      onPress: handleBiometricToggle
    },
  ];

  const preferencesItems: SettingItem[] = [
    { 
      label: 'Notifications', 
      icon: <Notification size={22} color={colors.primary} variant="Bold" />,
      onPress: () => setShowNotificationModal(true)
    },
  ];

  const supportItems: SettingItem[] = [
    { 
      label: 'Help & Support', 
      icon: <MessageQuestion size={22} color={colors.primary} variant="Bold" />,
      onPress: () => Alert.alert('Support', 'Contact support at support@payapp.com')
    },
    { 
      label: 'Privacy Policy', 
      icon: <ShieldTick size={22} color={colors.primary} variant="Bold" />,
      onPress: () => Alert.alert('Privacy Policy', 'View our privacy policy at payapp.com/privacy')
    },
    { 
      label: 'About', 
      icon: <InfoCircle size={22} color={colors.primary} variant="Bold" />,
      onPress: () => Alert.alert('About PayApp', 'Version 2.11\n\nPayApp - The future of payments\n\n© 2025 PayApp Inc.')
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.label}
      onPress={item.onPress}
      style={settingsStyles.settingItem}
      activeOpacity={0.7}
    >
      <View style={settingsStyles.settingIcon}>
        {item.icon}
      </View>
      <View style={settingsStyles.settingContent}>
        <Text style={[
          settingsStyles.settingLabel, 
          item.danger && { color: colors.error }
        ]}>
          {item.label}
        </Text>
        {item.subtitle && (
          <Text style={settingsStyles.settingSubtitle}>
            {item.subtitle}
          </Text>
        )}
      </View>
      {item.badge && (
        <View style={[
          settingsStyles.badge,
          item.badgeType === 'success' && settingsStyles.badgeSuccess,
          item.badgeType === 'warning' && settingsStyles.badgeWarning,
          item.badgeType === 'info' && settingsStyles.badgeInfo,
        ]}>
          <Text style={[
            settingsStyles.badgeText,
            item.badgeType === 'success' && settingsStyles.badgeTextSuccess,
            item.badgeType === 'warning' && settingsStyles.badgeTextWarning,
          ]}>
            {item.badge}
          </Text>
        </View>
      )}
      {item.label === 'Biometric Authentication' ? (
        <Switch
          value={biometricEnabled}
          onValueChange={handleBiometricToggle}
          disabled={biometricLoading || !biometricAvailable}
          trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
          thumbColor={biometricEnabled ? colors.primary : '#f4f3f4'}
        />
      ) : (
        <ArrowRight2 size={20} color={colors.gray} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={settingsStyles.container}>
      <ScrollView 
        style={settingsStyles.scrollView}
        contentContainerStyle={settingsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={settingsStyles.header}>
          <Text style={settingsStyles.headerTitle}>Settings</Text>
          <View style={settingsStyles.tierBadge}>
            <Award size={16} color="#F59E0B" variant="Bold" />
            <Text style={settingsStyles.tierText}>Tier 3</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={settingsStyles.profileCard}>
          <View style={settingsStyles.avatar}>
            <User size={32} color={colors.white} variant="Bold" />
          </View>
          <View style={settingsStyles.profileInfo}>
            <Text style={settingsStyles.profileName}>Obed Ihekaike</Text>
            <Text style={settingsStyles.profileUsertag}>@obedihekaike</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Account</Text>
          <View style={settingsStyles.settingsGroup}>
            {accountItems.map(renderSettingItem)}
          </View>
        </View>

        {/* Security Section */}
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Security</Text>
          <View style={settingsStyles.settingsGroup}>
            {securityItems.map(renderSettingItem)}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Preferences</Text>
          <View style={settingsStyles.settingsGroup}>
            {preferencesItems.map(renderSettingItem)}
          </View>
        </View>

        {/* Support Section */}
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Support</Text>
          <View style={settingsStyles.settingsGroup}>
            {supportItems.map(renderSettingItem)}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout} 
          style={settingsStyles.logoutButton}
          activeOpacity={0.7}
        >
          <Logout size={22} color={colors.error} variant="Bold" />
          <Text style={settingsStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={settingsStyles.version}>Version 2.11</Text>
      </ScrollView>

      {/* Profile Modal */}
      <ProfileModal 
        visible={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Security Modal */}
      <SecurityModal 
        visible={showSecurityModal} 
        onClose={() => setShowSecurityModal(false)} 
        navigation={navigation}
      />

      {/* Notification Modal */}
      <NotificationModal 
        visible={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)}
        enabled={notificationsEnabled}
        onToggle={setNotificationsEnabled}
      />
    </View>
  );
};

// Profile Modal Component
const ProfileModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY: dragDistance, velocityY } = event.nativeEvent;
      
      if (dragDistance > 100 || velocityY > 500) {
        translateY.setValue(0);
        handleClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    }
  };

  React.useEffect(() => {
    if (visible) {
      setModalVisible(true);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      translateY.setValue(0);
      
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 50);
    } else if (modalVisible) {
      handleClose();
    }
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[modalStyles.overlay, { opacity: fadeAnim }]}>
          <BlurView style={StyleSheet.absoluteFillObject} intensity={20} tint="dark" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={10}
        failOffsetY={-10}
      >
        <Animated.View style={[
          modalStyles.card, 
          { 
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ]
          }
        ]}>
          <View style={modalStyles.dragIndicator} />
          <Text style={modalStyles.heading}>My Profile</Text>
          
          <View style={modalStyles.infoRow}>
            <User size={20} color={colors.gray} variant="Outline" />
            <View style={modalStyles.infoContent}>
              <Text style={modalStyles.infoLabel}>Full Name</Text>
              <Text style={modalStyles.infoValue}>Obed Ihekaike</Text>
            </View>
          </View>

          <View style={modalStyles.infoRow}>
            <Sms size={20} color={colors.gray} variant="Outline" />
            <View style={modalStyles.infoContent}>
              <Text style={modalStyles.infoLabel}>Email</Text>
              <Text style={modalStyles.infoValue}>obed@example.com</Text>
            </View>
          </View>

          <View style={modalStyles.infoRow}>
            <Call size={20} color={colors.gray} variant="Outline" />
            <View style={modalStyles.infoContent}>
              <Text style={modalStyles.infoLabel}>Phone Number</Text>
              <Text style={modalStyles.infoValue}>+234 123 456 7890</Text>
            </View>
          </View>

          <View style={modalStyles.infoRow}>
            <Profile size={20} color={colors.gray} variant="Outline" />
            <View style={modalStyles.infoContent}>
              <Text style={modalStyles.infoLabel}>Usertag</Text>
              <Text style={modalStyles.infoValue}>@obedihekaike</Text>
            </View>
          </View>

          <TouchableOpacity style={modalStyles.editButton}>
            <Text style={modalStyles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

// Security Modal Component
const SecurityModal: React.FC<{ visible: boolean; onClose: () => void; navigation: any }> = ({ visible, onClose, navigation }) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY: dragDistance, velocityY } = event.nativeEvent;
      
      if (dragDistance > 100 || velocityY > 500) {
        translateY.setValue(0);
        handleClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    }
  };

  React.useEffect(() => {
    if (visible) {
      setModalVisible(true);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      translateY.setValue(0);
      
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 50);
    } else if (modalVisible) {
      handleClose();
    }
  }, [visible]);

  if (!modalVisible) return null;

  const securityOptions = [
    { label: 'Change Login PIN', icon: <Lock size={22} color={colors.primary} variant="Bold" /> },
    { label: 'Change Transaction PIN', icon: <Lock size={22} color={colors.primary} variant="Bold" /> },
    { label: 'Change Duress PIN', icon: <ShieldTick size={22} color={colors.primary} variant="Bold" /> },
  ];

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[modalStyles.overlay, { opacity: fadeAnim }]}>
          <BlurView style={StyleSheet.absoluteFillObject} intensity={20} tint="dark" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={10}
        failOffsetY={-10}
      >
        <Animated.View style={[
          modalStyles.card, 
          { 
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ]
          }
        ]}>
          <View style={modalStyles.dragIndicator} />
          <Text style={modalStyles.heading}>Security Settings</Text>
          
          {securityOptions.map((option) => (
            <TouchableOpacity 
              key={option.label} 
              style={modalStyles.option}
              onPress={() => {
                handleClose();
                let pinType: 'login' | 'transaction' | 'duress';
                
                if (option.label === 'Change Login PIN') {
                  pinType = 'login';
                } else if (option.label === 'Change Transaction PIN') {
                  pinType = 'transaction';
                } else if (option.label === 'Change Duress PIN') {
                  pinType = 'duress';
                } else {
                  return;
                }
                
                navigation.navigate('SecurityPinEmailVerification', { pinType });
              }}
            >
              <View style={modalStyles.optionIcon}>{option.icon}</View>
              <Text style={modalStyles.optionText}>{option.label}</Text>
              <ArrowRight2 size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}

          <View style={modalStyles.infoBox}>
            <ShieldTick size={24} color={colors.primary} variant="Bold" />
            <Text style={modalStyles.infoBoxText}>
              Your PINs are encrypted and secure. Never share them with anyone.
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

// Notification Modal Component
const NotificationModal: React.FC<{ 
  visible: boolean; 
  onClose: () => void;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}> = ({ visible, onClose, enabled, onToggle }) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const { preferences, updatePreference, isLoading } = useNotificationPreferences();
  const { showNotification } = useNotifications();
  
  // Enhanced update function with feedback
  const handlePreferenceUpdate = async (key: keyof typeof preferences, value: boolean) => {
    await updatePreference(key, value);
    
    // Show feedback for important changes
    if (key === 'pushEnabled') {
      showNotification({
        type: value ? 'success' : 'warning',
        title: 'Push Notifications',
        message: value ? 'Push notifications enabled' : 'Push notifications disabled',
        duration: 3000,
      });
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY: dragDistance, velocityY } = event.nativeEvent;
      
      if (dragDistance > 100 || velocityY > 500) {
        translateY.setValue(0);
        handleClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    }
  };

  React.useEffect(() => {
    if (visible) {
      setModalVisible(true);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      translateY.setValue(0);
      
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 50);
    } else if (modalVisible) {
      handleClose();
    }
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[modalStyles.overlay, { opacity: fadeAnim }]}>
          <BlurView style={StyleSheet.absoluteFillObject} intensity={20} tint="dark" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={10}
        failOffsetY={-10}
      >
        <Animated.View style={[
          modalStyles.card, 
          { 
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ]
          }
        ]}>
          <View style={modalStyles.dragIndicator} />
          <Text style={modalStyles.heading}>Notification Settings</Text>
          
          {isLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.gray }}>Loading preferences...</Text>
            </View>
          ) : (
            <>
              <Text style={modalStyles.sectionLabel}>Channels</Text>
          
          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>Push Notifications</Text>
            <Switch
              value={preferences.pushEnabled}
              onValueChange={(value) => handlePreferenceUpdate('pushEnabled', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.pushEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>Email Notifications</Text>
            <Switch
              value={preferences.emailEnabled}
              onValueChange={(value) => updatePreference('emailEnabled', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.emailEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>SMS Notifications</Text>
            <Switch
              value={preferences.smsEnabled}
              onValueChange={(value) => updatePreference('smsEnabled', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.smsEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <Text style={[modalStyles.sectionLabel, { marginTop: 24 }]}>Alerts</Text>
          
          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>Transaction Alerts</Text>
            <Switch
              value={preferences.transactionAlerts}
              onValueChange={(value) => updatePreference('transactionAlerts', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.transactionAlerts ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>Security Alerts</Text>
            <Switch
              value={preferences.securityAlerts}
              onValueChange={(value) => updatePreference('securityAlerts', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.securityAlerts ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>System Alerts</Text>
            <Switch
              value={preferences.systemAlerts}
              onValueChange={(value) => updatePreference('systemAlerts', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.systemAlerts ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={modalStyles.toggleRow}>
            <Text style={modalStyles.toggleLabel}>Promotional Updates</Text>
            <Switch
              value={preferences.promotionalUpdates}
              onValueChange={(value) => updatePreference('promotionalUpdates', value)}
              trackColor={{ false: colors.gray + '40', true: colors.primary + '40' }}
              thumbColor={preferences.promotionalUpdates ? colors.primary : '#f4f3f4'}
            />
          </View>
            </>
          )}
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    fontFamily: fontConfig.heading,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tierText: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: fontConfig.heading,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: fontConfig.heading,
  },
  profileUsertag: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
    fontFamily: fontConfig.heading,
  },
  settingsGroup: {
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '15',
  },
  settingIcon: {
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeSuccess: {
    backgroundColor: '#ECFDF5',
  },
  badgeWarning: {
    backgroundColor: '#FFF7E0',
  },
  badgeInfo: {
    backgroundColor: '#EFF6FF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextSuccess: {
    color: colors.success,
  },
  badgeTextWarning: {
    color: '#F59E0B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 24,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: colors.error,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    fontFamily: fontConfig.heading,
  },
  version: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    maxHeight: height * 0.85,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'left',
    fontFamily: fontConfig.heading,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '15',
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fontConfig.heading,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '15',
    gap: 14,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fontConfig.heading,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    gap: 12,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
    fontFamily: fontConfig.heading,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '15',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
});

export default SettingsScreen;
