import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Call, Wifi, People, Bank, ArrowUp2, ArrowDown2 } from 'iconsax-react-nativejs';

import styles from '../../theme/styles';
import TransactionListItem from '../../components/TransactionListItem';
import colors from '../../theme/colors';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  TransactionDetails: {
    transaction: any;
  };
};

type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Settings: undefined;
  Modals: { screen: string; params?: any };
};

type ScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Transactions'>,
    StackNavigationProp<RootStackParamList>
  >;
};

const tabs = ['All', 'Internal', 'Bank', 'Utilities'];

// Sample transaction data with more details
const allTransactions = [
  {
    id: '1',
    type: 'Internal Transfer',
    initials: 'RK',
    name: 'Roland Kevin',
    usertag: '@rolandkevin',
    amount: 12950,
    date: 'Oct 3, 2025',
    time: '5:45 AM',
    status: 'success',
    sessionId: 'INT1727952300000',
    category: 'internal',
  },
  {
    id: '2',
    type: 'Bank Transfer',
    initials: 'JB',
    name: 'James Brown',
    bankName: 'GTBank',
    accountNumber: '0123456789',
    amount: -30000,
    fee: 10,
    date: 'Oct 3, 2025',
    time: '5:01 AM',
    status: 'success',
    sessionId: 'BANK1727950860000',
    category: 'bank',
  },
  {
    id: '3',
    type: 'Airtime',
    initials: 'MT',
    name: 'MTN Airtime',
    network: 'MTN',
    phone: '08012345678',
    amount: -500,
    date: 'Oct 3, 2025',
    time: '4:41 AM',
    status: 'success',
    sessionId: 'AIRTIME1727949660000',
    category: 'utilities',
  },
  {
    id: '4',
    type: 'Internal Transfer',
    initials: 'SO',
    name: 'Sanusi Olanrewaju',
    usertag: '@sanusio',
    amount: -12110,
    date: 'Oct 3, 2025',
    time: '3:01 AM',
    status: 'success',
    sessionId: 'INT1727943660000',
    category: 'internal',
  },
  {
    id: '5',
    type: 'Data',
    initials: '9M',
    name: '9mobile Data',
    network: '9mobile',
    phone: '08098765432',
    bundle: '2GB - 30 Days',
    amount: -1000,
    date: 'Oct 2, 2025',
    time: '2:30 PM',
    status: 'success',
    sessionId: 'DATA1727866200000',
    category: 'utilities',
  },
  {
    id: '6',
    type: 'Bank Transfer',
    initials: 'KS',
    name: 'Kunle Sayo',
    bankName: 'Access Bank',
    accountNumber: '9876543210',
    amount: -9420,
    fee: 10,
    date: 'Oct 2, 2025',
    time: '2:30 PM',
    status: 'success',
    sessionId: 'BANK1727866200000',
    category: 'bank',
  },
  {
    id: '7',
    type: 'Internal Transfer',
    initials: 'LF',
    name: 'Lekan Fuji',
    usertag: '@lekanf',
    amount: 2000,
    date: 'Oct 2, 2025',
    time: '1:23 PM',
    status: 'success',
    sessionId: 'INT1727862180000',
    category: 'internal',
  },
  {
    id: '8',
    type: 'Airtime',
    initials: 'GL',
    name: 'Glo Airtime',
    network: 'Glo',
    phone: '08123456789',
    amount: -200,
    date: 'Oct 2, 2025',
    time: '12:20 PM',
    status: 'success',
    sessionId: 'AIRTIME1727858400000',
    category: 'utilities',
  },
];

const TransactionsScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (activeTab === 0) return allTransactions; // All
    const categoryMap = ['all', 'internal', 'bank', 'utilities'];
    return allTransactions.filter(tx => tx.category === categoryMap[activeTab]);
  };

  const filteredTransactions = getFilteredTransactions();

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups: any, transaction: any) => {
    const date = transaction.date;
    const today = 'Oct 3, 2025';
    const yesterday = 'Oct 2, 2025';
    
    let groupTitle = date;
    if (date === today) groupTitle = 'TODAY';
    else if (date === yesterday) groupTitle = 'YESTERDAY';
    
    if (!groups[groupTitle]) {
      groups[groupTitle] = [];
    }
    groups[groupTitle].push(transaction);
    return groups;
  }, {});

  const groupedData = Object.keys(groupedTransactions).map(title => ({
    title,
    data: groupedTransactions[title],
  }));

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Internal Transfer':
        return <People size={20} color={colors.primary} variant="Bold" />;
      case 'Bank Transfer':
        return <Bank size={20} color="#50E3C2" variant="Bold" />;
      case 'Airtime':
        return <Call size={20} color="#F5A623" variant="Bold" />;
      case 'Data':
        return <Wifi size={20} color="#7B68EE" variant="Bold" />;
      default:
        return <Ionicons name="swap-horizontal" size={20} color={colors.gray} />;
    }
  };

  const handleTransactionPress = (transaction: any) => {
    (navigation as any).navigate('TransactionDetails', { transaction });
  };

  return (
    <View style={[screenStyles.container]}> 
      {/* Header */}
      <View style={screenStyles.header}>
        <Text style={screenStyles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={screenStyles.filterButton}>
          <Ionicons name="search" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={screenStyles.tabsContainer}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(idx)}
            style={[
              screenStyles.tab,
              activeTab === idx && screenStyles.activeTab,
            ]}
          >
            <Text style={[
              screenStyles.tabText,
              activeTab === idx && screenStyles.activeTabText,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={screenStyles.groupContainer}>
            <Text style={screenStyles.groupTitle}>{item.title}</Text>
            {item.data.map((tx: any) => (
              <TouchableOpacity 
                key={tx.id} 
                onPress={() => handleTransactionPress(tx)}
                style={screenStyles.transactionCard}
              >
                <View style={screenStyles.transactionIconContainer}>
                  {getTransactionIcon(tx.type)}
                </View>
                <View style={screenStyles.transactionInfo}>
                  <Text style={screenStyles.transactionName}>{tx.name}</Text>
                  <Text style={screenStyles.transactionTime}>{tx.time}</Text>
                </View>
                <View style={screenStyles.transactionAmountContainer}>
                  <Text style={[
                    screenStyles.transactionAmount,
                    { color: tx.amount >= 0 ? colors.success : colors.text },
                  ]}>
                    {tx.amount >= 0 ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString()}
                  </Text>
                  {tx.amount >= 0 ? (
                    <ArrowDown2 size={14} color={colors.success} variant="Bold" />
                  ) : (
                    <ArrowUp2 size={14} color={colors.error} variant="Bold" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={screenStyles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={colors.gray} />
            <Text style={screenStyles.emptyText}>No transactions yet</Text>
            <Text style={screenStyles.emptySubText}>
              Your transaction history will appear here
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={screenStyles.listContent}
      />
    </View>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  filterButton: {
    padding: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F7',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: {
    color: colors.gray,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: colors.primary,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    marginBottom: 12,
    marginLeft: 20,
    color: colors.gray,
    fontWeight: '700',
    fontSize: 13,
  },
  transactionCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 13,
    color: colors.gray,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default TransactionsScreen;
