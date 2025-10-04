import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Animated,
  Dimensions,
  Modal,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { 
  ArrowLeft, 
  TickCircle, 
  Lock,
  SecurityUser,
  DocumentText,
  Camera,
  ArrowRight2,
  InfoCircle
} from 'iconsax-react-nativejs';
import Button from '../../components/Button';

const { height } = Dimensions.get('window');

type Tier = 'A' | 'B' | 'C';

interface TierInfo {
  tier: Tier;
  name: string;
  dailyLimit: string;
  requirements: string[];
  description: string;
  color: string;
  icon: any;
}

const TIER_INFO: TierInfo[] = [
  {
    tier: 'A',
    name: 'Basic',
    dailyLimit: '₦50,000',
    requirements: ['Bank Verification Number (BVN)'],
    description: 'Perfect for getting started with basic transactions',
    color: colors.primary,
    icon: Lock,
  },
  {
    tier: 'B',
    name: 'Standard',
    dailyLimit: '₦200,000',
    requirements: ['National Identity Number (NIN)', 'Selfie Verification'],
    description: 'Enhanced limits for regular users',
    color: '#FF9500',
    icon: SecurityUser,
  },
  {
    tier: 'C',
    name: 'Premium',
    dailyLimit: '₦5,000,000',
    requirements: ['Utility Bill (Water, Power, or Internet)'],
    description: 'Maximum limits for power users',
    color: '#34C759',
    icon: DocumentText,
  },
];

interface AccountVerificationScreenProps {
  navigation: any;
}

