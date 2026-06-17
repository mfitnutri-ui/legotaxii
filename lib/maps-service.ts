import { useState, useEffect, useCallback } from 'react';

export interface MapLocation {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

export interface MapRoute {
  distance: number; // in meters
  duration: number; // in seconds
  polyline: Array<[number, number]>;
}

class MapsService {
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private routingUrl = 'https://router.project-osrm.org/route/v1';

  /**
   * Search for a location by address using Nominatim
   */
  async searchLocation(query: string): Promise<MapLocation[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();

      return data.map((result: any) => ({
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        title: result.display_name,
        description: result.type,
      }));
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  }

  /**
   * Get address from coordinates using Nominatim
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data.address?.road || data.display_name || null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Get route between two points using OSRM
   */
  async getRoute(
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number
  ): Promise<MapRoute | null> {
    try {
      const response = await fetch(
        `${this.routingUrl}/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [
          coord[1], // latitude
          coord[0], // longitude
        ]);

        return {
          distance: route.distance,
          duration: route.duration,
          polyline: coordinates,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  /**
   * Calculate estimated fare based on distance
   */
  calculateFare(distanceKm: number, serviceType: 'eco' | 'comfort' = 'eco'): number {
    const baseFare = serviceType === 'eco' ? 2.5 : 3.5;
    const perKmRate = serviceType === 'eco' ? 1.2 : 1.8;
    const fare = baseFare + distanceKm * perKmRate;
    return Math.round(fare * 100) / 100; // Round to 2 decimals
  }

  /**
   * Calculate estimated time based on duration
   */
  calculateETA(durationSeconds: number): string {
    const minutes = Math.ceil(durationSeconds / 60);
    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

export const mapsService = new MapsService();

// Hook for searching locations
export function useLocationSearch(query: string) {
  const [results, setResults] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const locations = await mapsService.searchLocation(query);
        setResults(locations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchLocations, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error };
}

// Hook for getting route
export function useRoute(
  startLat: number | null,
  startLon: number | null,
  endLat: number | null,
  endLon: number | null
) {
  const [route, setRoute] = useState<MapRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startLat || !startLon || !endLat || !endLon) {
      setRoute(null);
      return;
    }

    const getRoute = async () => {
      setLoading(true);
      setError(null);
      try {
        const routeData = await mapsService.getRoute(startLat, startLon, endLat, endLon);
        setRoute(routeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Route calculation failed');
      } finally {
        setLoading(false);
      }
    };

    getRoute();
  }, [startLat, startLon, endLat, endLon]);

  return { route, loading, error };
}

// Hook for reverse geocoding
export function useReverseGeocode(latitude: number | null, longitude: number | null) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) {
      setAddress(null);
      return;
    }

    const geocode = async () => {
      setLoading(true);
      try {
        const result = await mapsService.reverseGeocode(latitude, longitude);
        setAddress(result);
      } finally {
        setLoading(false);
      }
    };

    geocode();
  }, [latitude, longitude]);

  return { address, loading };
}
