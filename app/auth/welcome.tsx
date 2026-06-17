import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'bottom', 'left', 'right']}>
      <LinearGradient
        colors={['#FF6B35', '#FF8C42']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center items-center px-6"
      >
        {/* Logo */}
        <View className="mb-8">
          <Image
            source={require('@/assets/images/icon.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-white text-center mb-2">
          LegoTaxi
        </Text>
        <Text className="text-lg text-white text-center mb-12 opacity-90">
          Sua viagem, sua forma
        </Text>

        {/* Description */}
        <View className="bg-white bg-opacity-10 rounded-2xl p-6 mb-12">
          <Text className="text-white text-center text-base leading-relaxed">
            Conectando motoristas e passageiros com segurança, conforto e tecnologia
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full gap-4">
          {/* Passenger Button */}
          <TouchableOpacity
            onPress={() => router.push('/auth/login?role=passenger')}
            className="bg-white rounded-full py-4 px-6 active:opacity-80"
          >
            <Text className="text-center text-lg font-semibold text-primary">
              Sou Passageiro
            </Text>
          </TouchableOpacity>

          {/* Driver Button */}
          <TouchableOpacity
            onPress={() => router.push('/auth/login?role=driver')}
            className="border-2 border-white rounded-full py-4 px-6 active:opacity-80"
          >
            <Text className="text-center text-lg font-semibold text-white">
              Sou Motorista
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-12 flex-row justify-center gap-2">
          <Text className="text-white text-sm opacity-75">
            Ao continuar, você concorda com nossos
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="text-white text-sm font-semibold underline mt-1">
            Termos de Serviço e Política de Privacidade
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScreenContainer>
  );
}
