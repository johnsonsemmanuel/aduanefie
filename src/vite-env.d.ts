/// <reference types="vite/client" />

interface Window {
  __SW_ENABLED__?: boolean
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
