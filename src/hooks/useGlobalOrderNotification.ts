import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const useGlobalOrderNotification = () => {
  const { businessConfig, orders, isAdmin } = useApp();
  const lastOrderCountRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  const notificationSettings = businessConfig.orderNotification || {
    isEnabled: false,
    volume: 0.7,
    duration: 300000, // 5 minutes
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
    isPlayingRef.current = false;
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
    } catch (error) {
      console.error('Erro ao criar som de notificação:', error);
    }
  };

  // Start notification loop
  const startNotificationLoop = () => {
    if (!notificationSettings.isEnabled || isPlayingRef.current || !isAdmin) return;
    
    isPlayingRef.current = true;
    
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

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Novo Pedido!', {
        body: 'Um novo pedido foi recebido.',
        icon: '/vite.svg'
      });
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Monitor new orders - only for admins
  useEffect(() => {
    if (!isAdmin) return;

    if (orders.length > lastOrderCountRef.current && lastOrderCountRef.current > 0 && notificationSettings.isEnabled) {
      console.log('Novo pedido detectado! Iniciando alarme...');
      startNotificationLoop();
    }
    lastOrderCountRef.current = orders.length;
  }, [orders.length, notificationSettings.isEnabled, isAdmin]);

  // Cleanup on unmount or when admin logs out
  useEffect(() => {
    if (!isAdmin) {
      cleanup();
    }
    
    return () => {
      cleanup();
    };
  }, [isAdmin]);

  // Stop notification when settings are disabled
  useEffect(() => {
    if (!notificationSettings.isEnabled && isPlayingRef.current) {
      cleanup();
    }
  }, [notificationSettings.isEnabled]);

  return {
    isPlaying: isPlayingRef.current,
    stopNotification: cleanup
  };
};