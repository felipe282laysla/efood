import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Clock, CheckCircle, Truck, Package, Phone, MapPin, Trash2, Eye, X } from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { updateOrder, saveCustomerNotification } from '../../services/firebaseService';
import { sendOrderStatusNotification, initializeEvolutionApi, isEvolutionApiConfigured } from '../../services/evolutionApiService';

interface OrderKanbanProps {
  isDarkMode: boolean;
}

const OrderKanban: React.FC<OrderKanbanProps> = ({ isDarkMode }) => {
  const { orders, businessConfig } = useApp();
  const { addNotification } = useNotification();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Inicializar Evolution API quando o componente montar e config estiver disponível
  useEffect(() => {
    if (businessConfig.evolutionApi?.isEnabled && businessConfig.evolutionApi?.domain && businessConfig.evolutionApi?.apiKey) {
      initializeEvolutionApi(businessConfig.evolutionApi.domain, businessConfig.evolutionApi.apiKey);
      console.log('✅ Evolution API inicializada no Kanban');
    }
  }, [businessConfig.evolutionApi]);

  const statusLabels = {
    pending: 'Novos Pedidos',
    preparing: 'Em Preparo',
    ready: 'Pronto',
    delivered: 'Entregue'
  };

  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending'),
    preparing: orders.filter(o => o.status === 'preparing'),
    ready: orders.filter(o => o.status === 'ready'),
    delivered: orders.filter(o => o.status === 'delivered')
  };

  const columns = [
    { id: 'pending', label: statusLabels.pending, color: 'red', icon: Clock },
    { id: 'preparing', label: statusLabels.preparing, color: 'yellow', icon: Package },
    { id: 'ready', label: statusLabels.ready, color: 'green', icon: CheckCircle },
    { id: 'delivered', label: statusLabels.delivered, color: 'blue', icon: Truck }
  ];

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const orderId = draggableId;
    const newStatus = destination.droppableId as 'pending' | 'preparing' | 'ready' | 'delivered';

    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (orderToUpdate) {
        // Atualizar o pedido no Firestore
        await updateOrder(orderId, { ...orderToUpdate, status: newStatus });
        
        // Mensagens de status para notificação
        const statusMessages = {
          pending: '📋 Novo pedido recebido!',
          preparing: '👨‍🍳 Seu pedido está em preparo',
          ready: '✅ Seu pedido está pronto!',
          delivered: '🚗 Pedido entregue com sucesso!'
        };

        // Notificação do admin
        addNotification({
          type: newStatus === 'delivered' ? 'success' : 'info',
          title: `Pedido #${orderId.slice(0, 6)}`,
          message: statusMessages[newStatus],
          duration: 5000
        });

        // Salvar notificação para o cliente
        if (orderToUpdate.customerPhone) {
          await saveCustomerNotification({
            orderId,
            customerPhone: orderToUpdate.customerPhone,
            customerName: orderToUpdate.customerName,
            status: newStatus,
            message: statusMessages[newStatus],
            timestamp: new Date(),
            read: false
          });
          console.log('Notificação de cliente salva para:', orderToUpdate.customerPhone);

          // Enviar notificação via Evolution API (WhatsApp) se habilitado
          if (businessConfig.evolutionApi?.isEnabled && businessConfig.evolutionApi?.sendNotifications && isEvolutionApiConfigured()) {
            try {
              const whatsappSent = await sendOrderStatusNotification(
                orderToUpdate.customerPhone,
                orderId,
                newStatus,
                statusMessages[newStatus],
                businessConfig.name || 'Nossa Loja'
              );
              
              if (whatsappSent) {
                console.log('✅ Notificação enviada via WhatsApp para:', orderToUpdate.customerPhone);
                addNotification({
                  type: 'success',
                  title: 'WhatsApp Enviado',
                  message: `Notificação enviada para ${orderToUpdate.customerPhone}`,
                  duration: 3000
                });
              } else {
                console.warn('⚠️ Falha ao enviar via Evolution API, mas notificação salva localmente');
              }
            } catch (whatsappError) {
              console.error('❌ Erro ao enviar WhatsApp:', whatsappError);
              // Continua normalmente, a notificação local foi salva
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao atualizar status do pedido',
        duration: 3000
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    // Função de delete será implementada quando deleteOrder existir no AppContext
    addNotification({
      type: 'info',
      title: 'Função não disponível',
      message: 'Delete via painel de Pedidos regular',
      duration: 3000
    });
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} min-h-screen p-4 sm:p-6 rounded-lg`}>
      <div className="mb-6">
        <h2 className={`text-3xl font-bold ${textColor} mb-2`}>Kanban - Pedidos</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Arraste os cards para mudar o status dos pedidos
        </p>
      </div>

      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
        <h3 className={`font-bold ${textColor} mb-2`}>Kanban - Gestão de Pedidos</h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          Arraste os cards para mudar o status dos pedidos
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {columns.map((col) => {
            const Icon = col.icon;
            const colOrders = ordersByStatus[col.id as keyof typeof ordersByStatus];
            const borderColor = {
              red: 'border-red-500',
              yellow: 'border-yellow-500',
              green: 'border-green-500',
              blue: 'border-blue-500'
            };

            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${cardBg} rounded-lg border-4 ${borderColor[col.color as keyof typeof borderColor]} p-4 min-h-[600px] ${
                      snapshot.isDraggingOver ? 'bg-opacity-80' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                      <Icon size={28} className={`text-${col.color}-500`} />
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${textColor}`}>{col.label}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {colOrders.map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${cardBg} p-4 rounded-lg border ${cardBorder} cursor-move transition-all ${
                                snapshot.isDragging ? 'shadow-xl ring-2 ring-orange-500 scale-105' : 'shadow-sm hover:shadow-md'
                              }`}
                            >
                              {/* Cabeçalho do card */}
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className={`font-bold text-lg ${textColor}`}>#{order.id.slice(0, 6).toUpperCase()}</p>
                                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-mono`}>
                                    {order.id.slice(0, 8).toUpperCase()}
                                  </p>
                                </div>
                                <span className="text-orange-500 font-bold text-lg">R$ {order.total?.toFixed(2) || '0.00'}</span>
                              </div>

                              {/* Nome do cliente */}
                              <p className={`font-bold ${textColor} text-sm mb-2 capitalize`}>
                                {order.customerName || 'Cliente'}
                              </p>

                              {/* Telefone */}
                              {order.customerPhone && (
                                <div className="flex items-center gap-2 mb-3">
                                  <Phone size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {order.customerPhone}
                                  </p>
                                </div>
                              )}

                              {/* Endereço */}
                              {order.customerAddress && (
                                <div className="flex items-start gap-2 mb-3">
                                  <MapPin size={14} className={`flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                                    {order.customerAddress}
                                  </p>
                                </div>
                              )}

                              {/* Itens */}
                              {order.items && order.items.length > 0 && (
                                <div className={`mb-3 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                  <p className={`text-xs font-semibold ${textColor} mb-1`}>Itens:</p>
                                  {order.items.slice(0, 2).map((item, idx) => (
                                    <p key={idx} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {item.quantity}x {item.name}
                                    </p>
                                  ))}
                                  {order.items.length > 2 && (
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                                      +{order.items.length - 2} itens
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Timestamp */}
                              <div className={`pt-2 border-t ${cardBorder} flex justify-between items-center`}>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {new Date(order.createdAt || 0).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowDetails(true);
                                    }}
                                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                    title="Ver detalhes"
                                  >
                                    <Eye size={14} className="text-blue-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                    title="Deletar pedido"
                                  >
                                    <Trash2 size={14} className="text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {colOrders.length === 0 && (
                        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          <p className="text-sm">Nenhum pedido</p>
                        </div>
                      )}
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal de detalhes */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${textColor}`}>Pedido #{selectedOrder.id.slice(0, 6).toUpperCase()}</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(selectedOrder.createdAt || 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className={`font-bold ${textColor} mb-2`}>Cliente</h3>
                <p className={`${textColor}`}>{selectedOrder.customerName}</p>
                {selectedOrder.customerPhone && <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedOrder.customerPhone}</p>}
                {selectedOrder.customerAddress && <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedOrder.customerAddress}</p>}
              </div>

              <div>
                <h3 className={`font-bold ${textColor} mb-2`}>Itens</h3>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className={`p-2 mb-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`font-semibold ${textColor}`}>{item.quantity}x {item.name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total</p>
                <p className={`text-2xl font-bold text-orange-500`}>R$ {selectedOrder.total?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderKanban;
