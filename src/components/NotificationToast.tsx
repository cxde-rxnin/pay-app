import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import colors from '../theme/colors';
import { fontConfig } from '../theme/fonts';
import {
  TickCircle,
  CloseCircle,
  InfoCircle,
  Warning2,
  ArrowDown,
  CloseSquare
} from 'iconsax-react-nativejs';
import { InAppNotification, NotificationType } from '../contexts/NotificationContext';

const { width } = Dimensions.get('window');

interface NotificationToastProps {
  notification: InAppNotification;
  onDismiss: () => void;
  index: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss, index }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const gestureTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      onDismiss();
      if (notification.onClose) {
        notification.onClose();
      }
    });
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      // Swipe up to dismiss
      if (event.nativeEvent.translationY < -50) {
        handleDismiss();
      } else {
        // Bounce back
        Animated.spring(gestureTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: gestureTranslateY } }],
    { useNativeDriver: true }
  );

  const getIconAndColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          icon: <TickCircle size={24} color="#34C759" variant="Bold" />,
          backgroundColor: '#34C759',
          borderColor: '#34C759',
        };
      case 'error':
        return {
          icon: <CloseCircle size={24} color="#FF3B30" variant="Bold" />,
          backgroundColor: '#FF3B30',
          borderColor: '#FF3B30',
        };
      case 'warning':
        return {
          icon: <Warning2 size={24} color="#FF9500" variant="Bold" />,
          backgroundColor: '#FF9500',
          borderColor: '#FF9500',
        };
      case 'info':
        return {
          icon: <InfoCircle size={24} color="#007AFF" variant="Bold" />,
          backgroundColor: '#007AFF',
          borderColor: '#007AFF',
        };
      case 'transaction':
        return {
          icon: <ArrowDown size={24} color={colors.primary} variant="Bold" />,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
      default:
        return {
          icon: <InfoCircle size={24} color={colors.primary} variant="Bold" />,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
    }
  };

  const { icon, backgroundColor, borderColor } = getIconAndColor(notification.type);

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetY={[-10, 10]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateY: Animated.add(translateY, gestureTranslateY) }
            ],
            opacity,
            top: 60 + (index * 90), // Stack notifications
          }
        ]}
      >
        {/* Swipe Indicator */}
        <View style={styles.swipeIndicator} />

        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: backgroundColor + '15' }]}>
            {notification.icon || icon}
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {notification.message}
            </Text>
            {notification.action && (
              <TouchableOpacity
                onPress={() => {
                  notification.action?.onPress();
                  handleDismiss();
                }}
                style={styles.actionButton}
              >
                <Text style={[styles.actionText, { color: backgroundColor }]}>
                  {notification.action.label}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <CloseSquare size={20} color={colors.gray} variant="Outline" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  swipeIndicator: {
    width: 32,
    height: 4,
    backgroundColor: colors.gray + '30',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: fontConfig.heading,
  },
  message: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 18,
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default NotificationToast;
