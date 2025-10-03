import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import colors from '../../theme/colors';
import { 
  ArrowLeft, 
  TickCircle, 
  User, 
  Bank, 
  Call, 
  Wifi, 
  DocumentCopy,
  Export,
  People,
} from 'iconsax-react-nativejs';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import TransactionImage from '../../components/TransactionImage';

const TransactionDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { transaction } = route.params || {};

  if (!transaction) {
    return (
      <View style={detailStyles.container}>
        <Text>No transaction data</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return colors.success;
      case 'pending':
        return '#FFA726';
      case 'failed':
        return colors.error;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status?.toLowerCase()) {
      case 'success':
        return <TickCircle size={24} color={colors.success} variant="Bold" />;
      case 'pending':
        return <Ionicons name="time-outline" size={24} color="#FFA726" />;
      case 'failed':
        return <Ionicons name="close-circle" size={24} color={colors.error} />;
      default:
        return null;
    }
  };

  const getTypeIcon = () => {
    switch (transaction.type) {
      case 'Internal Transfer':
        return <People size={32} color={colors.primary} variant="Bold" />;
      case 'Bank Transfer':
        return <Bank size={32} color="#50E3C2" variant="Bold" />;
      case 'Airtime':
        return <Call size={32} color="#F5A623" variant="Bold" />;
      case 'Data':
        return <Wifi size={32} color="#7B68EE" variant="Bold" />;
      default:
        return <Ionicons name="swap-horizontal" size={32} color={colors.gray} />;
    }
  };

  const transactionImageRef = React.useRef(null);

  const copyToClipboard = (text: string) => {
    // Simple alert for now - can be replaced with a toast or clipboard library
    Alert.alert('Copied', `${text} copied to clipboard`);
  };

  const handleShare = async () => {
    try {
      if (transactionImageRef.current) {
        const uri = await captureRef(transactionImageRef.current, {
          format: 'png',
          quality: 0.95,
          width: 600,
          height: 900,
        });
        await Share.share({ url: uri });
      }
    } catch (error) {
      console.log('Share error:', error);
      Alert.alert('Error', 'Failed to share transaction receipt');
    }
  };

  return (
    <View style={detailStyles.container}>
      {/* Header */}
      <View style={detailStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={detailStyles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={detailStyles.headerTitle}>Transaction Details</Text>
        <TouchableOpacity onPress={handleShare} style={detailStyles.shareButton}>
          <Export size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={detailStyles.scrollView} contentContainerStyle={detailStyles.scrollContent}>
        {/* Status & Amount Section */}
        <View style={[
          detailStyles.statusCard,
          { backgroundColor: transaction.amount >= 0 ? '#ECFDF5' : colors.white }
        ]}>
          <View style={detailStyles.iconContainer}>
            {getTypeIcon()}
          </View>
          
          <Text style={detailStyles.transactionType}>{transaction.type}</Text>
          
          <View style={detailStyles.amountContainer}>
            <Text style={[
              detailStyles.amount,
              { color: transaction.amount >= 0 ? colors.success : colors.text }
            ]}>
              {transaction.amount >= 0 ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}
            </Text>
            {transaction.fee && transaction.amount < 0 && (
              <Text style={detailStyles.feeText}>Fee: ₦{transaction.fee}</Text>
            )}
          </View>

          <View style={[detailStyles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
            {getStatusIcon()}
            <Text style={[detailStyles.statusText, { color: getStatusColor(transaction.status) }]}>
              {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
            </Text>
          </View>
        </View>

        {/* Transaction Information */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>Transaction Information</Text>
          
          <View style={detailStyles.infoCard}>
            {/* Recipient/Beneficiary */}
            <View style={detailStyles.infoRow}>
              <Text style={detailStyles.infoLabel}>
                {transaction.amount >= 0 ? 'From' : 'To'}
              </Text>
              <Text style={detailStyles.infoValue}>{transaction.name}</Text>
            </View>

            {/* Type-specific details */}
            {transaction.type === 'Internal Transfer' && transaction.usertag && (
              <View style={detailStyles.infoRow}>
                <Text style={detailStyles.infoLabel}>Usertag</Text>
                <View style={detailStyles.copyContainer}>
                  <Text style={detailStyles.infoValue}>{transaction.usertag}</Text>
                  <TouchableOpacity onPress={() => copyToClipboard(transaction.usertag)}>
                    <DocumentCopy size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {transaction.type === 'Bank Transfer' && (
              <>
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>Bank Name</Text>
                  <Text style={detailStyles.infoValue}>{transaction.bankName}</Text>
                </View>
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>Account Number</Text>
                  <View style={detailStyles.copyContainer}>
                    <Text style={detailStyles.infoValue}>{transaction.accountNumber}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(transaction.accountNumber)}>
                      <DocumentCopy size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {(transaction.type === 'Airtime' || transaction.type === 'Data') && (
              <>
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>Network</Text>
                  <Text style={detailStyles.infoValue}>{transaction.network}</Text>
                </View>
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>Phone Number</Text>
                  <View style={detailStyles.copyContainer}>
                    <Text style={detailStyles.infoValue}>{transaction.phone}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(transaction.phone)}>
                      <DocumentCopy size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                {transaction.bundle && (
                  <View style={detailStyles.infoRow}>
                    <Text style={detailStyles.infoLabel}>Bundle</Text>
                    <Text style={detailStyles.infoValue}>{transaction.bundle}</Text>
                  </View>
                )}
              </>
            )}

            <View style={detailStyles.divider} />

            {/* Date & Time */}
            <View style={detailStyles.infoRow}>
              <Text style={detailStyles.infoLabel}>Date</Text>
              <Text style={detailStyles.infoValue}>{transaction.date}</Text>
            </View>
            <View style={detailStyles.infoRow}>
              <Text style={detailStyles.infoLabel}>Time</Text>
              <Text style={detailStyles.infoValue}>{transaction.time}</Text>
            </View>

            <View style={detailStyles.divider} />

            {/* Session ID */}
            <View style={detailStyles.infoRow}>
              <Text style={detailStyles.infoLabel}>Session ID</Text>
              <View style={detailStyles.copyContainer}>
                <Text style={[detailStyles.infoValue, { fontSize: 13 }]}>
                  {transaction.sessionId}
                </Text>
                <TouchableOpacity onPress={() => copyToClipboard(transaction.sessionId)}>
                  <DocumentCopy size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={detailStyles.helpSection}>
          <Text style={detailStyles.helpText}>
            Need help with this transaction?
          </Text>
          <TouchableOpacity>
            <Text style={detailStyles.helpLink}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Hidden TransactionImage for sharing - positioned off-screen */}
      <View style={detailStyles.hiddenImageContainer}>
        <View ref={transactionImageRef} collapsable={false}>
          <TransactionImage
            backgroundImage={require('../../assets/receipt.png')}
            transaction={{
              ...transaction,
              amount: transaction.amount >= 0 
                ? `₦${transaction.amount.toLocaleString()}` 
                : `₦${Math.abs(transaction.amount).toLocaleString()}`,
              sender: 'Obed Ihekaike',
              receiver: transaction.name,
            }}
          />
        </View>
      </View>

      {/* Bottom Button */}
      <View style={detailStyles.bottomButton}>
        <Button
          title="Close"
          onPress={() => navigation.goBack()}
          type="secondary"
        />
      </View>
    </View>
  );
};

const detailStyles = StyleSheet.create({
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
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '20',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statusCard: {
    margin: 20,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 8,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 4,
  },
  feeText: {
    fontSize: 13,
    color: colors.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray + '20',
    marginVertical: 8,
  },
  helpSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  helpText: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  helpLink: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray + '20',
  },
  hiddenImageContainer: {
    position: 'absolute',
    left: -10000, // Move far off-screen
    top: 0,
  },
});

export default TransactionDetailsScreen;
