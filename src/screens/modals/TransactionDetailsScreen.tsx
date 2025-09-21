import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../theme/styles';

const TransactionDetailsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.heading}>Transaction Details</Text>
    <Text style={styles.body}>Full transaction breakdown UI goes here.</Text>
  </View>
);

export default TransactionDetailsScreen;
