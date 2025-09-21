import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../theme/styles';

const UtilityPaymentsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.heading}>Utility Payments</Text>
    <Text style={styles.body}>Purchase airtime/data, auto-detect network UI goes here.</Text>
  </View>
);

export default UtilityPaymentsScreen;
