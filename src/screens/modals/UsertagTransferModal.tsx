import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, KeyboardAvoidingView, Platform, Animated, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

interface UsertagTransferModalProps {
  visible: boolean;
  onClose: () => void;
}

const UsertagTransferModal: React.FC<UsertagTransferModalProps> = ({ visible, onClose }) => {
  const [usertag, setUsertag] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [usertagFocused, setUsertagFocused] = useState(false);
  const usertagInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

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

  const handleClose = () => {
    Keyboard.dismiss();
    setUsertag('');
    setAmount('');
    setUsertagFocused(false);
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

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}/>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetY={10}
          failOffsetY={-10}
        >
          <Animated.View style={[styles.card, {
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ],
            bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 30,
          }]}
          >
            <View style={styles.dragIndicator} />
            <Text style={styles.title}>Send Money by Usertag</Text>
            
            <TouchableWithoutFeedback onPress={() => usertagInputRef.current?.focus()}>
              <View style={[
                styles.inputContainer, 
                usertagFocused && styles.inputContainerFocused
              ]}>
                <Text style={styles.prefix}>@</Text>
                <TextInput
                  ref={usertagInputRef}
                  style={styles.usertagInput}
                  placeholder="usertag"
                  placeholderTextColor={colors.gray}
                  value={usertag.replace(/^@/, '')}
                  onChangeText={text => setUsertag(text.replace(/^@/, ''))}
                  onFocus={() => setUsertagFocused(true)}
                  onBlur={() => setUsertagFocused(false)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </TouchableWithoutFeedback>


            <TextInput
              style={styles.input}
              placeholder="Amount"
              placeholderTextColor={colors.gray}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            
            <View style={{ flexDirection: 'row', marginTop: 24 }}>
              <Button
                title="Send"
                onPress={() => {
                  handleClose();
                  (navigation as any).navigate('Loading', {
                    type: 'internal',
                    usertag: usertag.startsWith('@') ? usertag : '@' + usertag,
                    amount,
                  });
                }}
                style={{ flex: 1, marginLeft: 8, opacity: !usertag || !amount ? 0.5 : 1 }}
                disabled={!usertag || !amount}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </KeyboardAvoidingView>
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
    fontFamily: fontConfig.heading,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    marginBottom: 25,
    backgroundColor: colors.white,
    paddingLeft: 12,
  },
  inputContainerFocused: {
    borderColor: colors.primary || '#007AFF',
    borderWidth: 2,
    shadowColor: colors.primary || '#007AFF',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  prefix: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginRight: 2,
    paddingVertical: 12,
  },
  usertagInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 0,
  },
});

export default UsertagTransferModal;