import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface NotificationProps {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (notif: Omit<NotificationProps, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notif: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif = { ...notif, id };
    setNotifications(prev => [...prev, newNotif]);

    if (notif.duration !== 0) {
      setTimeout(() => removeNotification(id), notif.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationContainer: React.FC<{
  notifications: NotificationProps[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  const colorMap = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`${colorMap[notif.type]} text-white p-4 rounded-lg shadow-lg animate-slide-in flex items-start justify-between`}
        >
          <div className="flex-1">
            <h3 className="font-bold">{notif.title}</h3>
            <p className="text-sm">{notif.message}</p>
          </div>
          <button
            onClick={() => onRemove(notif.id)}
            className="ml-4 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};
