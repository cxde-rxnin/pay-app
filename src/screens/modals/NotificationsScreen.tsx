import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  RefreshControl 
} from 'react-native';
import colors from '../../theme/colors';
import { fontConfig } from '../../theme/fonts';
import { 
  ArrowLeft, 
  TickCircle,
  CloseCircle,
  InfoCircle,
  Gift,
  ArrowUp,
  ArrowDown,
  Trash,
  DocumentText,
  SecurityUser,
  Notification as NotificationIcon,
  Setting2
} from 'iconsax-react-nativejs';

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'promotional' | 'system';
  title: string;
  message: string;
  timestamp: string;
  date: string;
  read: boolean;
  icon?: 'success' | 'failed' | 'info' | 'gift' | 'sent' | 'received' | 'document' | 'security';
  amount?: string;
  actionable?: boolean;
}

interface NotificationsScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'transaction',
      title: 'Money Received',
      message: 'You received ₦15,000 from @chukwudi',
      timestamp: '2 min ago',
      date: 'Today',
      read: false,
      icon: 'received',
      amount: '+₦15,000'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Transfer Successful',
      message: 'Your transfer of ₦5,420 to Kunle Sayo (Access Bank) was successful',
      timestamp: '1 hour ago',
      date: 'Today',
      read: false,
      icon: 'success',
      amount: '-₦5,420'
    },
    {
      id: '3',
      type: 'security',
      title: 'New Login Detected',
      message: 'A new login was detected on your account from Windows device in Lagos, Nigeria',
      timestamp: '3 hours ago',
      date: 'Today',
      read: true,
      icon: 'security',
      actionable: true
    },
    {
      id: '4',
      type: 'promotional',
      title: '🎉 Special Offer!',
      message: 'Get 5% cashback on all airtime purchases this weekend. Limited time only!',
      timestamp: '5 hours ago',
      date: 'Today',
      read: true,
      icon: 'gift'
    },
    {
      id: '5',
      type: 'transaction',
      title: 'Airtime Purchase',
      message: 'You purchased ₦500 MTN airtime for 08012345678',
      timestamp: '10:30 AM',
      date: 'Today',
      read: true,
      icon: 'success',
      amount: '-₦500'
    },
    {
      id: '6',
      type: 'system',
      title: 'Account Verification',
      message: 'Complete your Tier 2 verification to unlock ₦200,000 daily limit',
      timestamp: '9:15 AM',
      date: 'Today',
      read: true,
      icon: 'document',
      actionable: true
    },
    {
      id: '7',
      type: 'transaction',
      title: 'Transfer Failed',
      message: 'Your transfer of ₦25,000 to 0123456789 (GTBank) failed due to insufficient funds',
      timestamp: 'Yesterday',
      date: 'Yesterday',
      read: true,
      icon: 'failed',
      amount: '₦25,000'
    },
    {
      id: '8',
      type: 'transaction',
      title: 'Money Sent',
      message: 'You sent ₦3,000 to @tomiwa',
      timestamp: 'Yesterday',
      date: 'Yesterday',
      read: true,
      icon: 'sent',
      amount: '-₦3,000'
    },
    {
      id: '9',
      type: 'security',
      title: 'PIN Changed Successfully',
      message: 'Your transaction PIN was changed successfully. If this wasn\'t you, contact support immediately.',
      timestamp: 'Yesterday',
      date: 'Yesterday',
      read: true,
      icon: 'security'
    },
    {
      id: '10',
      type: 'promotional',
      title: 'Invite Friends, Earn Rewards',
      message: 'Earn ₦1,000 for every friend who signs up using your referral code',
      timestamp: '2 days ago',
      date: 'Oct 2',
      read: true,
      icon: 'gift'
    },
    {
      id: '11',
      type: 'transaction',
      title: 'Data Purchase',
      message: 'You purchased 2GB MTN data bundle for 08012345678',
      timestamp: '2 days ago',
      date: 'Oct 2',
      read: true,
      icon: 'success',
      amount: '-₦1,000'
    },
    {
      id: '12',
      type: 'system',
      title: 'App Update Available',
      message: 'Version 2.1.0 is now available with new features and performance improvements',
      timestamp: '3 days ago',
      date: 'Oct 1',
      read: true,
      icon: 'info'
    }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'success':
        return <TickCircle size={24} color={colors.primary} variant="Bold" />;
      case 'failed':
        return <CloseCircle size={24} color="#FF3B30" variant="Bold" />;
      case 'info':
        return <InfoCircle size={24} color="#007AFF" variant="Bold" />;
      case 'gift':
        return <Gift size={24} color="#FF9500" variant="Bold" />;
      case 'sent':
        return <ArrowUp size={24} color="#FF3B30" variant="Bold" />;
      case 'received':
        return <ArrowDown size={24} color="#34C759" variant="Bold" />;
      case 'document':
        return <DocumentText size={24} color={colors.primary} variant="Bold" />;
      case 'security':
        return <SecurityUser size={24} color="#FF9500" variant="Bold" />;
      default:
        return <NotificationIcon size={24} color={colors.primary} variant="Bold" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return colors.primary;
      case 'security':
        return '#FF9500';
      case 'promotional':
        return '#34C759';
      case 'system':
        return '#007AFF';
      default:
        return colors.primary;
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : activeFilter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.read);

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read', count: readCount },
  ];

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.actionable) {
      if (notification.type === 'security') {
        // Navigate to security settings - close modal first, then navigate to App tabs
        navigation.goBack(); // Close the notifications modal
        setTimeout(() => {
          navigation.navigate('App', { screen: 'Settings' });
        }, 300);
      } else if (notification.type === 'system' && notification.title.includes('Verification')) {
        // Navigate to verification screen
        navigation.goBack(); // Close the notifications modal
        setTimeout(() => {
          navigation.navigate('AccountVerification');
        }, 300);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadText}>
                {unreadCount} unread
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key as any)}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.filterTabActive
              ]}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.filterTabTextActive
              ]}>
                {filter.label}
              </Text>
              <View style={[
                styles.filterBadge,
                activeFilter === filter.key && styles.filterBadgeActive
              ]}>
                <Text style={[
                  styles.filterBadgeText,
                  activeFilter === filter.key && styles.filterBadgeTextActive
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {Object.keys(groupedNotifications).length === 0 ? (
          <View style={styles.emptyState}>
            <NotificationIcon size={64} color={colors.gray + '40'} variant="Bulk" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        ) : (
          Object.entries(groupedNotifications).map(([date, notifs]) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{date}</Text>
              {notifs.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.notificationUnread
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: getTypeColor(notification.type) + '15' }
                  ]}>
                    {getIcon(notification.icon)}
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.notificationTitleUnread
                      ]}>
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>

                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>

                    <View style={styles.notificationFooter}>
                      <Text style={styles.timestamp}>{notification.timestamp}</Text>
                      {notification.amount && (
                        <Text style={[
                          styles.amount,
                          notification.amount.startsWith('+') && styles.amountPositive,
                          notification.amount.startsWith('-') && styles.amountNegative
                        ]}>
                          {notification.amount}
                        </Text>
                      )}
                      {notification.actionable && (
                        <View style={styles.actionBadge}>
                          <Text style={styles.actionBadgeText}>Action required</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={styles.deleteButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Trash size={18} color={colors.gray} variant="Outline" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '20',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fontConfig.heading,
  },
  unreadText: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '20',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 6,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray + '20',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeActive: {
    backgroundColor: colors.white + '30',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  filterBadgeTextActive: {
    color: colors.white,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    letterSpacing: 0.5,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '10',
  },
  notificationUnread: {
    backgroundColor: colors.primary + '05',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray,
    marginRight: 12,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 12,
  },
  amountPositive: {
    color: '#34C759',
  },
  amountNegative: {
    color: '#FF3B30',
  },
  actionBadge: {
    backgroundColor: '#FF9500' + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: fontConfig.heading,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
