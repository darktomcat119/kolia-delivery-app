import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type * as NotificationsType from 'expo-notifications';

// Detect if running in Expo Go — must be checked before any expo-notifications import
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Only set notification handler in real builds
if (!isExpoGo) {
  import('expo-notifications').then((Notifications) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (isExpoGo) return null;

  const [Notifications, Device, { api }] = await Promise.all([
    import('expo-notifications'),
    import('expo-device'),
    import('../lib/api'),
  ]);

  if (!Device.isDevice) return null;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('orders', {
        name: 'Order Updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E07A2F',
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: undefined,
    });

    const token = tokenData.data;

    try {
      await api.post('/api/notifications/register', { token });
    } catch {
      // non-critical
    }

    return token;
  } catch {
    return null;
  }
}

export async function getNotificationPermissionStatus(): Promise<boolean> {
  if (isExpoGo) return false;
  try {
    const Notifications = await import('expo-notifications');
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export function addNotificationResponseListener(
  handler: (response: NotificationsType.NotificationResponse) => void,
): NotificationsType.Subscription {
  if (isExpoGo) {
    return { remove: () => {} } as NotificationsType.Subscription;
  }
  // Dynamic import — fire and return a cancellable ref
  let sub: NotificationsType.Subscription | null = null;
  import('expo-notifications').then((Notifications) => {
    sub = Notifications.addNotificationResponseReceivedListener(handler);
  });
  return { remove: () => sub?.remove() } as NotificationsType.Subscription;
}
