import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../theme/styles';
import BalanceCard from '../../components/BalanceCard';
import Button from '../../components/Button';
import ServiceTile from '../../components/ServiceTile';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Notification } from 'iconsax-react-nativejs';
import AddMoneyModal from '../modals/AddMoneyModal';
import SendMoneyModal from '../modals/SendMoneyModal';
import AirtimeModal from '../modals/AirtimeModal';
import DataModal from '../modals/DataModal';
import UsertagTransferModal from '../modals/UsertagTransferModal';
import HistoryModal from '../modals/HistoryModal';
import SendToLemoModal from '../modals/SendToLemoModal';
import QrCodeModal from '../modals/QrCodeModal';
import { useNotifications } from '../../contexts/NotificationContext';

type RootStackParamList = {
  Auth: undefined;
  KYC: undefined;
  App: undefined;
  SendToLemo: undefined;
  SendToBank: undefined;
  TransactionDetails: any;
};

type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Settings: undefined;
  Modals: { screen: string };
};

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

type ScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { unreadCount } = useNotifications();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showAirtimeModal, setShowAirtimeModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showUsertagModal, setShowUsertagModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSendToLemoModal, setShowSendToLemoModal] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const user = { name: 'Obed', accountNumber: '1234567890', bankName: 'Lemo Bank' };

  const handleSendMoneySelect = (option: 'lemo' | 'bank') => {
    setShowSendMoney(false);
    if (option === 'lemo') {
      navigation.navigate('SendToLemo');
    } else if (option === 'bank') {
      navigation.navigate('SendToBank');
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: '#F7F8FA', paddingHorizontal: 0 }]}
      contentContainerStyle={{ paddingBottom: 32 }}>
      <AddMoneyModal visible={showAddMoney} onClose={() => setShowAddMoney(false)} user={user} />
      <SendMoneyModal visible={showSendMoney} onClose={() => setShowSendMoney(false)} onSelect={handleSendMoneySelect} />
      <AirtimeModal
        visible={showAirtimeModal}
        onClose={() => setShowAirtimeModal(false)}
        onContinue={(contact, network) => {
          setShowAirtimeModal(false);
          // TODO: Navigate to next form step or handle data
        }}
      />
      <DataModal visible={showDataModal} onClose={() => setShowDataModal(false)} />
      <UsertagTransferModal visible={showUsertagModal} onClose={() => setShowUsertagModal(false)} />
      <HistoryModal visible={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
      <SendToLemoModal visible={showSendToLemoModal} onClose={() => setShowSendToLemoModal(false)} />
      <QrCodeModal visible={showQrCodeModal} onClose={() => setShowQrCodeModal(false)} />
      <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingTop: 40 }}>
          <Text style={{ fontSize: 24, color: colors.text, fontWeight: '900', fontFamily: fontConfig.heading }}>Hello, Obed</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Modals', { screen: 'Notifications' })}
            style={{ position: 'relative', marginLeft: 8 }}
          >
            <Notification
              size={26}
              color={colors.primary}
              variant="Outline"
            />
            {unreadCount > 0 && (
              <View style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: '#FF3B30',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 5,
                borderWidth: 2,
                borderColor: colors.white,
              }}>
                <Text style={{
                  color: colors.white,
                  fontSize: 11,
                  fontWeight: '700',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 18 }}>
          <BalanceCard balance={100000} currency="NGN" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>
          <Button title="Add Money" type="secondary" onPress={() => setShowAddMoney(true)} style={{ flex: 1, marginRight: 10 }} />
          <Button title="Send Money"  onPress={() => setShowSendMoney(true)} style={{ flex: 1, marginLeft: 10 }} />
        </View>

        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 24, marginTop: 24, fontFamily: fontConfig.heading }}>Quick Action</Text>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', gap: 12, }}>
            <TouchableOpacity onPress={() => setShowAirtimeModal(true)}>
              <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
                <Image
                  source={require('../../assets/airtime.png')}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDataModal(true)}>
              <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
                <Image
                  source={require('../../assets/wifi.png')}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowHistoryModal(true)}>
              <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
                <Image
                  source={require('../../assets/history.png')}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowQrCodeModal(true)}>
                <View style={{ alignItems: 'center', backgroundColor: '#cccccc2f', padding: 12, borderRadius: 12 }}>
                <Image
                  source={require('../../assets/tag.png')}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                  resizeMode="cover"
                />
                </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 24, marginTop: 24, fontFamily: fontConfig.heading }}>Recent Transactions</Text>
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