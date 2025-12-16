import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';

interface OrderKanbanProps {
  isDarkMode: boolean;
}

const OrderKanban: React.FC<OrderKanbanProps> = ({ isDarkMode }) => {
  const { orders, updateOrder } = useApp();
  const [status, setStatus] = useState('loading');

  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending'),
    preparing: orders.filter(o => o.status === 'preparing'),
    ready: orders.filter(o => o.status === 'ready'),
    delivered: orders.filter(o => o.status === 'delivered')
  };

  const columns = [
    { id: 'pending', label: 'Pendentes', color: 'red', icon: Clock },
    { id: 'preparing', label: 'Em Preparo', color: 'yellow', icon: Package },
    { id: 'ready', label: 'Pronto', color: 'blue', icon: CheckCircle },
    { id: 'delivered', label: 'Entregue', color: 'green', icon: Truck }
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
        await updateOrder(orderId, { ...orderToUpdate, status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} min-h-screen p-6 rounded-lg`}>
      <h2 className={`text-3xl font-bold ${textColor} mb-6`}>Kanban de Pedidos</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const Icon = col.icon;
            const colOrders = ordersByStatus[col.id as keyof typeof ordersByStatus];
            const colorClasses = {
              red: 'border-red-500 bg-red-50',
              yellow: 'border-yellow-500 bg-yellow-50',
              blue: 'border-blue-500 bg-blue-50',
              green: 'border-green-500 bg-green-50'
            };
            const darkColorClasses = {
              red: 'dark:border-red-400 dark:bg-red-900',
              yellow: 'dark:border-yellow-400 dark:bg-yellow-900',
              blue: 'dark:border-blue-400 dark:bg-blue-900',
              green: 'dark:border-green-400 dark:bg-green-900'
            };

            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${cardBg} rounded-lg border-4 ${colorClasses[col.color as keyof typeof colorClasses]} ${isDarkMode ? darkColorClasses[col.color as keyof typeof darkColorClasses] : ''} p-4 min-h-[500px]`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Icon size={24} className={`text-${col.color}-500`} />
                      <h3 className={`text-xl font-bold ${textColor}`}>{col.label}</h3>
                      <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
                              className={`${cardBg} p-4 rounded-lg border ${cardBorder} cursor-move transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-orange-500' : 'shadow-sm hover:shadow-md'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className={`font-bold ${textColor}`}>#{order.id.slice(0, 8)}</p>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {order.customerName || 'Cliente'}
                                  </p>
                                </div>
                                <span className="text-orange-500 font-bold">R$ {order.total?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className={`mt-3 pt-3 border-t ${cardBorder}`}>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(order.createdAt || 0).toLocaleTimeString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {colOrders.length === 0 && (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
    </div>
  );
};

export default OrderKanban;
