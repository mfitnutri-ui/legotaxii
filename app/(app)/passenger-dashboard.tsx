import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Modal, TextInput } from 'react-native';
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

export default function PassengerDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [destination, setDestination] = useState('');
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [rideActive, setRideActive] = useState(false);
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

  const handleRequestRide = () => {
    if (!destination.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setShowRideRequest(false);
    setRideActive(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
            <Text className="text-foreground font-semibold mt-2">Mapa Interativo</Text>
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
            <Text className="text-foreground font-bold text-lg">LegoTaxi</Text>
            <Text className="text-muted text-xs">Bem-vindo, {user?.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <Text className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet - Fixed */}
        <View className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl border-t border-border p-4 shadow-lg">
          {/* Drag Handle */}
          <View className="w-12 h-1 bg-border rounded-full self-center mb-4" />

          {!rideActive ? (
            <>
              {/* Request Ride Button */}
              <TouchableOpacity
                onPress={() => setShowRideRequest(true)}
                className="bg-primary rounded-full py-4 px-6 active:opacity-80 mb-4"
              >
                <Text className="text-center text-white font-bold text-lg">
                  Pedir Viagem
                </Text>
              </TouchableOpacity>

              {/* Quick Stats */}
              <View className="flex-row gap-2 mb-4">
                <View className="flex-1 bg-background rounded-lg p-3 items-center">
                  <Text className="text-muted text-xs">Viagens</Text>
                  <Text className="text-foreground font-bold text-lg">12</Text>
                </View>
                <View className="flex-1 bg-background rounded-lg p-3 items-center">
                  <Text className="text-muted text-xs">Rating</Text>
                  <Text className="text-foreground font-bold text-lg">4.8 ⭐</Text>
                </View>
                <View className="flex-1 bg-background rounded-lg p-3 items-center">
                  <Text className="text-muted text-xs">Economizado</Text>
                  <Text className="text-foreground font-bold text-lg">€45</Text>
                </View>
              </View>

              {/* Menu Buttons */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => router.push('/favorites')}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="flex-1 bg-background rounded-lg py-3 items-center"
                >
                  <MaterialIcons name="favorite" size={20} color="#FF6B35" />
                  <Text className="text-foreground text-xs font-semibold mt-1">Favoritos</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/history')}
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
              {/* Ride Active */}
              <View className="bg-success bg-opacity-10 border border-success rounded-lg p-4 mb-4">
                <Text className="text-success font-bold mb-2">Procurando motorista...</Text>
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <Text className="text-foreground text-sm">ETA: 3-5 minutos</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setRideActive(false)}
                className="bg-error rounded-full py-3 px-6 active:opacity-80"
              >
                <Text className="text-center text-white font-semibold">Cancelar Viagem</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Request Ride Modal */}
      <Modal
        visible={showRideRequest}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRideRequest(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-background rounded-t-3xl p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-foreground font-bold text-xl">Solicitar Viagem</Text>
              <TouchableOpacity onPress={() => setShowRideRequest(false)}>
                <MaterialIcons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Pickup Location */}
            <View className="mb-4">
              <Text className="text-foreground font-semibold mb-2">Saindo de</Text>
              <View className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center">
                <MaterialIcons name="location-on" size={20} color="#FF6B35" />
                <Text className="text-foreground ml-2 flex-1">Localização Atual</Text>
              </View>
            </View>

            {/* Destination */}
            <View className="mb-6">
              <Text className="text-foreground font-semibold mb-2">Destino</Text>
              <TextInput
                placeholder="Para onde?"
                placeholderTextColor="#999"
                value={destination}
                onChangeText={setDestination}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Service Type */}
            <View className="mb-6">
              <Text className="text-foreground font-semibold mb-3">Tipo de Serviço</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity className="flex-1 bg-primary rounded-lg py-3 items-center">
                  <Text className="text-white font-semibold">Eco</Text>
                  <Text className="text-white text-xs">€5.50</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-surface border border-border rounded-lg py-3 items-center">
                  <Text className="text-foreground font-semibold">Confort</Text>
                  <Text className="text-muted text-xs">€7.50</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handleRequestRide}
              className="bg-primary rounded-full py-4 px-6 active:opacity-80"
            >
              <Text className="text-center text-white font-bold text-lg">Confirmar Viagem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
