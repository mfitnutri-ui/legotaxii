# LegoTaxi Native - Aplicação de Táxi Moderna

![LegoTaxi](https://d2xsxph8kpxj0f.cloudfront.net/310519663549301815/SuyDBGKvkGw4X2vEXn4e5L/icon-36xDerxHqNooMemzqHWie2.webp)

Um aplicativo de táxi 100% nativo para iOS e Android, desenvolvido com Expo React Native. Oferece uma experiência elegante e funcional para motoristas e passageiros.

## 🎯 Características Principais

### Para Passageiros
- ✅ Solicitar viagens com um toque
- ✅ Rastrear motorista em tempo real no mapa
- ✅ Chat em tempo real com o motorista
- ✅ Estimativa de tarifa automática
- ✅ Histórico de viagens
- ✅ Avaliações e comentários

### Para Motoristas
- ✅ Receber notificações de viagens em tempo real
- ✅ Aceitar/rejeitar viagens
- ✅ Rastrear GPS com atualização a cada segundo
- ✅ Ganhos do dia em tempo real
- ✅ Avaliações de passageiros
- ✅ Histórico de viagens

### Tecnologia
- ✅ Mapas gratuitos (OpenStreetMap + Nominatim + OSRM)
- ✅ Notificações push nativas (APNs + FCM)
- ✅ Geolocalização em tempo real
- ✅ WebSocket para comunicação em tempo real
- ✅ Supabase como backend
- ✅ Autenticação segura com Supabase Auth

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) ou Android Emulator
- Conta Supabase (gratuita em https://supabase.com)

## 🚀 Instalação Rápida

```bash
# 1. Clonar repositório
git clone https://github.com/mfitnutri-ui/legotaxii.git
cd legotaxii

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase

# 4. Iniciar desenvolvimento
pnpm dev

# 5. Abrir em dispositivo/emulador
# iOS: pnpm ios
# Android: pnpm android
# Web: pnpm dev:metro --web
```

## 📱 Estrutura do Projeto

```
app/
├── (app)/                    # Rotas protegidas (pós-login)
│   ├── driver-dashboard.tsx
│   ├── passenger-dashboard.tsx
│   ├── ride-chat.tsx
│   └── ride-rating.tsx
├── auth/                     # Rotas de autenticação
│   ├── welcome.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── phone-login.tsx
└── _layout.tsx              # Layout raiz

lib/
├── auth-context.tsx         # Contexto de autenticação
├── location-service.ts      # Serviço de geolocalização
├── notifications-service.ts # Notificações push
├── maps-service.ts          # Mapas e rotas
├── websocket-service.ts     # Comunicação em tempo real
└── store.ts                 # Estado global (Zustand)

components/
├── screen-container.tsx     # Wrapper SafeArea
├── interactive-map.tsx      # Mapa interativo
├── bottom-sheet.tsx         # Bottom sheet animado
└── ui/                      # Componentes UI

server/
├── _core/                   # Backend core
└── routers.ts              # Rotas API
```

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_WS_URL=ws://localhost:3000/ws

# Mapas (opcional - usa OpenStreetMap por padrão)
EXPO_PUBLIC_MAPBOX_TOKEN=your_token
```

## 💻 Desenvolvimento

### Iniciar Servidor de Desenvolvimento

```bash
# Iniciar Metro bundler + Backend
pnpm dev

# Ou separadamente:
pnpm dev:metro    # Metro (port 8081)
pnpm dev:server   # Backend (port 3000)
```

### Executar em Emulador

```bash
# iOS Simulator (macOS)
pnpm ios

# Android Emulator
pnpm android

# Web (para testes)
pnpm dev:metro --web
```

### Gerar QR Code

```bash
pnpm qr
```

Escaneie com o app Expo Go no seu dispositivo.

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Linter
pnpm lint

# Formatar código
pnpm format

# Type check
pnpm check
```

## 🏗️ Build para Produção

### iOS

```bash
# Build para TestFlight
eas build --platform ios --profile preview

# Build para App Store
eas build --platform ios --profile production
```

### Android

```bash
# Build para Google Play
eas build --platform android --profile production
```

## 📚 Documentação

- [Setup Detalhado](./SETUP.md)
- [Design System](./design.md)
- [TODO List](./todo.md)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

## 🔐 Segurança

- Autenticação com Supabase Auth
- Senhas criptografadas
- Tokens JWT seguros
- HTTPS/WSS obrigatório em produção
- Validação de entrada no backend

## 📊 Arquitetura

### Frontend (React Native)
- Expo Router para navegação
- NativeWind para styling
- Zustand para estado global
- TanStack Query para dados do servidor

### Backend (Node.js)
- Express.js
- Supabase (PostgreSQL)
- WebSocket para real-time
- Drizzle ORM

### Mapas
- OpenStreetMap (tiles)
- Nominatim (geocoding)
- OSRM (routing)

## 🐛 Troubleshooting

### Problema: "Cannot find module '@supabase/supabase-js'"
**Solução**: Execute `pnpm install`

### Problema: Permissão de localização negada
**Solução**: Conceda permissão de localização nas configurações do dispositivo

### Problema: WebSocket não conecta
**Solução**: Verifique se o backend está rodando em `localhost:3000`

### Problema: Notificações não funcionam
**Solução**: Certifique-se de que o dispositivo tem internet e notificações habilitadas

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👥 Equipe

- **Desenvolvedor**: LegoTaxi Team
- **Design**: LegoTaxi Design
- **Backend**: LegoTaxi Backend Team

## 📞 Suporte

Para questões e sugestões:
- 📧 Email: support@legotaxi.com
- 🐛 Issues: [GitHub Issues](https://github.com/mfitnutri-ui/legotaxii/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mfitnutri-ui/legotaxii/discussions)

## 🎉 Agradecimentos

- Expo team por excelente framework
- OpenStreetMap por mapas gratuitos
- Supabase por backend poderoso
- React Native community

---

**Versão**: 1.0.0  
**Última atualização**: Junho 2026  
**Status**: Em desenvolvimento ativo 🚀
