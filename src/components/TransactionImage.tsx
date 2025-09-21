import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export interface Transaction {
  amount: string;
  date: string;
  time: string;
  type: string;
  sender: string;
  senderAvatar?: string;
  senderBank?: string;
  senderAccount?: string;
  receiver?: string;
  receiverAccount?: string;
  phone?: string;
  sessionId: string;
  bankName?: string;
  status?: string;
}

export interface TransactionImageProps {
  transaction: Transaction;
  backgroundImage?: any;
}

// Helper: Dummy transaction data for different types
const getDummyTransaction = (type: string): Transaction => {
  switch (type) {
    case 'Airtime':
      return {
        amount: '₦500.00',
        date: '2025-09-21',
        time: '14:32',
        type: 'Airtime',
        sender: 'Obed Ihekaike',
        receiver: '08012345678',
        phone: '08012345678',
        sessionId: 'AIRTIME123456789',
        bankName: 'MTN',
        status: 'success',
      };
    case 'Bank Transfer':
      return {
        amount: '₦10,000.00',
        date: '2025-09-21',
        time: '09:15',
        type: 'Bank Transfer',
        sender: 'Obed Ihekaike',
        senderBank: 'Opay',
        senderAccount: '8124731527',
        receiver: 'OBED OKEMSINACHI IHEKAIKE',
        receiverAccount: 'GTBank (0123456789)',
        sessionId: 'BANKTX123456789',
        bankName: 'GTBank',
        status: 'success',
      };
    case 'Data':
      return {
        amount: '₦1,200.00',
        date: '2025-09-21',
        time: '16:45',
        type: 'Data',
        sender: 'Obed Ihekaike',
        receiver: '08098765432',
        phone: '08098765432',
        sessionId: 'DATA123456789',
        bankName: 'Glo',
        status: 'success',
      };
    default:
      return {
        amount: '₦2,000.00',
        date: '2025-09-21',
        time: '12:00',
        type: type,
        sender: 'Obed Ihekaike',
        receiver: 'Unknown',
        sessionId: 'GENERIC123456789',
        bankName: 'Payyy',
        status: 'success',
      };
  }
};

// Use dummy data directly for preview/testing
const dummyTransaction = getDummyTransaction('Airtime'); // Change type as needed

const TransactionImage: React.FC<{ backgroundImage?: any }> = ({ backgroundImage }) => {
  const transaction = dummyTransaction;
  const viewRef = useRef<View>(null);

  if (!transaction) {
    return (
      <View style={styles.card} collapsable={false}>
        <Text style={styles.errorText}>No transaction data</Text>
      </View>
    );
  }

  const getStatusIcon = () => {
    if (transaction.status === 'success') {
      return <Ionicons name="checkmark-circle" size={28} color="#00D4AA" />;
    }
    return <Ionicons name="time-outline" size={28} color="#FFA726" />;
  };

  const getTransactionIcon = () => {
    if (!transaction.type) return null;
    switch (transaction.type.toLowerCase()) {
      case 'airtime':
        return <Ionicons name="call" size={24} color="#4A90E2" />;
      case 'data':
        return <Ionicons name="wifi" size={24} color="#7B68EE" />;
      case 'bank transfer':
        return <Ionicons name="card" size={24} color="#50E3C2" />;
      default:
        return <Ionicons name="swap-horizontal" size={24} color="#F5A623" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background with gradient overlay */}
      {backgroundImage && (
        <Image
          source={backgroundImage}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      <View style={styles.gradientOverlay} />
      
      <View style={styles.receiptCard}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>Payyy</Text>
            <View style={styles.statusContainer}>
              {getStatusIcon()}
            </View>
          </View>
          
          <Text style={styles.receiptTitle}>Transaction Successful</Text>
          <View style={styles.divider} />
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>{transaction.amount}</Text>
          <View style={styles.transactionTypeRow}>
            {getTransactionIcon()}
            <Text style={styles.transactionType}>{transaction.type}</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userSection}>
          <View>
            <View style={styles.userInfo}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{transaction.sender}</Text>
                {transaction.senderBank && (
                  <Text style={styles.userBank}>
                    {transaction.senderBank}
                    {transaction.senderAccount && ` • ${transaction.senderAccount}`}
                  </Text>
                )}
              </View>
            </View>
            
            {transaction.receiver && (
              <>
                <View style={styles.receiverInfo}>
                  <Text style={styles.receiverLabel}>To:</Text>
                  <Text style={styles.receiverName}>{transaction.receiver}</Text>
                  {transaction.receiverAccount && (
                    <Text style={styles.receiverAccount}>{transaction.receiverAccount}</Text>
                  )}
                  {transaction.phone && (
                    <Text style={styles.receiverPhone}>{transaction.phone}</Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Transaction Details</Text>
          <View style={styles.detailsGrid}>
            <View>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{transaction.date}</Text>
              <Text style={styles.detailSubValue}>{transaction.time}</Text>
            </View>
            <View style={{ marginTop: 18 }}>
              <Text style={styles.detailLabel}>Session ID</Text>
              <Text style={styles.detailValue}>{transaction.sessionId ? String(transaction.sessionId).substring(0, 8) + '...' : 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>Secure transaction powered by</Text>
            <Text style={styles.footerBrand}>Payyy {transaction.bankName && `• ${transaction.bankName}`}</Text>
          </View>
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#00D4AA" />
            <Text style={styles.securityText}>Verified & Secure</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 600,
    height: 900,
    position: 'relative',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(74, 144, 226, 0.08)', // fallback color, adjust as needed
  },
  receiptCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    borderRadius: 20,
    padding: 32,
    // backdropFilter is not supported in React Native
  },
  header: {
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  brandName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#e2e8f0',
    marginTop: 16,
    borderRadius: 1,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1a202c',
    marginBottom: 12,
    letterSpacing: -1,
  },
  transactionTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 8,
  },
  userSection: {
    marginBottom: 32,
  },
  userCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 2,
  },
  userBank: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '500',
  },
  transferArrow: {
    alignItems: 'center',
    marginVertical: 12,
  },
  receiverInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  receiverLabel: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  receiverName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  receiverAccount: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '500',
  },
  receiverPhone: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
    marginTop: 2,
  },
  detailsSection: {
    marginBottom: 32,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailLabel: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 2,
  },
  detailSubValue: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },
  footerContent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  footerBrand: {
    fontSize: 18,
    color: '#1a202c',
    fontWeight: '700',
    marginTop: 2,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  securityText: {
    fontSize: 18,
    color: '#00D4AA',
    fontWeight: '600',
    marginLeft: 4,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TransactionImage;