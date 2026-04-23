Frontend Components:
- MessageBubble (components/chat/MessageBubble.tsx)
- Navbar (components/layout/Navbar.tsx)
- PrivacyModal (components/layout/PrivacyModal.tsx)
- ThemeProvider (components/layout/ThemeProvider.tsx)
- SettingsPanel (components/settings/SettingsPanel.tsx)

Frontend Pages:
- Home Page (app/page.tsx)
- Rooms List Page (app/rooms/page.tsx)
- Room Detail Page (app/room/[roomId]/page.tsx)

Components rendered in each page:

1. Home Page
   - ThemeProvider (via Root Layout)

2. Rooms List Page
   - ThemeProvider (via Root Layout)
   - Navbar
   - SettingsPanel (rendered within Navbar)
   - PrivacyModal (rendered within Navbar)

3. Room Detail Page
   - ThemeProvider (via Root Layout)
   - Navbar
   - SettingsPanel (rendered within Navbar)
   - PrivacyModal (rendered within Navbar)
   - MessageBubble
