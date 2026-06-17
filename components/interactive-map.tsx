import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocationTracking } from '@/lib/location-service';
import { mapsService } from '@/lib/maps-service';

interface InteractiveMapProps {
  onLocationSelect?: (latitude: number, longitude: number) => void;
  showUserLocation?: boolean;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
  }>;
  selectedLocation?: { latitude: number; longitude: number } | null;
}

export function InteractiveMap({
  onLocationSelect,
  showUserLocation = true,
  markers = [],
  selectedLocation,
}: InteractiveMapProps) {
  const { location: userLocation } = useLocationTracking();
  const [zoomLevel, setZoomLevel] = useState(15);
  const [center, setCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  useEffect(() => {
    if (userLocation) {
      setCenter({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  }, [userLocation]);

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 1, 1));
  };

  const handleMapTypeToggle = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenter({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  };

  const getMapUrl = () => {
    if (!center) return '';

    const baseUrl = 'https://tile.openstreetmap.org';
    const layer = mapType === 'satellite' ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile' : baseUrl;

    // This is a simplified representation - in production, use a proper map library
    return `${baseUrl}/{z}/{x}/{y}.png`;
  };

  return (
    <View className="flex-1 bg-surface rounded-2xl overflow-hidden relative">
      {/* Map Container */}
      <View className="flex-1 bg-gradient-to-br from-primary to-primary opacity-20 items-center justify-center">
        {center ? (
          <>
            {/* Map Placeholder */}
            <View className="absolute inset-0 bg-surface opacity-50" />

            {/* User Location Marker */}
            {showUserLocation && userLocation && (
              <View className="absolute items-center">
                <View className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                <View className="w-8 h-8 border-2 border-primary rounded-full absolute opacity-50" />
              </View>
            )}

            {/* Custom Markers */}
            {markers.map((marker) => (
              <TouchableOpacity
                key={marker.id}
                onPress={() => onLocationSelect?.(marker.latitude, marker.longitude)}
                className="absolute items-center"
              >
                <View className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg items-center justify-center">
                  <MaterialIcons name="location-on" size={14} color="white" />
                </View>
              </TouchableOpacity>
            ))}

            {/* Selected Location Marker */}
            {selectedLocation && (
              <View className="absolute items-center">
                <View className="w-6 h-6 bg-success rounded-full border-2 border-white shadow-lg items-center justify-center">
                  <MaterialIcons name="check" size={14} color="white" />
                </View>
              </View>
            )}

            {/* Zoom Level Indicator */}
            <View className="absolute bottom-4 left-4 bg-white bg-opacity-80 rounded-lg px-3 py-1">
              <Text className="text-foreground font-semibold text-sm">Zoom: {zoomLevel}</Text>
            </View>

            {/* Map Type Indicator */}
            <View className="absolute top-4 left-4 bg-white bg-opacity-80 rounded-lg px-3 py-1">
              <Text className="text-foreground font-semibold text-sm">
                {mapType === 'standard' ? '🗺️ Mapa' : '🛰️ Satélite'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <MaterialIcons name="location-on" size={48} color="#FF6B35" />
            <Text className="text-foreground font-semibold mt-2">Carregando mapa...</Text>
          </>
        )}
      </View>

      {/* Controls */}
      <View className="absolute right-4 bottom-4 gap-2">
        {/* Zoom In */}
        <TouchableOpacity
          onPress={handleZoomIn}
          className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center active:opacity-80"
        >
          <MaterialIcons name="add" size={24} color="#FF6B35" />
        </TouchableOpacity>

        {/* Zoom Out */}
        <TouchableOpacity
          onPress={handleZoomOut}
          className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center active:opacity-80"
        >
          <MaterialIcons name="remove" size={24} color="#FF6B35" />
        </TouchableOpacity>

        {/* Center on User */}
        <TouchableOpacity
          onPress={handleCenterOnUser}
          className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center active:opacity-80"
        >
          <MaterialIcons name="my-location" size={24} color="#FF6B35" />
        </TouchableOpacity>

        {/* Map Type Toggle */}
        <TouchableOpacity
          onPress={handleMapTypeToggle}
          className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center active:opacity-80"
        >
          <MaterialIcons name={mapType === 'standard' ? 'satellite' : 'map'} size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Attribution */}
      <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-2 py-1">
        <Text className="text-white text-xs">
          © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}
