import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, Animated, Dimensions, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, TextInput } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import colors from '../../theme/colors';
import { BlurView } from 'expo-blur';
import Button from '../../components/Button';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { height } = Dimensions.get('window');

const DATA_BUNDLES = [
  { id: 1, amount: '500MB', price: '₦200', duration: '1 day' },
  { id: 2, amount: '1GB', price: '₦350', duration: '7 days' },
  { id: 3, amount: '2GB', price: '₦600', duration: '14 days' },
  { id: 4, amount: '5GB', price: '₦1,200', duration: '30 days' },
  { id: 5, amount: '10GB', price: '₦2,000', duration: '30 days' },
];

const NETWORKS = [
  { name: 'MTN', color: '#FFD700' },
  { name: 'Airtel', color: '#E60026' },
  { name: 'Glo', color: '#009A44' },
  { name: '9mobile', color: '#6CC417' },
];

interface DataModalProps {
  visible: boolean;
  onClose: () => void;
}

type RootStackParamList = {
  Loading: { type: string; network: string; contact: string; bundle: string; price: string };
  TransactionResultScreen: {
    status: string;
    message: string;
    transaction: {
      type: string;
      network: string;
      contact: string;
      bundle: string;
      price: string;
    };  
  };
};

const DataModal: React.FC<DataModalProps> = ({ visible, onClose }) => {
  const [contact, setContact] = useState('');
  const [step, setStep] = useState(1);
  const [selectedBundle, setSelectedBundle] = useState<typeof DATA_BUNDLES[0] | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleClose = () => {
    Keyboard.dismiss();
    setContact('');
    setSelectedBundle(null);
    setStep(1);
    setShowSummary(false);
    setShowPayment(false);
    setPin('');
    setLoading(false);
    setSuccess(false);
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

  useEffect(() => {
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
  }, [visible, modalVisible, slideAnim, fadeAnim, translateY]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handlePickContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to contacts to use this feature.', [{ text: 'OK' }]);
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        sort: Contacts.SortTypes.FirstName,
      });
      const contactsWithPhone = data.filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0);
      if (contactsWithPhone.length > 0) {
        setContactsList(contactsWithPhone);
        setShowContactPicker(true);
      } else {
        Alert.alert('No Phone Numbers', 'No contacts with phone numbers found.');
      }
    } catch (error) {
      console.error('Error accessing contacts:', error);
      Alert.alert('Error', 'Unable to access contacts. Please try again.');
    }
  };

  useEffect(() => {
    if (!modalVisible) {
      setContact('');
      setSelectedBundle(null);
      setStep(1);
      setShowSummary(false);
      setShowPayment(false);
      setPin('');
      setLoading(false);
      setSuccess(false);
      setSelectedNetwork('');
      setShowContactPicker(false);
      setContactsList([]);
    }
  }, [modalVisible]);

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <BlurView style={StyleSheet.absoluteFillObject} intensity={30} tint="dark" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={10}
        failOffsetY={-10}
      >
        <Animated.View style={[
          styles.card,
          {
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ],
            bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 30,
          }
        ]}>
          <View style={styles.dragIndicator} />
          <Text style={styles.title}>Buy Data</Text>
          {/* Step 1: Contact Input */}
          {step === 1 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={contact}
                onChangeText={setContact}
                placeholderTextColor={colors.gray}
              />
              <TouchableOpacity
                style={styles.pickContact}
                onPress={handlePickContact}
              >
                <Text style={{ color: colors.primary, fontWeight: '600', textAlign: 'left' }}>Pick from contacts</Text>
              </TouchableOpacity>
              <View style={styles.networkRow}>
                {NETWORKS.map(net => (
                  <TouchableOpacity
                    key={net.name}
                    style={[
                      styles.networkBox,
                      selectedNetwork === net.name && {
                        borderColor: colors.primary,
                        borderWidth: 2,
                        backgroundColor: colors.primary + '15',
                      },
                    ]}
                    onPress={() => setSelectedNetwork(net.name)}
                  >
                    <Text style={{ color: net.color, fontWeight: '700' }}>{net.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.continueBtn, !(contact && selectedNetwork) && { opacity: 0.5 }]}
                disabled={!(contact && selectedNetwork)}
                onPress={() => setStep(2)}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Continue</Text>
              </TouchableOpacity>
              {/* Contact Picker Modal */}
              {showContactPicker && (
                <Modal visible={showContactPicker} animationType="slide" transparent>
                  <TouchableWithoutFeedback onPress={() => setShowContactPicker(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                  </TouchableWithoutFeedback>
                  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: height * 0.6, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18 }}>
                    <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 12, textAlign: 'left' }}>Select Contact</Text>
                    <Animated.ScrollView>
                      {contactsList.map((contact, idx) => (
                        <TouchableOpacity
                          key={contact.id || idx}
                          style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                          onPress={() => {
                            const phoneNumber = contact.phoneNumbers?.[0]?.number;
                            if (phoneNumber) {
                              const cleanedNumber = phoneNumber.replace(/\s|\-|\(|\)/g, '');
                              setContact(cleanedNumber);
                              setShowContactPicker(false);
                              Alert.alert('Contact Selected', `Selected: ${contact.name}\nPhone: ${cleanedNumber}`, [{ text: 'OK' }]);
                            }
                          }}
                        >
                          <Text style={{ fontSize: 16, color: colors.text }}>{contact.name}</Text>
                          <Text style={{ fontSize: 14, color: colors.gray }}>{contact.phoneNumbers?.[0]?.number}</Text>
                        </TouchableOpacity>
                      ))}
                    </Animated.ScrollView>
                  </View>
                </Modal>
              )}
            </>
          )}
          {/* Step 2: Data Bundle Selection */}
          {step === 2 && (
            <>
              <Text style={styles.label}>Select Data Bundle</Text>
              <ScrollView style={{ maxHeight: height * 0.4 }}>
                {DATA_BUNDLES.map(bundle => (
                  <TouchableOpacity
                    key={bundle.id}
                    style={[styles.bundleCard, selectedBundle?.id === bundle.id && styles.selectedCard]}
                    onPress={() => setSelectedBundle(bundle)}
                  >
                    <View style={styles.bundleRow}>
                      <Text style={styles.bundleAmount}>{bundle.amount}</Text>
                      <Text style={styles.bundleDuration}>{bundle.duration}</Text>
                      <Text style={styles.bundlePrice}>{bundle.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Button
                  title="Back"
                  type="secondary"
                  onPress={() => setStep(1)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Continue"
                  onPress={() => setStep(3)}
                  style={{ flex: 1, marginLeft: 8, opacity: !selectedBundle ? 0.5 : 1 }}
                  disabled={!selectedBundle}
                />
              </View>
            </>
          )}
          {/* Step 3: Transaction Summary */}
          {step === 3 && (
            <View>
              <Text style={styles.title}>Transaction Summary</Text>
              <Text style={styles.label}>Network:</Text>
              <Text style={styles.value}>{selectedNetwork}</Text>
              <Text style={styles.label}>Number:</Text>
              <Text style={styles.value}>{contact}</Text>
              <Text style={styles.label}>Bundle:</Text>
              <Text style={styles.value}>{selectedBundle?.amount} ({selectedBundle?.duration})</Text>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>{selectedBundle?.price}</Text>
              <View style={{ flexDirection: 'row', marginTop: 24 }}>
                <Button title="Back" type="secondary" onPress={() => setStep(2)} style={{ flex: 1, marginRight: 8 }} />
                <Button title="Confirm" onPress={() => {
                  handleClose();
                  navigation.navigate('Loading', {
                    type: 'Data', // Ensure transaction type is set
                    network: selectedNetwork,
                    contact,
                    bundle: selectedBundle?.amount + ' (' + selectedBundle?.duration + ')',
                    price: selectedBundle?.price || '',
                  });
                }} style={{ flex: 1, marginLeft: 8 }} />
              </View>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 35,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: '95%',
    alignSelf: 'center',
    position: 'absolute',
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
    color: colors.text,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  pickContact: {
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  networkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  networkBox: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  bundleCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#E6F0FF',
  },
  bundleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bundleAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  bundleDuration: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  bundlePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default DataModal;
