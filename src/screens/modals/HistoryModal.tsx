import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Platform } from 'react-native';
import colors from '../../theme/colors';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

const { height } = Dimensions.get('window');

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('September 2025');
  const [showPicker, setShowPicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
    'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'
  ];

  const dummyData: { [key: string]: { income: number; expenses: number; transactions: number } } = {
    'September 2025': { income: 50000, expenses: 20000, transactions: 12 },
    'August 2025': { income: 30000, expenses: 15000, transactions: 8 },
    'July 2025': { income: 45000, expenses: 25000, transactions: 15 },
    'June 2025': { income: 35000, expenses: 18000, transactions: 10 },
    'May 2025': { income: 42000, expenses: 22000, transactions: 14 },
    'April 2025': { income: 38000, expenses: 19000, transactions: 11 },
    'March 2025': { income: 33000, expenses: 17000, transactions: 9 },
    'February 2025': { income: 29000, expenses: 14000, transactions: 7 },
    'January 2025': { income: 31000, expenses: 16000, transactions: 8 },
  };

  const summary = dummyData[selectedMonth] || { income: 0, expenses: 0, transactions: 0 };
  const total = summary.income + summary.expenses;
  const incomeFlex = total > 0 ? Math.round((summary.income / total) * 100) : 50;
  const expensesFlex = total > 0 ? Math.round((summary.expenses / total) * 100) : 50;

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

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString()}`;
  };

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>
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
          
          <View style={{ marginBottom: 18 }}>
            <Text style={[styles.title, { color: colors.text }]}>Transaction Summary</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.monthSelector}
            onPress={() => setShowPicker(!showPicker)}
            activeOpacity={0.7}
          >
            <Text style={styles.monthSelectorLabel}>Select Month</Text>
            <Text style={styles.monthSelectorValue}>{selectedMonth}</Text>
            <Text style={styles.monthSelectorArrow}>{showPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showPicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => {
                  console.log('Selected month:', itemValue); // Debug log
                  setSelectedMonth(itemValue);
                  setShowPicker(false); // Close picker after selection
                }}
                style={[styles.picker, { color: colors.text }]}
                mode="dropdown"
                dropdownIconColor={colors.text}
              >
                {months.map(month => (
                  <Picker.Item 
                    key={month} 
                    label={month} 
                    value={month}
                    color={Platform.OS === 'ios' ? colors.text : undefined}
                  />
                ))}
              </Picker>
            </View>
          )}
          
          <View style={styles.barContainer}>
            <View style={[styles.bar, { flex: expensesFlex, backgroundColor: '#FF4444' }]} />
            <View style={[styles.bar, { flex: incomeFlex, backgroundColor: '#4CAF50' }]} />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Transactions</Text>
              <Text style={styles.statValue}>{summary.transactions}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.statValue}>{formatCurrency(summary.income)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Expenses</Text>
              <Text style={styles.statValue}>{formatCurrency(summary.expenses)}</Text>
            </View>
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
  monthSelector: {
    borderWidth: 1,
    borderColor: colors.gray + '30',
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthSelectorLabel: {
    fontSize: 12,
    color: colors.gray,
    position: 'absolute',
    top: 8,
    left: 16,
  },
  monthSelectorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    flex: 1,
  },
  monthSelectorArrow: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray + '30',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 50,
    width: '100%',
    backgroundColor: colors.white,
  },
  barContainer: {
    flexDirection: 'row',
    height: 8,
    marginBottom: 20,
    gap: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'flex-start',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default HistoryModal;