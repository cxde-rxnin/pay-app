import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';

const { height } = Dimensions.get('window');

interface User {
  name: string;
  accountNumber: string;
  bankName: string;
}

interface AddMoneyModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ visible, onClose, user }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleClose = () => {
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

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
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
          styles.card, 
          { 
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ]
          }
        ]}>
          <View style={styles.dragIndicator} />
          <Text style={styles.heading}>Add Money</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Number:</Text>
            <Text style={styles.value}>{user.accountNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bank Name:</Text>
            <Text style={styles.value}>{user.bankName}</Text>
          </View>
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
    bottom: 30,
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
    marginBottom: 18,
    textAlign: 'left',
    fontFamily: fontConfig.heading,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingVertical: 15,
  },
  label: {
    color: colors.gray,
    fontWeight: '600',
    fontSize: 15,
  },
  value: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 15,
  },
});

export default AddMoneyModal;