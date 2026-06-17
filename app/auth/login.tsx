import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setError('');
      await signIn(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation will be handled by auth context
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 justify-center">
            {/* Header */}
            <View className="mb-8">
              <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <Text className="text-primary text-lg font-semibold">← Voltar</Text>
              </TouchableOpacity>

              <Text className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo{role === 'driver' ? ' Motorista' : ' Passageiro'}
              </Text>
              <Text className="text-muted text-base">
                Faça login para continuar
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-error bg-opacity-10 border border-error rounded-lg p-4 mb-6">
                <Text className="text-error font-semibold">{error}</Text>
              </View>
            )}

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-foreground font-semibold mb-2">Email</Text>
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-foreground font-semibold mb-2">Senha</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-lg">
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  className="flex-1 px-4 py-3 text-foreground"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="pr-4"
                >
                  <Text className="text-primary font-semibold text-sm">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="mb-8">
              <Text className="text-primary font-semibold">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-primary rounded-full py-4 px-6 active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
            >
              <Text className="text-center text-white font-semibold text-lg">
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-muted">ou</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Phone Login */}
            <TouchableOpacity
              onPress={() => router.push(`/auth/phone-login?role=${role}`)}
              className="border border-border rounded-full py-4 px-6 active:opacity-80"
            >
              <Text className="text-center text-foreground font-semibold text-lg">
                Entrar com Telefone
              </Text>
            </TouchableOpacity>

            {/* Sign Up */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-muted">Não tem conta? </Text>
              <TouchableOpacity onPress={() => router.push(`/auth/signup?role=${role}`)}>
                <Text className="text-primary font-semibold">Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
