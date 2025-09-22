import React from 'react';
import { View, Text, Image, StyleSheet, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import TransactionImage from '../../components/TransactionImage';
import { captureRef } from 'react-native-view-shot';

const resultGifs: Record<string, any> = {
  success: require('../../assets/gifs/paid.gif'),
  sent: require('../../assets/gifs/sent.gif'),
  error: require('../../assets/gifs/insufficient.gif'),
};

const TransactionResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { status, message, transaction } = route.params || {};
  
  // Use sent.gif for internal transfers, paid.gif for other successful transactions
  const getGif = () => {
    if (status === 'success') {
      if (transaction?.type === 'Internal Transfer') {
        return resultGifs.sent;
      }
      return resultGifs.success;
    }
    return resultGifs.error;
  };

  const gif = getGif();

  // transaction info is now passed from the modal flow
  const transactionInfo = transaction || {};

  const transactionImageRef = React.useRef(null);

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
    }
  };

  return (
    <View style={styles.container}>
      <Image source={gif} style={styles.gif} resizeMode="contain" />
      <Text style={[styles.title, status === 'success' ? styles.success : styles.error]}>
        {status === 'success' ? 'Transaction Successful!' : 'Transaction Failed'}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {/* Hidden TransactionImage for sharing - positioned off-screen */}
      <View style={styles.hiddenImageContainer}>
        <View ref={transactionImageRef} collapsable={false}>
          <TransactionImage
            backgroundImage={require('../../assets/receipt.png')}
            transaction={transactionInfo}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button
            title={<Ionicons name="download-outline" size={22} color={colors.primary} />}
            type="secondary"
            onPress={handleShare}
            style={styles.shareButton}
          />
          <Button
            title="Back to Home"
            onPress={() => (navigation as any).reset({ index: 0, routes: [{ name: 'App' }] })}
            style={styles.homeButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  gif: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: colors.success || '#2ecc40',
  },
  error: {
    color: colors.error || '#e74c3c',
  },
  message: {
    fontSize: 16,
    color: colors.text || '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  hiddenImageContainer: {
    position: 'absolute',
    left: -10000, // Move far off-screen
    top: 0,
    // Don't constrain the size - let TransactionImage use its own dimensions
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  shareButton: {
    width: '20%',
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: colors.primary || '#1877F2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: '75%',
  },
});

export default TransactionResultScreen;