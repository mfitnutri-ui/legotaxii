import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface RideRequest {
  id: string;
  passengerName: string;
  pickupLocation: string;
  destination: string;
  fare: number;
  rating: number;
}

export default function DriverDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    {
      id: '1',
      passengerName: 'Maria Silva',
      pickupLocation: 'Av. Paulista, 1000',
      destination: 'Rua Augusta, 500',
      fare: 12.50,
      rating: 4.9,
    },
    {
      id: '2',
      passengerName: 'João Santos',
      pickupLocation: 'Estação Central',
      destination: 'Aeroporto',
      fare: 25.00,
      rating: 4.7,
    },
  ]);
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error requesting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    Haptics.notificationAsync(
      isOnline
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );
  };

  const handleAcceptRide = (ride: RideRequest) => {
    setActiveRide(ride);
    setSelectedRide(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRejectRide = () => {
    setSelectedRide(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/welcome');
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        {/* Map Area - Full Screen */}
        <View className="flex-1 bg-surface border border-border rounded-2xl overflow-hidden mb-4">
          <View className="flex-1 bg-gradient-to-br from-primary to-primary opacity-20 items-center justify-center">
            <MaterialIcons name="location-on" size={48} color="#FF6B35" />
            <Text className="text-foreground font-semibold mt-2">Mapa em Tempo Real</Text>
            {currentLocation && (
              <Text className="text-muted text-sm mt-1">
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        {/* Top Bar - Fixed */}
        <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 pt-2 bg-background bg-opacity-95">
          <View>
            <Text className="text-foreground font-bold text-lg">LegoTaxi Driver</Text>
            <Text className="text-muted text-xs">{user?.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <Text className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Status Bar - Fixed */}
        <View className="absolute top-14 left-4 right-4 bg-surface rounded-lg border border-border p-3 flex-row justify-between items-center">
          <View>
            <Text className="text-muted text-xs">Status</Text>
            <Text className={`font-bold text-lg ${isOnline ? 'text-success' : 'text-error'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleToggleOnline}
            className={`rounded-full px-4 py-2 ${isOnline ? 'bg-error bg-opacity-20' : 'bg-success bg-opacity-20'}`}
          >
            <Text className={`font-semibold ${isOnline ? 'text-error' : 'text-success'}`}>
              {isOnline ? 'Ir Offline' : 'Ir Online'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet - Fixed */}
        <View className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl border-t border-border p-4 shadow-lg max-h-1/3">
          {/* Drag Handle */}
          <View className="w-12 h-1 bg-border rounded-full self-center mb-4" />

          {!activeRide ? (
            <>
              {/* Earnings Today */}
              <View className="bg-success bg-opacity-10 border border-success rounded-lg p-4 mb-4">
                <Text className="text-muted text-xs">Ganhos Hoje</Text>
                <Text className="text-success font-bold text-2xl">€127.50</Text>
                <Text className="text-muted text-xs mt-1">5 viagens completadas</Text>
              </View>

              {/* Ride Requests Count */}
              {isOnline && rideRequests.length > 0 && (
                <View className="bg-primary bg-opacity-10 border border-primary rounded-lg p-3 mb-4">
                  <Text className="text-primary font-bold">
                    {rideRequests.length} viagens disponíveis
                  </Text>
                </View>
              )}

              {/* Menu Buttons */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => router.push('/driver-stats')}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="flex-1 bg-background rounded-lg py-3 items-center"
                >
                  <MaterialIcons name="bar-chart" size={20} color="#FF6B35" />
                  <Text className="text-foreground text-xs font-semibold mt-1">Estatísticas</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/driver-history')}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="flex-1 bg-background rounded-lg py-3 items-center"
                >
                  <MaterialIcons name="history" size={20} color="#FF6B35" />
                  <Text className="text-foreground text-xs font-semibold mt-1">Histórico</Text>
                </Pressable>
                <Pressable
                  onPress={handleLogout}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="flex-1 bg-background rounded-lg py-3 items-center"
                >
                  <MaterialIcons name="logout" size={20} color="#EF4444" />
                  <Text className="text-error text-xs font-semibold mt-1">Sair</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* Active Ride Info */}
              <View className="bg-primary bg-opacity-10 border border-primary rounded-lg p-4 mb-4">
                <Text className="text-primary font-bold mb-2">{activeRide.passengerName}</Text>
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="location-on" size={16} color="#FF6B35" />
                  <Text className="text-foreground text-sm">{activeRide.pickupLocation}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="flag" size={16} color="#FF6B35" />
                  <Text className="text-foreground text-sm">{activeRide.destination}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setActiveRide(null)}
                className="bg-error rounded-full py-3 px-6 active:opacity-80"
              >
                <Text className="text-center text-white font-semibold">Concluir Viagem</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Ride Request Modal */}
      <Modal
        visible={!!selectedRide}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedRide(null)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-background rounded-t-3xl p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-foreground font-bold text-xl">Nova Viagem</Text>
              <TouchableOpacity onPress={() => setSelectedRide(null)}>
                <MaterialIcons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {selectedRide && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Passenger Info */}
                <View className="bg-surface rounded-lg p-4 mb-4">
                  <View className="flex-row items-center gap-3 mb-4">
                    <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                      <Text className="text-white font-bold text-lg">
                        {selectedRide.passengerName.charAt(0)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold">{selectedRide.passengerName}</Text>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="star" size={14} color="#F59E0B" />
                        <Text className="text-muted text-sm">{selectedRide.rating}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Route */}
                  <View className="border-l-2 border-primary pl-4 ml-2">
                    <View className="mb-3">
                      <Text className="text-muted text-xs">Saindo de</Text>
                      <Text className="text-foreground font-semibold">{selectedRide.pickupLocation}</Text>
                    </View>
                    <View>
                      <Text className="text-muted text-xs">Destino</Text>
                      <Text className="text-foreground font-semibold">{selectedRide.destination}</Text>
                    </View>
                  </View>
                </View>

                {/* Fare */}
                <View className="bg-success bg-opacity-10 border border-success rounded-lg p-4 mb-6">
                  <Text className="text-muted text-xs">Tarifa Estimada</Text>
                  <Text className="text-success font-bold text-2xl">€{selectedRide.fare.toFixed(2)}</Text>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleRejectRide}
                    className="flex-1 bg-error bg-opacity-10 border border-error rounded-full py-3"
                  >
                    <Text className="text-center text-error font-semibold">Rejeitar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAcceptRide(selectedRide)}
                    className="flex-1 bg-success rounded-full py-3"
                  >
                    <Text className="text-center text-white font-semibold">Aceitar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Simulate Ride Request */}
      {isOnline && rideRequests.length > 0 && !selectedRide && !activeRide && (
        <TouchableOpacity
          onPress={() => setSelectedRide(rideRequests[0])}
          className="absolute bottom-64 right-4 bg-primary rounded-full p-4 shadow-lg"
        >
          <MaterialIcons name="notifications-active" size={24} color="white" />
        </TouchableOpacity>
      )}
    </ScreenContainer>
  );
}
