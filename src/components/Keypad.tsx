import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface KeypadProps {
  onKeyPress: (digit: string) => void;
  onDelete: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete }) => (
  <View style={styles.keypad}>
    {[['1','2','3'],['4','5','6'],['7','8','9'],['','0','←']].map((row, i) => (
      <View key={i} style={styles.keypadRow}>
        {row.map((key, j) => (
          <TouchableOpacity
            key={j}
            onPress={() => {
              if (key === '←') onDelete();
              else if (key) onKeyPress(key);
            }}
            style={{ flex: 1, margin: 4, alignItems: 'center', justifyContent: 'center', height: 80 }}
            activeOpacity={0.6}
          >
            <Text style={{ fontSize: 28, color: '#222', fontWeight: '500' }}>
              {key === '←' ? '⌫' : key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </View>
);

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
});

export default Keypad;
