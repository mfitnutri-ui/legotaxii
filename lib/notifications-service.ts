import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface RideNotification extends NotificationData {
  type: 'ride_request' | 'ride_accepted' | 'driver_arriving' | 'ride_completed';
  rideId: string;
  passengerName?: string;
  driverName?: string;
  fare?: number;
}

class NotificationsService {
  private expoPushToken: string | null = null;

  async initialize() {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices');
      return;
    }

    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }

      // Get Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      this.expoPushToken = token.data;
      console.log('Expo push token:', this.expoPushToken);

      // Setup notification listeners
      this.setupListeners();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private setupListeners() {
    // Handle notification received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    // Handle notification tapped
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        // Handle navigation based on notification data
      }
    );
  }

  private notificationListener: any;
  private responseListener: any;

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  async sendLocalNotification(notification: NotificationData) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  async sendRideNotification(notification: RideNotification) {
    try {
      // Play custom sound for ride requests
      if (notification.type === 'ride_request') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: {
              type: notification.type,
              rideId: notification.rideId,
              ...notification.data,
            },
            sound: 'notification.wav', // Custom sound
            badge: 1,
          },
          trigger: null,
        });
      } else {
        await this.sendLocalNotification(notification);
      }
    } catch (error) {
      console.error('Error sending ride notification:', error);
    }
  }

  async scheduleNotification(
    notification: NotificationData,
    delaySeconds: number
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          badge: 1,
        },
        trigger: {
          seconds: delaySeconds,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export const notificationsService = new NotificationsService();

// Hook for using notifications
export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      await notificationsService.initialize();
      setExpoPushToken(notificationsService.getExpoPushToken());
    };

    initialize();

    return () => {
      notificationsService.cleanup();
    };
  }, []);

  return { expoPushToken, notification };
}
