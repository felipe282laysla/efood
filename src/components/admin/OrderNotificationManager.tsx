import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Square, Settings, Bell, BellOff, TestTube } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const OrderNotificationManager: React.FC = () => {
  const { businessConfig, updateBusinessConfig, orders, isDarkMode } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const notificationSettings = businessConfig.orderNotification || {
    isEnabled: false,
    volume: 0.7,
    duration: 300000, // 5 minutes in milliseconds
    soundType: 'bell'
  };

  // Cleanup function
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  // Initialize audio context
  const initializeAudio = () => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return audioContextRef.current;
    } catch (error) {
      console.error('Erro ao inicializar contexto de áudio:', error);
      return null;
    }
  };

  // Create notification sound
  const createNotificationSound = () => {
    const audioContext = initializeAudio();
    if (!audioContext) return;

    try {
      // Stop any existing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a pleasant notification sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(notificationSettings.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      // Clean up after sound ends
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
        if (oscillatorRef.current === oscillator) {
          oscillatorRef.current = null;
        }
        if (gainNodeRef.current === gainNode) {
          gainNodeRef.current = null;
        }
      };

      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🔔 Novo Pedido Recebido!', {
          body: 'Um novo pedido foi recebido no seu sistema.',
          icon: '/vite.svg',
          badge: '/vite.svg'
        });
      }
    } catch (error) {
      console.error('Erro ao criar som de notificação:', error);
    }
  };

  // Start notification loop
  const startNotificationLoop = () => {
    if (!notificationSettings.isEnabled || isPlaying) return;
    
    setIsPlaying(true);
    
    // Play sound immediately
    createNotificationSound();
    
    // Set up interval to repeat sound
    intervalRef.current = setInterval(() => {
      createNotificationSound();
    }, 2000); // Play every 2 seconds
    
    // Auto stop after configured duration
    timeoutRef.current = setTimeout(() => {
      cleanup();
    }, notificationSettings.duration);
  };

  // Stop notification
  const stopNotification = () => {
    cleanup();
  };

  // Test notification
  const testNotification = () => {
    if (!notificationSettings.isEnabled) {
      alert('Ative as notificações primeiro para testar');
      return;
    }
    
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(() => {
        createNotificationSound();
      });
    } else {
      createNotificationSound();
    }
  };

  // Monitor new orders
  useEffect(() => {
    if (orders.length > lastOrderCount && lastOrderCount > 0 && notificationSettings.isEnabled) {
      console.log('Novo pedido detectado! Iniciando notificação...');
      startNotificationLoop();
    }
    setLastOrderCount(orders.length);
  }, [orders.length, notificationSettings.isEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Stop notification when settings are disabled
  useEffect(() => {
    if (!notificationSettings.isEnabled && isPlaying) {
      stopNotification();
    }
  }, [notificationSettings.isEnabled]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleToggleNotification = async () => {
    const newSettings = {
      ...notificationSettings,
      isEnabled: !notificationSettings.isEnabled
    };
    
    try {
      await updateBusinessConfig({
        orderNotification: newSettings
      });
      
      if (!newSettings.isEnabled) {
        stopNotification();
      }
    } catch (error) {
      alert('Erro ao atualizar configurações de notificação');
    }
  };

  const handleVolumeChange = async (volume: number) => {
    const newSettings = {
      ...notificationSettings,
      volume: volume / 100
    };
    
    try {
      await updateBusinessConfig({
        orderNotification: newSettings
      });
    } catch (error) {
      alert('Erro ao atualizar volume');
    }
  };

  const handleDurationChange = async (minutes: number) => {
    const newSettings = {
      ...notificationSettings,
      duration: minutes * 60 * 1000 // Convert to milliseconds
    };
    
    try {
      await updateBusinessConfig({
        orderNotification: newSettings
      });
    } catch (error) {
      alert('Erro ao atualizar duração');
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 mb-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Bell className={`h-6 w-6 ${textColor}`} />
        <div>
          <h3 className={`text-lg font-bold ${textColor}`}>Notificações de Pedidos</h3>
          <p className={`text-sm ${textSecondary}`}>
            Configure alertas sonoros e visuais para novos pedidos
          </p>
        </div>
      </div>

      {/* Current Status */}
      {isPlaying && (
        <div className="mb-6 p-4 bg-orange-100 border border-orange-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-orange-600 animate-pulse" />
              <div>
                <p className="text-orange-800 font-medium">🔔 Alarme Tocando</p>
                <p className="text-orange-600 text-sm">Novo pedido recebido!</p>
              </div>
            </div>
            <button
              onClick={stopNotification}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Square size={16} />
              <span>Parar Agora</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-md font-semibold ${textColor}`}>Ativar Notificações</h4>
            <p className={`text-sm ${textSecondary}`}>
              Receba alertas sonoros e visuais quando novos pedidos chegarem
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.isEnabled}
              onChange={handleToggleNotification}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors ${
              notificationSettings.isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notificationSettings.isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
            <span className={`ml-3 ${textColor}`}>
              {notificationSettings.isEnabled ? (
                <div className="flex items-center space-x-1">
                  <Bell size={16} className="text-green-500" />
                  <span>Ativado</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <BellOff size={16} className="text-gray-400" />
                  <span>Desativado</span>
                </div>
              )}
            </span>
          </label>
        </div>

        {/* Volume Control */}
        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>
            Volume do Alarme
          </label>
          <div className="flex items-center space-x-4">
            <VolumeX className={`h-4 w-4 ${textSecondary}`} />
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(notificationSettings.volume * 100)}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              disabled={!notificationSettings.isEnabled}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 className={`h-4 w-4 ${textSecondary}`} />
            <span className={`text-sm ${textColor} w-12`}>
              {Math.round(notificationSettings.volume * 100)}%
            </span>
          </div>
        </div>

        {/* Duration Control */}
        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>
            Duração do Alarme (minutos)
          </label>
          <select
            value={notificationSettings.duration / 60000}
            onChange={(e) => handleDurationChange(parseInt(e.target.value))}
            disabled={!notificationSettings.isEnabled}
            className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value={1}>1 minuto</option>
            <option value={2}>2 minutos</option>
            <option value={3}>3 minutos</option>
            <option value={5}>5 minutos</option>
            <option value={10}>10 minutos</option>
            <option value={15}>15 minutos</option>
          </select>
          <p className={`text-xs ${textSecondary} mt-1`}>
            O alarme tocará por este tempo ou até você clicar em "Parar Agora"
          </p>
        </div>

        {/* Test Button */}
        <div className="flex space-x-3">
          <button
            onClick={testNotification}
            disabled={!notificationSettings.isEnabled || isPlaying}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TestTube size={16} />
            <span>Testar Notificação</span>
          </button>
          
          {isPlaying && (
            <button
              onClick={stopNotification}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Square size={16} />
              <span>Parar Alarme</span>
            </button>
          )}
        </div>

        {/* Notification Status */}
        <div className={`p-4 border ${borderColor} rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`text-sm font-medium ${textColor} mb-2`}>Status das Notificações:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${textSecondary}`}>Notificações do navegador:</span>
              <span className={`text-sm ${textColor} font-medium`}>
                {'Notification' in window 
                  ? Notification.permission === 'granted' 
                    ? '✅ Permitidas' 
                    : Notification.permission === 'denied'
                    ? '❌ Bloqueadas'
                    : '⚠️ Não solicitadas'
                  : '❌ Não suportadas'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${textSecondary}`}>Áudio:</span>
              <span className={`text-sm ${textColor} font-medium`}>
                {audioContextRef.current ? '✅ Disponível' : '⚠️ Não inicializado'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${textSecondary}`}>Total de pedidos:</span>
              <span className={`text-sm ${textColor} font-medium`}>{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
          <h4 className={`text-sm font-medium ${textColor} mb-2`}>Como funciona:</h4>
          <ul className={`text-sm ${textSecondary} space-y-1`}>
            <li>• O alarme toca automaticamente quando um novo pedido é recebido</li>
            <li>• O som continua pelo tempo configurado ou até você parar manualmente</li>
            <li>• Use o botão "Testar Notificação" para verificar o volume</li>
            <li>• O alarme só funciona quando as notificações estão ativadas</li>
            <li>• Você pode parar o alarme a qualquer momento clicando em "Parar Agora"</li>
            <li>• Notificações do navegador aparecem mesmo com a aba fechada</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderNotificationManager;