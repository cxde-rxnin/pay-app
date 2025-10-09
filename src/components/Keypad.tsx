import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FingerScan } from 'iconsax-react-nativejs';
import colors from '../theme/colors';

interface KeypadProps {
  onKeyPress: (digit: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete, onBiometric, showBiometric = false }) => {
  
  // Debug logging
  React.useEffect(() => {
    console.log('🎹 Keypad Debug:', {
      showBiometric,
      hasOnBiometric: !!onBiometric,
    });
  }, [showBiometric, onBiometric]);

  return (
    <View style={styles.keypad}>
    {[['1','2','3'],['4','5','6'],['7','8','9']].map((row, i) => (
      <View key={i} style={styles.keypadRow}>
        {row.map((key, j) => (
          <TouchableOpacity
            key={j}
            onPress={() => onKeyPress(key)}
            style={styles.keypadButton}
            activeOpacity={0.6}
          >
            <Text style={styles.keypadText}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ))}
    
    {/* Bottom row with biometric option */}
    <View style={styles.keypadRow}>
      <TouchableOpacity
        onPress={showBiometric && onBiometric ? onBiometric : undefined}
        style={[
          styles.keypadButton, 
          !showBiometric && styles.hiddenButton
        ]}
        activeOpacity={showBiometric ? 0.6 : 1}
      >
        {showBiometric ? (
          <FingerScan size={28} color={colors.primary} variant="Bold" />
        ) : null}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onKeyPress('0')}
        style={styles.keypadButton}
        activeOpacity={0.6}
      >
        <Text style={styles.keypadText}>0</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onDelete}
        style={styles.keypadButton}
        activeOpacity={0.6}
      >
        <Text style={styles.keypadText}>⌫</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  keypad: {
    width: '100%',
    marginTop: 10,
    marginBottom: -60,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keypadButton: {
    flex: 1,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  keypadText: {
    fontSize: 28,
    color: '#222',
    fontWeight: '500',
  },
  hiddenButton: {
    opacity: 0,
  },
});

export default Keypad;
