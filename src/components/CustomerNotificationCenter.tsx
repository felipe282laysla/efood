import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Package } from 'lucide-react';
import { CustomerNotification } from '../types';
import { getCustomerNotifications, markNotificationAsRead } from '../services/firebaseService';

interface CustomerNotificationCenterProps {
  customerPhone: string;
  isDarkMode: boolean;
}

const CustomerNotificationCenter: React.FC<CustomerNotificationCenterProps> = ({ customerPhone, isDarkMode }) => {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!customerPhone) return;

    // Subscrever às notificações do cliente
    const unsubscribe = getCustomerNotifications(customerPhone, (notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [customerPhone]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const panelBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  return (
    <div className={`fixed bottom-4 right-4 z-50`}>
      {/* Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`relative p-3 rounded-full shadow-lg transition-all ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <div
          className={`absolute bottom-16 right-0 w-96 max-h-96 rounded-lg shadow-2xl border ${panelBg} overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <h3 className={`font-bold text-lg ${textColor}`}>Notificações dos Pedidos</h3>
              <button
                onClick={() => setShowPanel(false)}
                className={`p-1 rounded hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">{unreadCount} notificação(ões) não lida(s)</p>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className={`p-6 text-center ${textColor}`}>
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação ainda</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) {
                      handleMarkAsRead(notif.id);
                    }
                  }}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    notif.read
                      ? isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                      : isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-blue-50 border-blue-100'
                  } ${hoverBg}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notif.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${textColor}`}>
                            Pedido #{notif.orderId.slice(0, 6)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerNotificationCenter;