const AccountVerificationScreen: React.FC<AccountVerificationScreenProps> = ({ navigation }) => {
  const [currentTier, setCurrentTier] = useState<Tier>('A');
  const [bvnVerified, setBvnVerified] = useState(true);
  const [ninVerified, setNinVerified] = useState(false);
  const [utilityBillVerified, setUtilityBillVerified] = useState(false);
  
  // Modal states
  const [showBvnModal, setShowBvnModal] = useState(false);
  const [showNinModal, setShowNinModal] = useState(false);
  const [showUtilityModal, setShowUtilityModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'bvn' | 'nin' | 'utility' | null>(null);
  
  // Form states
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [billUri, setBillUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeModal) {
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
    }
  }, [activeModal]);

  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setActiveModal(null);
      setShowBvnModal(false);
      setShowNinModal(false);
      setShowUtilityModal(false);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
    });
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationY > 100) {
        handleCloseModal();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handlePickSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take a selfie');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const handlePickDocument = async () => {
    // For now, use ImagePicker for documents. Install expo-document-picker for production
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setBillUri(result.assets[0].uri);
    }
  };

  const handleSubmitBVN = async () => {
    if (bvn.length !== 11) {
      Alert.alert('Invalid BVN', 'Please enter a valid 11-digit BVN');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBvnVerified(true);
      setCurrentTier('A');
      setLoading(false);
      handleCloseModal();
      Alert.alert('Success', 'BVN verified successfully! You are now Tier 1 (Basic)');
    }, 2000);
  };

  const handleSubmitNIN = async () => {
    if (nin.length !== 11) {
      Alert.alert('Invalid NIN', 'Please enter a valid 11-digit NIN');
      return;
    }

    if (!selfieUri) {
      Alert.alert('Selfie Required', 'Please take a selfie to continue');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNinVerified(true);
      setCurrentTier('B');
      setLoading(false);
      handleCloseModal();
      Alert.alert('Success', 'NIN and selfie verified successfully! You are now Tier 2 (Standard)');
    }, 2000);
  };

  const handleSubmitUtilityBill = async () => {
    if (!billUri) {
      Alert.alert('Document Required', 'Please upload a utility bill to continue');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUtilityBillVerified(true);
      setCurrentTier('C');
      setLoading(false);
      handleCloseModal();
      Alert.alert('Success', 'Utility bill verified successfully! You are now Tier 3 (Premium)');
    }, 2000);
  };

  const openTierModal = (tier: Tier) => {
    if (tier === 'A') {
      setShowBvnModal(true);
      setActiveModal('bvn');
    } else if (tier === 'B') {
      if (!bvnVerified) {
        Alert.alert('Complete Tier 1 First', 'Please verify your BVN before upgrading to Tier 2');
        return;
      }
      setShowNinModal(true);
      setActiveModal('nin');
    } else if (tier === 'C') {
      if (!ninVerified) {
        Alert.alert('Complete Tier 2 First', 'Please verify your NIN before upgrading to Tier 3');
        return;
      }
      setShowUtilityModal(true);
      setActiveModal('utility');
    }
  };

  const isTierCompleted = (tier: Tier) => {
    if (tier === 'A') return bvnVerified;
    if (tier === 'B') return ninVerified;
    if (tier === 'C') return utilityBillVerified;
    return false;
  };

  const isTierLocked = (tier: Tier) => {
    if (tier === 'A') return false;
    if (tier === 'B') return !bvnVerified;
    if (tier === 'C') return !ninVerified;
    return false;
  };

  const getTierIndex = (tier: Tier) => {
    if (tier === 'A') return 0;
    if (tier === 'B') return 1;
    if (tier === 'C') return 2;
    return 0;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray + '20',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontConfig.heading }}>
            Account Verification
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Current Status */}
        <View style={{ 
          margin: 20, 
          padding: 20, 
          backgroundColor: colors.white, 
          borderRadius: 16,
          borderWidth: 2,
          borderColor: TIER_INFO[getTierIndex(currentTier)].color + '30',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: TIER_INFO[getTierIndex(currentTier)].color + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              {React.createElement(TIER_INFO[getTierIndex(currentTier)].icon, {
                size: 24,
                color: TIER_INFO[getTierIndex(currentTier)].color,
                variant: 'Bold'
              })}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 2 }}>
                Current Tier
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontConfig.heading }}>
                Tier {getTierIndex(currentTier) + 1} - {TIER_INFO[getTierIndex(currentTier)].name}
              </Text>
            </View>
          </View>
          
          <View style={{
            backgroundColor: colors.background,
            padding: 12,
            borderRadius: 10,
            marginTop: 8,
          }}>
            <Text style={{ fontSize: 13, color: colors.gray, marginBottom: 4 }}>
              Daily Transaction Limit
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, fontFamily: fontConfig.heading }}>
              {TIER_INFO[getTierIndex(currentTier)].dailyLimit}
            </Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={{
          marginHorizontal: 20,
          marginBottom: 20,
          padding: 16,
          backgroundColor: colors.primary + '10',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
          <InfoCircle size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
          <Text style={{ flex: 1, fontSize: 13, color: colors.text, lineHeight: 20 }}>
            Upgrade your account tier to unlock higher transaction limits and access premium features
          </Text>
        </View>

        {/* Tier Cards */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            color: colors.text, 
            marginBottom: 16,
            fontFamily: fontConfig.heading 
          }}>
            Verification Tiers
          </Text>

          {TIER_INFO.map((tierInfo, index) => {
            const isCompleted = isTierCompleted(tierInfo.tier);
            const isLocked = isTierLocked(tierInfo.tier);
            const isCurrent = currentTier === tierInfo.tier;

            return (
              <TouchableOpacity
                key={tierInfo.tier}
                onPress={() => !isCompleted && !isLocked && openTierModal(tierInfo.tier)}
                disabled={isCompleted || isLocked}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: isCompleted 
                    ? tierInfo.color + '30'
                    : isLocked 
                    ? colors.gray + '20' 
                    : colors.gray + '30',
                  opacity: isLocked ? 0.5 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: tierInfo.color + '15',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    {React.createElement(tierInfo.icon, {
                      size: 24,
                      color: tierInfo.color,
                      variant: 'Bold'
                    })}
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ 
                        fontSize: 18, 
                        fontWeight: '700', 
                        color: colors.text,
                        fontFamily: fontConfig.heading,
                        marginRight: 8,
                      }}>
                        Tier {index + 1}
                      </Text>
                      {isCompleted && (
                        <View style={{
                          backgroundColor: tierInfo.color + '15',
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: tierInfo.color }}>
                            Verified
                          </Text>
                        </View>
                      )}
                      {isLocked && (
                        <View style={{
                          backgroundColor: colors.gray + '15',
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gray }}>
                            Locked
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 }}>
                      {tierInfo.name}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.gray, marginBottom: 8 }}>
                      {tierInfo.description}
                    </Text>
                    
                    <View style={{
                      backgroundColor: colors.background,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      alignSelf: 'flex-start',
                    }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                        Limit: {tierInfo.dailyLimit}/day
                      </Text>
                    </View>
                  </View>

                  {!isCompleted && !isLocked && (
                    <ArrowRight2 size={20} color={colors.gray} style={{ marginLeft: 8, marginTop: 8 }} />
                  )}
                  {isCompleted && (
                    <TickCircle size={24} color={tierInfo.color} variant="Bold" style={{ marginLeft: 8, marginTop: 8 }} />
                  )}
                </View>

                <View style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.gray + '20',
                  paddingTop: 12,
                  marginTop: 4,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 6 }}>
                    Requirements:
                  </Text>
                  {tierInfo.requirements.map((req, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.gray,
                        marginRight: 8,
                      }} />
                      <Text style={{ fontSize: 12, color: colors.text }}>
                        {req}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* BVN Modal */}
      {activeModal === 'bvn' && showBvnModal && (
        <Modal transparent visible={showBvnModal} animationType="none">
          <BlurView intensity={20} tint="dark" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <Animated.View style={{ 
              flex: 1, 
              justifyContent: 'flex-end',
              opacity: fadeAnim 
            }}>
              <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetY={10}
                failOffsetY={-10}
              >
                <Animated.View style={{
                  backgroundColor: colors.white,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 24,
                  maxHeight: height * 0.85,
                  transform: [
                    { translateY: slideAnim },
                    { translateY: translateY }
                  ]
                }}>
                  <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: colors.gray,
                    borderRadius: 2,
                    alignSelf: 'center',
                    marginBottom: 20,
                    opacity: 0.4,
                  }} />
                  
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: '700', 
                    color: colors.text, 
                    marginBottom: 8,
                    fontFamily: fontConfig.heading 
                  }}>
                    Verify Your BVN
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>
                    Enter your 11-digit Bank Verification Number to complete Tier 1 verification
                  </Text>

                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                    BVN
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: bvn ? colors.primary : colors.gray + '30',
                      marginBottom: 24,
                    }}
                    placeholder="Enter 11-digit BVN"
                    placeholderTextColor={colors.gray + '60'}
                    value={bvn}
                    onChangeText={setBvn}
                    keyboardType="number-pad"
                    maxLength={11}
                  />

                  <View style={{
                    backgroundColor: colors.primary + '10',
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 24,
                  }}>
                    <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
                      🔒 Your BVN is secure and used only for identity verification in compliance with CBN regulations
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      onPress={handleCloseModal}
                      style={{
                        flex: 1,
                        backgroundColor: colors.gray + '15',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <Button
                        title={loading ? 'Verifying...' : 'Verify BVN'}
                        onPress={handleSubmitBVN}
                        disabled={bvn.length !== 11 || loading}
                      />
                    </View>
                  </View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </BlurView>
        </Modal>
      )}

      {/* NIN & Selfie Modal */}
      {activeModal === 'nin' && showNinModal && (
        <Modal transparent visible={showNinModal} animationType="none">
          <BlurView intensity={20} tint="dark" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <Animated.View style={{ 
              flex: 1, 
              justifyContent: 'flex-end',
              opacity: fadeAnim 
            }}>
              <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetY={10}
                failOffsetY={-10}
              >
                <Animated.View style={{
                  backgroundColor: colors.white,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 24,
                  maxHeight: height * 0.85,
                  transform: [
                    { translateY: slideAnim },
                    { translateY: translateY }
                  ]
                }}>
                  <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: colors.gray,
                    borderRadius: 2,
                    alignSelf: 'center',
                    marginBottom: 20,
                    opacity: 0.4,
                  }} />
                  
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{ 
                      fontSize: 24, 
                      fontWeight: '700', 
                      color: colors.text, 
                      marginBottom: 8,
                      fontFamily: fontConfig.heading 
                    }}>
                      NIN & Selfie Verification
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>
                      Provide your NIN and take a selfie to upgrade to Tier 2
                    </Text>

                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                      National Identity Number (NIN)
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: colors.text,
                        borderWidth: 1,
                        borderColor: nin ? colors.primary : colors.gray + '30',
                        marginBottom: 20,
                      }}
                      placeholder="Enter 11-digit NIN"
                      placeholderTextColor={colors.gray + '60'}
                      value={nin}
                      onChangeText={setNin}
                      keyboardType="number-pad"
                      maxLength={11}
                    />

                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                      Selfie Verification
                    </Text>
                    
                    {selfieUri ? (
                      <View style={{ marginBottom: 20 }}>
                        <Image
                          source={{ uri: selfieUri }}
                          style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 12,
                            marginBottom: 12,
                          }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={handlePickSelfie}
                          style={{
                            backgroundColor: colors.gray + '15',
                            padding: 12,
                            borderRadius: 10,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                            Retake Selfie
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={handlePickSelfie}
                        style={{
                          backgroundColor: colors.background,
                          padding: 20,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: colors.gray + '30',
                          borderStyle: 'dashed',
                          alignItems: 'center',
                          marginBottom: 20,
                        }}
                      >
                        <Camera size={32} color={colors.primary} variant="Bold" />
                        <Text style={{ 
                          fontSize: 16, 
                          fontWeight: '600', 
                          color: colors.text, 
                          marginTop: 12,
                          marginBottom: 4,
                        }}>
                          Take a Selfie
                        </Text>
                        <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center' }}>
                          Take a clear photo of your face
                        </Text>
                      </TouchableOpacity>
                    )}

                    <View style={{
                      backgroundColor: colors.primary + '10',
                      padding: 12,
                      borderRadius: 10,
                      marginBottom: 24,
                    }}>
                      <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
                        📸 Ensure your face is clearly visible and well-lit for verification
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                        onPress={handleCloseModal}
                        style={{
                          flex: 1,
                          backgroundColor: colors.gray + '15',
                          padding: 16,
                          borderRadius: 12,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}>
                        <Button
                          title={loading ? 'Verifying...' : 'Submit'}
                          onPress={handleSubmitNIN}
                          disabled={nin.length !== 11 || !selfieUri || loading}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </BlurView>
        </Modal>
      )}

      {/* Utility Bill Modal */}
      {activeModal === 'utility' && showUtilityModal && (
        <Modal transparent visible={showUtilityModal} animationType="none">
          <BlurView intensity={20} tint="dark" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <Animated.View style={{ 
              flex: 1, 
              justifyContent: 'flex-end',
              opacity: fadeAnim 
            }}>
              <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetY={10}
                failOffsetY={-10}
              >
                <Animated.View style={{
                  backgroundColor: colors.white,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 24,
                  maxHeight: height * 0.85,
                  transform: [
                    { translateY: slideAnim },
                    { translateY: translateY }
                  ]
                }}>
                  <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: colors.gray,
                    borderRadius: 2,
                    alignSelf: 'center',
                    marginBottom: 20,
                    opacity: 0.4,
                  }} />
                  
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: '700', 
                    color: colors.text, 
                    marginBottom: 8,
                    fontFamily: fontConfig.heading 
                  }}>
                    Utility Bill Upload
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>
                    Upload a recent utility bill (water, electricity, or internet) to upgrade to Tier 3
                  </Text>

                  {billUri ? (
                    <View style={{ marginBottom: 20 }}>
                      <View style={{
                        backgroundColor: colors.background,
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <DocumentText size={24} color={colors.primary} variant="Bold" />
                        <Text style={{ 
                          flex: 1, 
                          fontSize: 14, 
                          color: colors.text, 
                          marginLeft: 12,
                          fontWeight: '600',
                        }}>
                          Document uploaded
                        </Text>
                        <TickCircle size={20} color={colors.primary} variant="Bold" />
                      </View>
                      <TouchableOpacity
                        onPress={handlePickDocument}
                        style={{
                          backgroundColor: colors.gray + '15',
                          padding: 12,
                          borderRadius: 10,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                          Upload Different Document
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handlePickDocument}
                      style={{
                        backgroundColor: colors.background,
                        padding: 20,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: colors.gray + '30',
                        borderStyle: 'dashed',
                        alignItems: 'center',
                        marginBottom: 20,
                      }}
                    >
                      <DocumentText size={32} color={colors.primary} variant="Bold" />
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: colors.text, 
                        marginTop: 12,
                        marginBottom: 4,
                      }}>
                        Upload Utility Bill
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center' }}>
                        PDF or image of your recent bill
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View style={{
                    backgroundColor: colors.primary + '10',
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 24,
                  }}>
                    <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18, marginBottom: 6 }}>
                      📄 Accepted documents:
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
                      • Electricity bill{'\n'}
                      • Water bill{'\n'}
                      • Internet/Cable TV bill{'\n'}
                      • Must be dated within the last 3 months
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      onPress={handleCloseModal}
                      style={{
                        flex: 1,
                        backgroundColor: colors.gray + '15',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <Button
                        title={loading ? 'Uploading...' : 'Submit'}
                        onPress={handleSubmitUtilityBill}
                        disabled={!billUri || loading}
                      />
                    </View>
                  </View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </BlurView>
        </Modal>
      )}
    </View>
  );
};

export default AccountVerificationScreen;
