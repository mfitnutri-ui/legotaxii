import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import * as Haptics from 'expo-haptics';

export default function SignupScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { signUp, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!agreeTerms) {
      setError('Você deve aceitar os termos de serviço');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setError('');
      await signUp(email, password, name, (role as 'driver' | 'passenger') || 'passenger');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation will be handled by auth context
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
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
                Criar Conta
              </Text>
              <Text className="text-muted text-base">
                Como {role === 'driver' ? 'Motorista' : 'Passageiro'}
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-error bg-opacity-10 border border-error rounded-lg p-4 mb-6">
                <Text className="text-error font-semibold">{error}</Text>
              </View>
            )}

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-foreground font-semibold mb-2">Nome Completo</Text>
              <TextInput
                placeholder="João Silva"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

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
            <View className="mb-4">
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

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-foreground font-semibold mb-2">Confirmar Senha</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-lg">
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                  className="flex-1 px-4 py-3 text-foreground"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="pr-4"
                >
                  <Text className="text-primary font-semibold text-sm">
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              onPress={() => setAgreeTerms(!agreeTerms)}
              className="flex-row items-center mb-8"
            >
              <View className={`w-6 h-6 rounded border-2 ${agreeTerms ? 'bg-primary border-primary' : 'border-border'} mr-3 items-center justify-center`}>
                {agreeTerms && <Text className="text-white font-bold">✓</Text>}
              </View>
              <Text className="text-muted flex-1">
                Concordo com os Termos de Serviço e Política de Privacidade
              </Text>
            </TouchableOpacity>

            {/* Signup Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className={`bg-primary rounded-full py-4 px-6 active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
            >
              <Text className="text-center text-white font-semibold text-lg">
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-muted">Já tem conta? </Text>
              <TouchableOpacity onPress={() => router.push(`/auth/login?role=${role}`)}>
                <Text className="text-primary font-semibold">Fazer login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
