import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { activeNotifications, hideNotification } = useNotifications();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {activeNotifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={() => hideNotification(notification.id)}
          index={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
});

export default NotificationContainer;
