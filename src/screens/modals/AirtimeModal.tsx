import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, Animated, Dimensions, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Contacts from 'expo-contacts';
import colors from '../../theme/colors';
import { BlurView } from 'expo-blur';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { height } = Dimensions.get('window');

const NETWORKS = [
  { name: 'MTN', color: '#FFD700' },
  { name: 'Airtel', color: '#E60026' },
  { name: 'Glo', color: '#009A44' },
  { name: '9mobile', color: '#6CC417' },
];

interface AirtimeModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (contact: string, network: string) => void;
}

type RootStackParamList = {
  Loading: { network: string; contact: string; amount: string };
  Payment: { network: string; contact: string; amount: string };
};

const AirtimeModal: React.FC<AirtimeModalProps> = ({ visible, onClose, onContinue }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [contact, setContact] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [summaryData, setSummaryData] = useState<{ contact: string; network: string; amount: string }>({ contact: '', network: '', amount: '' });

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    Keyboard.dismiss();
    setContact('');
    setSelectedNetwork('');
    setAmount('');
    setStep(1);
    setShowContactPicker(false);
    setContactsList([]);
    setShowSummary(false);
    setSummaryData({ contact: '', network: '', amount: '' });
    // Start both animations simultaneously
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
      // Hide modal after animations complete
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
      
      // Close modal if dragged down more than 100 pixels or fast velocity downward
      if (dragDistance > 100 || velocityY > 500) {
        // Reset translateY and close
        translateY.setValue(0);
        handleClose();
      } else {
        // Snap back to original position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    }
  };

  const handlePickContact = async () => {
    try {
      // Request permission to access contacts
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to contacts to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get contacts with phone numbers
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        sort: Contacts.SortTypes.FirstName,
      });

      const contactsWithPhone = data.filter(contact => 
        contact.phoneNumbers && contact.phoneNumbers.length > 0
      );

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
    if (visible) {
      // Show modal immediately, then start slide-in animation
      setModalVisible(true);
      slideAnim.setValue(height); // Ensure starting position
      fadeAnim.setValue(0); // Ensure starting opacity
      translateY.setValue(0); // Reset drag position
      
      // Small delay to ensure modal is rendered before animation
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
      // Only animate out if modal is currently visible
      handleClose();
    }
  }, [visible, modalVisible, slideAnim, fadeAnim, translateY]);

  // Keyboard handling
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
          <Text style={styles.title}>Buy Airtime</Text>
          
          {/* Step 1: Contact & Network Selection */}
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
              
              <TouchableOpacity style={styles.pickContact} onPress={handlePickContact}>
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
                        backgroundColor: colors.primary + '15'
                      }
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
                onPress={() => {
                  // When user continues from step 1
                  setStep(2);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Continue</Text>
              </TouchableOpacity>
            </>
          )}
          
          {/* Step 2: Preview & Amount Input */}
          {step === 2 && (
            <View>
              <View style={{ alignItems: 'flex-start', marginBottom: 18, padding: 10, backgroundColor: '#F7F8FA', borderRadius: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}><Text>{selectedNetwork}</Text></Text>
                <Text style={{ fontSize: 16, color: colors.gray, marginTop: 4 }}>{contact}</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor={colors.gray}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Button
                  title="Back"
                  type="secondary"
                  onPress={() => setStep(1)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Buy Airtime"
                  onPress={() => setStep(3)}
                  style={{ flex: 1, marginLeft: 8, opacity: !amount ? 0.5 : 1 }}
                />
              </View>
            </View>
          )}

          {/* Step 3: Transaction Summary */}
          {step === 3 && (
            <View>
              <Text style={styles.title}>Transaction Summary</Text>
              <Text style={styles.label}>Network:</Text>
              <Text style={styles.value}>{selectedNetwork}</Text>
              <Text style={styles.label}>Number:</Text>
              <Text style={styles.value}>{contact}</Text>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>{amount}</Text>
              <View style={{ flexDirection: 'row', marginTop: 24 }}>
                <Button title="Back" type="secondary" onPress={() => setStep(2)} style={{ flex: 1, marginRight: 8 }} />
                <Button title="Confirm" onPress={() => {
                  handleClose();
                  navigation.navigate('Loading', { network: selectedNetwork, contact, amount });
                }} style={{ flex: 1, marginLeft: 8 }} />
              </View>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>

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
  networkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  networkBox: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    borderColor: '#eee',
    borderWidth: 1,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
});

export default AirtimeModal;