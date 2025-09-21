import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import styles from '../theme/styles';

type Props = {
  title: React.ReactNode;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({ title, onPress, type = 'primary', style, disabled }) => (
  <TouchableOpacity
    style={[type === 'primary' ? styles.buttonPrimary : styles.buttonSecondary, style, { paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }]}
    onPress={disabled ? undefined : onPress}
    activeOpacity={0.8}
    disabled={disabled}
  >
    <Text style={type === 'primary' ? styles.buttonPrimaryText : styles.buttonSecondaryText}>{title}</Text>
  </TouchableOpacity>
);

export default Button;
