import { useEffect, useState, useCallback } from 'react';

export type MessageType =
  | 'driver_location_update'
  | 'ride_request'
  | 'ride_accepted'
  | 'ride_started'
  | 'ride_completed'
  | 'chat_message'
  | 'driver_arriving'
  | 'driver_cancelled';

export interface WebSocketMessage {
  type: MessageType;
  data: any;
  timestamp: number;
}

export interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  pickupLocation: string;
  pickupCoords: { latitude: number; longitude: number };
  destination: string;
  destinationCoords: { latitude: number; longitude: number };
  fare: number;
  distance: number;
  duration: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = '';
  private listeners: Map<MessageType, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private token: string | null = null;

  connect(url: string, userId: string, token: string) {
    this.url = url;
    this.userId = userId;
    this.token = token;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;

        // Send auth message
        this.send({
          type: 'auth',
          userId,
          token,
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      this.reconnectTimer = setTimeout(() => {
        if (this.userId && this.token) {
          this.connect(this.url, this.userId, this.token);
        }
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((listener) => listener(message.data));
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe(type: MessageType, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  sendLocationUpdate(latitude: number, longitude: number, heading: number, speed: number) {
    this.send({
      type: 'location_update',
      data: {
        latitude,
        longitude,
        heading,
        speed,
      },
    });
  }

  sendChatMessage(rideId: string, message: string) {
    this.send({
      type: 'chat_message',
      data: {
        rideId,
        message,
      },
    });
  }

  acceptRide(rideId: string) {
    this.send({
      type: 'ride_accepted',
      data: {
        rideId,
      },
    });
  }

  rejectRide(rideId: string) {
    this.send({
      type: 'ride_rejected',
      data: {
        rideId,
      },
    });
  }

  startRide(rideId: string) {
    this.send({
      type: 'ride_started',
      data: {
        rideId,
      },
    });
  }

  completeRide(rideId: string, rating: number, review?: string) {
    this.send({
      type: 'ride_completed',
      data: {
        rideId,
        rating,
        review,
      },
    });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const webSocketService = new WebSocketService();

// Hook for using WebSocket
export function useWebSocket(userId: string, token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000/ws';

    const handleConnect = () => {
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    webSocketService.connect(url, userId, token);

    return () => {
      webSocketService.disconnect();
    };
  }, [userId, token]);

  return { isConnected, error };
}

// Hook for subscribing to specific message types
export function useWebSocketMessage<T = any>(
  messageType: MessageType,
  callback: (data: T) => void
) {
  useEffect(() => {
    const unsubscribe = webSocketService.subscribe(messageType, callback);
    return unsubscribe;
  }, [messageType, callback]);
}

// Hook for driver location updates
export function useDriverLocationUpdates(callback: (location: LocationUpdate) => void) {
  useWebSocketMessage<LocationUpdate>('driver_location_update', callback);
}

// Hook for chat messages
export function useChatMessages(callback: (message: ChatMessage) => void) {
  useWebSocketMessage<ChatMessage>('chat_message', callback);
}

// Hook for ride requests
export function useRideRequests(callback: (ride: RideRequest) => void) {
  useWebSocketMessage<RideRequest>('ride_request', callback);
}
