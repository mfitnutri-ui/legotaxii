# LegoTaxi Native - Design System

## Overview
App de taxi 100% nativo para iOS e Android, com interface elegante sem sobreposição e sem scroll nas telas pós-login. Foco em UX intuitiva, acessibilidade e performance.

---

## Screen List

### Pre-Login Flows
1. **Splash Screen** - Logo + animação de carregamento
2. **Welcome Screen** - Escolha entre Motorista ou Passageiro
3. **Login Screen** - Email/Telefone + Senha
4. **Registration Screen** - Formulário de registo (Motorista/Passageiro)
5. **Phone Verification** - OTP verification
6. **Profile Completion** - Dados adicionais (foto, documentos para motorista)

### Motorista (Driver) Flows
7. **Driver Dashboard** - Mapa em tempo real, status online/offline, histórico de viagens
8. **Ride Request Notification** - Notificação de nova viagem (com áudio/haptic)
9. **Ride Details** - Detalhes da viagem aceita (pickup, destination, passenger info)
10. **Navigation Screen** - Integração com mapa nativo + navegação turn-by-turn
11. **In-Ride Chat** - Chat em tempo real com passageiro
12. **Ride Completion** - Rating + pagamento
13. **Driver Profile** - Dados do motorista, documentos, ratings

### Passageiro (Passenger) Flows
14. **Passenger Dashboard** - Mapa com localização atual, botão "Pedir Viagem"
15. **Request Ride Modal** - Seleção de pickup/destination, tipo de serviço
16. **Waiting for Driver** - Mapa com driver em tempo real, ETA
17. **Driver Arriving** - Notificação visual + som
18. **In-Ride Passenger** - Mapa, chat, SOS button
19. **Ride Completion** - Rating + pagamento
20. **Passenger Profile** - Dados do passageiro, histórico, favoritos

### Common Flows
21. **Settings Screen** - Preferências, notificações, privacidade
22. **Support/SOS** - Contacto de emergência, suporte
23. **Wallet/Payment** - Saldo, histórico de transações

---

## Primary Content & Functionality

### Motorista Dashboard (No Scroll, Full-Screen Map)
- **Top Bar** (Fixed)
  - Status toggle: Online/Offline (large switch)
  - Earnings today badge
  - Settings icon
  
- **Map Area** (Full-screen, no scroll)
  - Real-time GPS location
  - Available rides nearby (markers)
  - Current ride tracking (if active)
  
- **Bottom Sheet** (Swipeable, minimal)
  - Ride request cards (swipe up to expand)
  - Quick stats: Trips today, Rating, Earnings
  - Accept/Decline buttons

### Passageiro Dashboard (No Scroll, Full-Screen Map)
- **Top Bar** (Fixed)
  - Current location display
  - Quick filters (UberX, UberXL, etc.)
  - Account menu
  
- **Map Area** (Full-screen, no scroll)
  - Current location marker
  - Nearby drivers (if searching)
  - Destination marker (if trip active)
  
- **Bottom Sheet** (Fixed position)
  - "Pedir Viagem" button (prominent)
  - Quick destination suggestions
  - Ride status (if active)

---

## Key User Flows

### Motorista - Accept Ride Flow
1. Driver opens app → Dashboard with map
2. Notification arrives (sound + haptic)
3. Ride request card slides up from bottom
4. Driver taps "Accept" → Navigates to pickup location
5. Driver arrives → Passenger confirmation
6. Navigation to destination
7. Ride complete → Rating screen

### Passageiro - Request Ride Flow
1. Passenger opens app → Dashboard with map
2. Taps "Pedir Viagem" button
3. Pickup location auto-filled (current location)
4. Enters destination
5. Selects service type
6. Confirms request
7. Waits for driver (map shows driver approaching)
8. Driver arrives → Passenger boards
9. Navigation to destination
10. Ride complete → Rating screen

---

## Color Choices (LegoTaxi Brand)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|----------|-------|
| `primary` | `#FF6B35` | `#FF8C42` | Buttons, CTAs, highlights |
| `background` | `#FFFFFF` | `#0F0F0F` | Screen background |
| `surface` | `#F5F5F5` | `#1A1A1A` | Cards, sheets |
| `foreground` | `#1A1A1A` | `#FFFFFF` | Primary text |
| `muted` | `#666666` | `#999999` | Secondary text |
| `border` | `#E0E0E0` | `#333333` | Dividers |
| `success` | `#22C55E` | `#4ADE80` | Confirmations |
| `warning` | `#F59E0B` | `#FBBF24` | Warnings |
| `error` | `#EF4444` | `#F87171` | Errors |
| `driver-status-online` | `#22C55E` | `#4ADE80` | Driver online |
| `driver-status-offline` | `#9CA3AF` | `#6B7280` | Driver offline |

---

## Typography

- **Display**: SF Pro Display (iOS) / Roboto (Android) - 32px, Bold
- **Heading**: SF Pro Display / Roboto - 24px, Semibold
- **Body**: SF Pro Text / Roboto - 16px, Regular
- **Caption**: SF Pro Text / Roboto - 12px, Regular

---

## Spacing & Layout

- **Padding**: 16px (standard), 8px (compact), 24px (generous)
- **Border Radius**: 12px (cards), 8px (buttons), 4px (inputs)
- **Icon Size**: 24px (standard), 32px (large), 16px (small)
- **Line Height**: 1.5x font size

---

## Interaction Patterns

### Buttons
- Primary: Orange background, white text, 48px height, full width
- Secondary: Border only, 48px height
- Icon buttons: 44x44px (minimum touch target)

### Bottom Sheets
- Swipeable from bottom
- Drag handle indicator
- Snap to multiple positions
- Dismiss by swiping down

### Maps
- Pinch to zoom
- Double-tap to zoom in
- Long-press to set destination
- Drag to pan

### Notifications
- Toast (top): Temporary messages (2s)
- Badge: Unread count
- Full-screen: Ride requests (with sound + haptic)

---

## Accessibility

- Minimum touch target: 44x44px
- Color contrast: WCAG AA minimum
- VoiceOver/TalkBack support for all interactive elements
- Haptic feedback for confirmations
- Large text support (up to 200%)

---

## Performance Targets

- App launch: < 2s
- Map rendering: < 500ms
- Ride request notification: < 1s
- Navigation: Smooth 60fps

---

## Platform-Specific Considerations

### iOS
- Notch/Dynamic Island support
- Home indicator safe area
- Face ID / Touch ID biometric
- Push notifications via APNs

### Android
- Gesture navigation support
- Edge-to-edge layout
- Material Design 3 compliance
- Push notifications via FCM

---

## Future Enhancements

- Ride pooling (multiple passengers)
- Scheduled rides
- Loyalty program
- In-app promotions
- Advanced analytics for drivers
