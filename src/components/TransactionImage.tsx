import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Extend Transaction type to include all possible fields
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
  bundle?: string; // Added for data transaction
  price?: string; // Added for data transaction
  contact?: string; // Added for data transaction
  network?: string; // Added for data transaction
  usertag?: string; // Added for internal transfers
  accountNumber?: string; // Added for internal transfers
  accountName?: string; // Added for internal transfers
  fee?: string; // Added for bank transfers
  total?: string; // Added for bank transfers
}

const TransactionImage: React.FC<{ backgroundImage?: any; transaction: Transaction }> = ({ backgroundImage, transaction }) => {
  if (!transaction) {
    return (
      <View style={styles.card} collapsable={false}>
        <Text style={styles.errorText}>No transaction data</Text>
      </View>
    );
  }

  const tx: Transaction = transaction;
  const viewRef = useRef<View>(null);

  const getStatusIcon = () => {
    if (tx.status && tx.status.toLowerCase() === 'success') {
      return <Ionicons name="checkmark-circle" size={28} color="#00D4AA" />;
    }
    if (tx.status && tx.status.toLowerCase() === 'pending') {
      return <Ionicons name="time-outline" size={28} color="#FFA726" />;
    }
    return <Ionicons name="close-circle" size={28} color="#e74c3c" />;
  };

  const getTransactionIcon = () => {
    if (!tx.type) return null;
    switch (tx.type.toLowerCase()) {
      case 'airtime':
        return <Ionicons name="call" size={24} color="#4A90E2" />;
      case 'data':
        return <Ionicons name="wifi" size={24} color="#7B68EE" />;
      case 'bank transfer':
        return <Ionicons name="card" size={24} color="#50E3C2" />;
      case 'internal transfer':
        return <Ionicons name="people" size={24} color="#F5A623" />;
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
          <Text style={styles.amount}>{tx.amount}</Text>
          <View style={styles.transactionTypeRow}>
            {getTransactionIcon()}
            <Text style={styles.transactionType}>{tx.type}</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userSection}>
          <View>
            <View style={styles.userInfo}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{tx.sender}</Text>
                {tx.senderBank && (
                  <Text style={styles.userBank}>
                    {tx.senderBank}
                    {tx.senderAccount && ` • ${tx.senderAccount}`}
                  </Text>
                )}
              </View>
            </View>
            
            {/* Receiver Info - Different layouts for different transaction types */}
            {tx.receiver && (
              <View style={styles.receiverInfo}>
                <Text style={styles.receiverLabel}>
                  {tx.type?.toLowerCase() === 'data' ? 'Recipient:' : 'To:'}
                </Text>
                <Text style={styles.receiverName}>{tx.receiver}</Text>
                
                {/* Data transaction specific details */}
                {tx.type?.toLowerCase() === 'data' && (
                  <>
                    {tx.phone && (
                      <Text style={styles.receiverPhone}>{tx.phone}</Text>
                    )}
                    {tx.bundle && (
                      <Text style={styles.receiverAccount}>Bundle: {tx.bundle}</Text>
                    )}
                    {tx.bankName && (
                      <Text style={styles.receiverAccount}>Network: {tx.bankName}</Text>
                    )}
                  </>
                )}
                
                {/* Internal transfer specific details */}
                {tx.type?.toLowerCase() === 'internal transfer' && (
                  <>
                    {tx.usertag && (
                      <Text style={styles.receiverAccount}>Usertag: {tx.usertag}</Text>
                    )}
                    {tx.accountNumber && (
                      <Text style={styles.receiverAccount}>Account: {tx.accountNumber}</Text>
                    )}
                  </>
                )}
                
                {/* Bank transfer specific details */}
                {tx.type?.toLowerCase() === 'bank transfer' && (
                  <>
                    {tx.accountNumber && (
                      <Text style={styles.receiverAccount}>Account: {tx.accountNumber}</Text>
                    )}
                    {tx.bankName && (
                      <Text style={styles.receiverAccount}>Bank: {tx.bankName}</Text>
                    )}
                  </>
                )}
                
                {/* Other transaction types */}
                {tx.type?.toLowerCase() !== 'data' && tx.type?.toLowerCase() !== 'internal transfer' && tx.type?.toLowerCase() !== 'bank transfer' && (
                  <>
                    {tx.receiverAccount && (
                      <Text style={styles.receiverAccount}>{tx.receiverAccount}</Text>
                    )}
                    {tx.phone && (
                      <Text style={styles.receiverPhone}>{tx.phone}</Text>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Transaction Details</Text>
          <View style={styles.detailsGrid}>
            <View>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{tx.date || 'N/A'}</Text>
              <Text style={styles.detailSubValue}>{tx.time || 'N/A'}</Text>
            </View>
            <View style={{ marginTop: 18 }}>
              <Text style={styles.detailLabel}>Session ID</Text>
              <Text style={styles.detailValue}>{tx.sessionId ? String(tx.sessionId).substring(0, 8) + '...' : 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>Secure transaction powered by</Text>
            <Text style={styles.footerBrand}>Payyy {tx.bankName && `• ${tx.bankName}`}</Text>
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
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
  },
  receiptCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 20,
    padding: 32,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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