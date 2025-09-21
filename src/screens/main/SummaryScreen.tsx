import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Summary: {
    network: string;
    contact: string;
    amount: string;
  };
  Payment: {
    network: string;
    contact: string;
    amount: string;
  };
};

type Props = StackScreenProps<RootStackParamList, 'Summary'>;

const SummaryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { network, contact, amount } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Summary</Text>
      <Text style={styles.label}>Network:</Text>
      <Text style={styles.value}>{network}</Text>
      <Text style={styles.label}>Number:</Text>
      <Text style={styles.value}>{contact}</Text>
      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value}>{amount}</Text>
      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        <Button title="Back" type="secondary" onPress={() => navigation.goBack()} style={{ flex: 1, marginRight: 8 }} />
        <Button title="Confirm" onPress={() => navigation.navigate('Payment', { network, contact, amount })} style={{ flex: 1, marginLeft: 8 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
    color: colors.text,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
});

export default SummaryScreen;
