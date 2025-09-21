import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../theme/styles';
import BalanceCard from '../../components/BalanceCard';
import Button from '../../components/Button';
import ServiceTile from '../../components/ServiceTile';
import colors from '../../theme/colors';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Notification } from 'iconsax-react-nativejs';
import AddMoneyModal from '../modals/AddMoneyModal';
import SendMoneyModal from '../modals/SendMoneyModal';
import AirtimeModal from '../modals/AirtimeModal';

type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Settings: undefined;
  Modals: { screen: string };
};

type ScreenProps = {
  navigation: BottomTabNavigationProp<AppTabParamList, 'Home'>;
};

const HomeScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showAirtimeModal, setShowAirtimeModal] = useState(false);
  const user = { name: 'Obed', accountNumber: '1234567890', bankName: 'Lemo Bank' };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: '#F7F8FA', paddingHorizontal: 0 }]}
      contentContainerStyle={{ paddingBottom: 32 }}>
      <AddMoneyModal visible={showAddMoney} onClose={() => setShowAddMoney(false)} user={user} />
      <SendMoneyModal visible={showSendMoney} onClose={() => setShowSendMoney(false)} onSelect={() => setShowSendMoney(false)} />
      <AirtimeModal
        visible={showAirtimeModal}
        onClose={() => setShowAirtimeModal(false)}
        onContinue={(contact, network) => {
          setShowAirtimeModal(false);
          // TODO: Navigate to next form step or handle data
        }}
      />
      <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingTop: 40 }}>
          <Text style={{ fontSize: 24, color: colors.text, fontWeight: '900' }}>Hello, Obed</Text>
          <Notification
            size={26}
            color={colors.primary}
            variant="Outline"
            style={{ marginLeft: 8 }}
            onPress={() => navigation.navigate('Modals', { screen: 'Notifications' })}
          />
        </View>
        <View style={{ marginBottom: 18 }}>
          <BalanceCard balance={100000} currency="NGN" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>
          <Button title="Add Money" type="secondary" onPress={() => setShowAddMoney(true)} style={{ flex: 1, marginRight: 10 }} />
          <Button title="Send Money"  onPress={() => setShowSendMoney(true)} style={{ flex: 1, marginLeft: 10 }} />
        </View>

        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 24, marginTop: 24 }}>Quick Action</Text>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', gap: 18, }}>
            <TouchableOpacity onPress={() => setShowAirtimeModal(true)}>
              <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
                <Image
                  source={require('../../assets/airtime.png')}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
              <Image
                source={require('../../assets/wifi.png')}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>

            <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
              <Image
                source={require('../../assets/history.png')}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>

            <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
              <Image
                source={require('../../assets/tag.png')}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 24, marginTop: 24 }}>Recent Transactions</Text>
          <View style={{ padding: 60 }}>
            <Text style={{ color: colors.gray, fontSize: 16, textAlign: 'center' }}>
              No recent transactions yet.
            </Text>
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
