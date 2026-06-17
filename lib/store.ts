import { create } from 'zustand';
import { LocationData } from './location-service';

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  pickupLocation: string;
  pickupCoords: { latitude: number; longitude: number };
  destination: string;
  destinationCoords: { latitude: number; longitude: number };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
    color: string;
  };
  rating: number;
  totalRides: number;
  isOnline: boolean;
  currentLocation?: LocationData;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  totalRides: number;
  favoriteLocations: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

interface AppStore {
  // User state
  currentUser: (Driver | Passenger) | null;
  userType: 'driver' | 'passenger' | null;
  setCurrentUser: (user: (Driver | Passenger) | null, type: 'driver' | 'passenger' | null) => void;

  // Location state
  currentLocation: LocationData | null;
  setCurrentLocation: (location: LocationData) => void;

  // Ride state
  activeRide: Ride | null;
  rideHistory: Ride[];
  setActiveRide: (ride: Ride | null) => void;
  addRideToHistory: (ride: Ride) => void;

  // Driver state
  isOnline: boolean;
  availableRides: Ride[];
  setIsOnline: (online: boolean) => void;
  setAvailableRides: (rides: Ride[]) => void;

  // UI state
  selectedDestination: { latitude: number; longitude: number; address: string } | null;
  setSelectedDestination: (destination: { latitude: number; longitude: number; address: string } | null) => void;

  // Clear all state
  clearStore: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // User state
  currentUser: null,
  userType: null,
  setCurrentUser: (user, type) => set({ currentUser: user, userType: type }),

  // Location state
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // Ride state
  activeRide: null,
  rideHistory: [],
  setActiveRide: (ride) => set({ activeRide: ride }),
  addRideToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),

  // Driver state
  isOnline: false,
  availableRides: [],
  setIsOnline: (online) => set({ isOnline: online }),
  setAvailableRides: (rides) => set({ availableRides: rides }),

  // UI state
  selectedDestination: null,
  setSelectedDestination: (destination) => set({ selectedDestination: destination }),

  // Clear all state
  clearStore: () =>
    set({
      currentUser: null,
      userType: null,
      currentLocation: null,
      activeRide: null,
      rideHistory: [],
      isOnline: false,
      availableRides: [],
      selectedDestination: null,
    }),
}));

// Selectors for better performance
export const useCurrentUser = () => useAppStore((state) => state.currentUser);
export const useUserType = () => useAppStore((state) => state.userType);
export const useCurrentLocation = () => useAppStore((state) => state.currentLocation);
export const useActiveRide = () => useAppStore((state) => state.activeRide);
export const useIsOnline = () => useAppStore((state) => state.isOnline);
export const useAvailableRides = () => useAppStore((state) => state.availableRides);
export const useSelectedDestination = () => useAppStore((state) => state.selectedDestination);
