import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../../theme/colors';
import Button from '../../components/Button';

interface SummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  network: string;
  contact: string;
  amount: string;
}

type RootStackParamList = {
  Loading: { network: string; contact: string; amount: string };
  Payment: { network: string; contact: string; amount: string };
};

const SummaryModal: React.FC<SummaryModalProps> = ({ visible, onClose, onConfirm, network, contact, amount }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Transaction Summary</Text>
          <Text style={styles.label}>Network:</Text>
          <Text style={styles.value}>{network}</Text>
          <Text style={styles.label}>Number:</Text>
          <Text style={styles.value}>{contact}</Text>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{amount}</Text>
          <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <Button title="Back" type="secondary" onPress={onClose} style={{ flex: 1, marginRight: 8 }} />
            <Button title="Confirm" onPress={() => {
              onClose();
              navigation.navigate('Loading', { network, contact, amount });
            }} style={{ flex: 1, marginLeft: 8 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    elevation: 4,
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

export default SummaryModal;
