import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';

interface SendToLemoModalProps {
  visible: boolean;
  onClose: () => void;
}

const SendToLemoModal: React.FC<SendToLemoModalProps> = ({ visible, onClose }) => {
  const [tag, setTag] = useState('');
  const [amount, setAmount] = useState('');

  console.log('Simple SendToLemoModal - visible:', visible);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 30,
          width: '90%',
          maxHeight: '80%',
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            marginBottom: 20, 
            color: colors.text,
            textAlign: 'center',
            fontFamily: fontConfig.heading,
          }}>
            Send to Lemo
          </Text>
          
          <Text style={{ fontSize: 16, color: colors.gray, marginBottom: 10 }}>
            Enter Lemo user tag
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, color: colors.primary, fontWeight: 'bold', marginRight: 8, fontFamily: fontConfig.heading }}>@</Text>
            <TextInput
              value={tag}
              onChangeText={setTag}
              placeholder="username"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 10,
                padding: 15,
                fontSize: 16,
                backgroundColor: '#f8f9fa',
              }}
            />
          </View>
          
          <Text style={{ fontSize: 16, color: colors.gray, marginBottom: 10 }}>
            Enter amount
          </Text>
          
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount"
            style={{
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
              fontSize: 16,
              backgroundColor: '#f8f9fa',
            }}
            keyboardType="number-pad"
          />
          
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={{ 
                flex: 1,
                backgroundColor: colors.gray + '30', 
                borderRadius: 10, 
                paddingVertical: 15, 
                alignItems: 'center' 
              }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', fontFamily: fontConfig.heading }}>Cancel</Text>
              </View>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback onPress={() => {
              Alert.alert('Success', 'This would send money to @' + tag + ' for ' + amount);
              onClose();
            }}>
              <View style={{ 
                flex: 1,
                backgroundColor: colors.primary, 
                borderRadius: 10, 
                paddingVertical: 15, 
                alignItems: 'center' 
              }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', fontFamily: fontConfig.heading }}>Continue</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SendToLemoModal;