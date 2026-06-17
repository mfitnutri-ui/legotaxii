import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { MaterialIcons } from '@expo/vector-icons';
import { useChatMessages, webSocketService } from '@/lib/websocket-service';
import { useAuth } from '@/lib/auth-context';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
  isOwn: boolean;
}

export default function RideChatScreen() {
  const router = useRouter();
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Subscribe to chat messages
  useChatMessages((chatMessage) => {
    if (chatMessage.rideId === rideId) {
      const message: Message = {
        id: chatMessage.id,
        senderId: chatMessage.senderId,
        senderName: chatMessage.senderName,
        message: chatMessage.message,
        timestamp: chatMessage.timestamp,
        isOwn: chatMessage.senderId === user?.id,
      };
      setMessages((prev) => [...prev, message]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  });

  const handleSendMessage = () => {
    if (!inputText.trim() || !rideId) return;

    setLoading(true);
    try {
      webSocketService.sendChatMessage(rideId, inputText);
      setInputText('');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row mb-3 ${item.isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <View
        className={`max-w-xs rounded-2xl px-4 py-3 ${
          item.isOwn
            ? 'bg-primary'
            : 'bg-surface border border-border'
        }`}
      >
        <Text className={`text-sm ${item.isOwn ? 'text-white' : 'text-muted'}`}>
          {item.senderName}
        </Text>
        <Text className={`text-base mt-1 ${item.isOwn ? 'text-white' : 'text-foreground'}`}>
          {item.message}
        </Text>
        <Text className={`text-xs mt-1 ${item.isOwn ? 'text-white text-opacity-70' : 'text-muted'}`}>
          {new Date(item.timestamp).toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FF6B35" />
          </TouchableOpacity>
          <Text className="text-foreground font-bold text-lg">Chat da Viagem</Text>
          <View className="w-6" />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <MaterialIcons name="chat" size={48} color="#999" />
              <Text className="text-muted mt-2">Nenhuma mensagem ainda</Text>
            </View>
          }
        />

        {/* Input */}
        <View className="flex-row items-center gap-2 pt-4 border-t border-border">
          <TextInput
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
            className="flex-1 bg-surface border border-border rounded-full px-4 py-3 text-foreground max-h-24"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || loading}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() && !loading ? 'bg-primary' : 'bg-primary opacity-50'
            }`}
          >
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
