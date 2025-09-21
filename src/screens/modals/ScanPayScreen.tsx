import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../theme/styles';

const ScanPayScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.heading}>Scan & Pay</Text>
    <Text style={styles.body}>QR code generator & scanner will be here.</Text>
  </View>
);

export default ScanPayScreen;
