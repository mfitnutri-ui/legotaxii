import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function RideRatingScreen() {
  const router = useRouter();
  const { rideId, driverName, fare } = useLocalSearchParams<{
    rideId: string;
    driverName: string;
    fare: string;
  }>();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (value: number) => {
    setRating(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmitRating = async () => {
    setSubmitting(true);
    try {
      // Submit rating to backend
      // await submitRating(rideId, rating, review);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/passenger-dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingText = (value: number): string => {
    switch (value) {
      case 1:
        return 'Péssimo';
      case 2:
        return 'Ruim';
      case 3:
        return 'Aceitável';
      case 4:
        return 'Bom';
      case 5:
        return 'Excelente';
      default:
        return '';
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Como foi a viagem?
            </Text>
            <Text className="text-muted">
              Avalie {driverName}
            </Text>
          </View>

          {/* Driver Info */}
          <View className="bg-surface rounded-lg p-4 mb-8 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold text-lg">
                {driverName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">{driverName}</Text>
              <Text className="text-muted text-sm">Motorista</Text>
            </View>
            <View className="items-center">
              <Text className="text-foreground font-bold">€{fare}</Text>
              <Text className="text-muted text-xs">Tarifa</Text>
            </View>
          </View>

          {/* Star Rating */}
          <View className="mb-8">
            <Text className="text-foreground font-semibold mb-4 text-center">
              {getRatingText(rating)}
            </Text>
            <View className="flex-row justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingChange(star)}
                  className="active:scale-110"
                >
                  <MaterialIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={48}
                    color={star <= rating ? '#F59E0B' : '#999'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Review Input */}
          <View className="mb-8">
            <Text className="text-foreground font-semibold mb-2">
              Deixe um comentário (opcional)
            </Text>
            <TextInput
              placeholder="Compartilhe sua experiência..."
              placeholderTextColor="#999"
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!submitting}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-base"
              textAlignVertical="top"
            />
            <Text className="text-muted text-xs mt-2">
              {review.length}/500
            </Text>
          </View>

          {/* Rating Benefits */}
          <View className="bg-success bg-opacity-10 border border-success rounded-lg p-4 mb-8">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="check-circle" size={20} color="#22C55E" />
              <Text className="text-success font-semibold">Sua avaliação ajuda!</Text>
            </View>
            <Text className="text-success text-sm">
              Avaliações honestas ajudam motoristas a melhorar e passageiros a escolher as melhores viagens.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitRating}
            disabled={submitting}
            className={`bg-primary rounded-full py-4 px-6 active:opacity-80 ${
              submitting ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-center text-white font-bold text-lg">
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={() => router.replace('/passenger-dashboard')}
            disabled={submitting}
            className="mt-4"
          >
            <Text className="text-center text-primary font-semibold">
              Pular por agora
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
