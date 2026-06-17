# LegoTaxi Native - Project TODO

## Phase 1: Authentication & User Management
- [x] Splash screen com animação
- [x] Welcome screen (escolha Motorista/Passageiro)
- [x] Login screen com email/telefone
- [x] Phone verification (OTP)
- [x] Registration screen (Motorista/Passageiro)
- [ ] Profile completion (foto, documentos)
- [x] Supabase auth integration
- [ ] Biometric authentication (Face ID / Fingerprint)

## Phase 2: Motorista (Driver) Dashboard
- [x] Driver dashboard com mapa full-screen (sem scroll)
- [x] Status toggle (Online/Offline)
- [ ] Real-time GPS tracking
- [x] Bottom sheet com ride requests
- [ ] Ride request notification (áudio + haptic)
- [x] Accept/Decline ride functionality
- [ ] Driver profile screen

## Phase 3: Passageiro (Passenger) Dashboard
- [x] Passenger dashboard com mapa full-screen (sem scroll)
- [x] "Pedir Viagem" button (prominent CTA)
- [x] Pickup/Destination selection modal
- [ ] Ride request submission
- [ ] Waiting for driver screen
- [ ] Passenger profile screen

## Phase 4: Maps & Navigation
- [x] Integração com mapas gratuitos (OpenStreetMap + Nominatim + OSRM)
- [x] Real-time location tracking (GPS)
- [x] Route calculation
- [ ] Turn-by-turn navigation
- [ ] Marker clustering para múltiplas viagens
- [x] Map gestures (pinch, zoom, pan) - basic implementation

## Phase 5: Real-Time Communication
- [ ] WebSocket setup para real-time updates
- [ ] Driver location updates (real-time)
- [ ] Ride status updates
- [ ] In-ride chat (Motorista ↔ Passageiro)
- [x] Notification system (Expo Notifications)

## Phase 6: Push Notifications
- [x] Expo Notifications setup
- [ ] APNs configuration (iOS)
- [ ] FCM configuration (Android)
- [ ] Ride request notifications
- [ ] Ride status notifications
- [ ] Driver arrival notifications

## Phase 7: Payments & Wallet
- [ ] Wallet screen
- [ ] Payment method management
- [x] Ride pricing calculation (via maps-service)
- [ ] Payment processing
- [ ] Transaction history

## Phase 8: Ratings & Reviews
- [ ] Post-ride rating screen
- [ ] Driver rating system
- [ ] Passenger rating system
- [ ] Review history

## Phase 9: UI Components & Polish
- [x] Interactive map component
- [x] Bottom sheet component
- [ ] Ride card component
- [ ] Driver card component
- [ ] Rating component
- [ ] Loading states
- [ ] Error handling

## Phase 10: SOS & Safety
- [ ] SOS button (emergency)
- [ ] Emergency contacts
- [ ] Share ride details with trusted contacts
- [ ] In-ride safety features

## Phase 10: Settings & Preferences
- [ ] User settings screen
- [ ] Notification preferences
- [ ] Privacy settings
- [ ] Language selection
- [ ] Dark mode toggle

## Phase 11: GitHub Integration & Deployment
- [ ] Setup GitHub repository
- [ ] CI/CD pipeline
- [ ] Build for iOS (TestFlight)
- [ ] Build for Android (Google Play)
- [ ] Deployment automation

## Phase 12: Testing & QA
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Accessibility testing

## Bugs & Issues
- [ ] (None reported yet)

## Notes
- App deve ser 100% nativo (Expo React Native)
- Sem sobreposição e sem scroll nas telas pós-login
- Backend: Supabase
- Mapas: Gratuitos com navegação
- Notificações: Push nativas
- Geolocalização: GPS em tempo real
