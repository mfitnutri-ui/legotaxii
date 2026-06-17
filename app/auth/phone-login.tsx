import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import * as Haptics from 'expo-haptics';

export default function PhoneLoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { signUpWithPhone, isLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleRequestOTP = async () => {
    if (!phone || !name) {
      setError('Por favor, preencha todos os campos');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setError('Telefone inválido');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setError('');
      await signUpWithPhone(cleanedPhone, name, (role as 'driver' | 'passenger') || 'passenger');
      setStep('otp');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar OTP');
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
                {step === 'info' ? 'Seu Telefone' : 'Verificar Código'}
              </Text>
              <Text className="text-muted text-base">
                {step === 'info' ? 'Usaremos para verificar sua identidade' : 'Enviamos um código para seu telefone'}
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-error bg-opacity-10 border border-error rounded-lg p-4 mb-6">
                <Text className="text-error font-semibold">{error}</Text>
              </View>
            )}

            {step === 'info' ? (
              <>
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

                {/* Phone Input */}
                <View className="mb-8">
                  <Text className="text-foreground font-semibold mb-2">Telefone</Text>
                  <View className="flex-row items-center bg-surface border border-border rounded-lg">
                    <Text className="px-4 text-foreground font-semibold">🇵🇹 +351</Text>
                    <TextInput
                      placeholder="(11) 99999-9999"
                      placeholderTextColor="#999"
                      value={phone}
                      onChangeText={(text) => setPhone(formatPhone(text))}
                      keyboardType="phone-pad"
                      editable={!isLoading}
                      className="flex-1 px-4 py-3 text-foreground"
                    />
                  </View>
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                  onPress={handleRequestOTP}
                  disabled={isLoading}
                  className={`bg-primary rounded-full py-4 px-6 active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
                >
                  <Text className="text-center text-white font-semibold text-lg">
                    {isLoading ? 'Enviando...' : 'Enviar Código'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* OTP Code Input */}
                <View className="mb-8">
                  <Text className="text-foreground font-semibold mb-2">Código de Verificação</Text>
                  <TextInput
                    placeholder="000000"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={6}
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-center text-2xl tracking-widest"
                  />
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  disabled={isLoading}
                  className={`bg-primary rounded-full py-4 px-6 active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
                >
                  <Text className="text-center text-white font-semibold text-lg">
                    {isLoading ? 'Verificando...' : 'Verificar'}
                  </Text>
                </TouchableOpacity>

                {/* Resend Code */}
                <TouchableOpacity className="mt-6">
                  <Text className="text-center text-muted">
                    Não recebeu o código? <Text className="text-primary font-semibold">Reenviar</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-muted">ou</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Email Login */}
            <TouchableOpacity
              onPress={() => router.push(`/auth/login?role=${role}`)}
              className="border border-border rounded-full py-4 px-6 active:opacity-80"
            >
              <Text className="text-center text-foreground font-semibold text-lg">
                Entrar com Email
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
