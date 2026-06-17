import * as Location from 'expo-location';
import { useEffect, useState, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  heading: number;
  speed: number;
}

export interface LocationSubscription {
  remove: () => void;
}

class LocationService {
  private subscription: LocationSubscription | null = null;
  private listeners: ((location: LocationData) => void)[] = [];

  async requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        altitude: location.coords.altitude || 0,
        heading: location.coords.heading || 0,
        speed: location.coords.speed || 0,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  startTracking(callback: (location: LocationData) => void) {
    this.listeners.push(callback);

    if (!this.subscription) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            altitude: location.coords.altitude || 0,
            heading: location.coords.heading || 0,
            speed: location.coords.speed || 0,
          };
          this.listeners.forEach((listener) => listener(locationData));
        }
      ).then((subscription) => {
        this.subscription = subscription;
      });
    }
  }

  stopTracking(callback?: (location: LocationData) => void) {
    if (callback) {
      this.listeners = this.listeners.filter((l) => l !== callback);
    } else {
      this.listeners = [];
    }

    if (this.listeners.length === 0 && this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  async getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<number> {
    try {
      const distance = await Location.getDistance(
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 }
      );
      return distance;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }

  async geocodeAddress(address: string) {
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  async reverseGeocode(latitude: number, longitude: number) {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
}

export const locationService = new LocationService();

// Hook for using location tracking in components
export function useLocationTracking() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startTracking = async () => {
      const hasPermission = await locationService.requestPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return;
      }

      const currentLocation = await locationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
      }

      locationService.startTracking((newLocation) => {
        setLocation(newLocation);
      });
    };

    startTracking();

    return () => {
      locationService.stopTracking();
    };
  }, []);

  return { location, error };
}

// Hook for getting current location once
export function useCurrentLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const hasPermission = await locationService.requestPermission();
        if (!hasPermission) {
          setError('Location permission denied');
          return;
        }

        const currentLocation = await locationService.getCurrentLocation();
        setLocation(currentLocation);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
}
