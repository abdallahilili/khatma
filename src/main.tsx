import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App.tsx';

// ─── Enregistrement du Service Worker avec auto-update ───
const updateSW = registerSW({
  // Appelé quand une nouvelle version est disponible et prête
  onNeedRefresh() {
    // Auto-update immédiat (pas de prompt à l'utilisateur)
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[PWA] Application prête pour une utilisation hors ligne');
  },
  onRegistered(r: ServiceWorkerRegistration | undefined) {
    if (r) {
      // Vérifier les mises à jour toutes les heures
      setInterval(() => r.update(), 60 * 60 * 1000);
    }
  },
  onRegisterError(error: unknown) {
    console.error('[PWA] Erreur enregistrement Service Worker:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
