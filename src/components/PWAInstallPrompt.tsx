import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-xl max-w-sm animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Download size={24} />
          <div>
            <h3 className="font-bold text-lg">Instalar Aplicativo</h3>
            <p className="text-sm opacity-90">Acesse seu cardápio rapidamente</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-white text-orange-500 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 bg-black bg-opacity-20 text-white font-bold py-2 rounded-lg hover:bg-opacity-30 transition-colors"
        >
          Depois
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
