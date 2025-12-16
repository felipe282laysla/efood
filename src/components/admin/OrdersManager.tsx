import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Calendar, MapPin, Phone, Clock, Eye, Check, X, Truck, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

const OrdersManager: React.FC = () => {
  const { orders, updateOrder, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [orderToReject, setOrderToReject] = useState<string | null>(null);

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
    accepted: 'Aceito',
    out_for_delivery: 'Saiu para Entrega',
    rejected: 'Recusado'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    accepted: 'bg-blue-100 text-blue-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      alert('Status do pedido atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar status do pedido');
      console.error(error);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    setOrderToReject(orderId);
    setShowRejectionModal(true);
  };

  const confirmRejectOrder = async () => {
    if (!orderToReject) return;

    try {
      await updateOrder(orderToReject, { 
        status: 'rejected',
        rejectionReason: rejectionReason.trim() || 'Pedido recusado'
      });
      alert('Pedido recusado com sucesso!');
      setShowRejectionModal(false);
      setOrderToReject(null);
      setRejectionReason('');
    } catch (error) {
      alert('Erro ao recusar pedido');
      console.error(error);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.total - a.total;
      }
    });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.date);
    return orderDate.toDateString() === today.toDateString();
  });

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <ShoppingBag className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Gerenciar Pedidos</h2>
          <p className={`text-sm ${textSecondary}`}>
            Visualize e gerencie todos os pedidos
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <ShoppingBag className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>{orders.length}</p>
          <p className={`text-sm ${textSecondary}`}>Total de Pedidos</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>{todayOrders.length}</p>
          <p className={`text-sm ${textSecondary}`}>Pedidos Hoje</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-sm">R$</span>
          </div>
          <p className={`text-2xl font-bold ${textColor}`}>R$ {totalRevenue.toFixed(2)}</p>
          <p className={`text-sm ${textSecondary}`}>Receita Total</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className={`text-sm ${textSecondary}`}>Pendentes</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do cliente ou ID do pedido..."
              className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="all">Todos os status</option>
            {Object.entries(statusLabels).map(([status, label]) => (
              <option key={status} value={status}>{label}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="date">Mais recentes</option>
            <option value="total">Maior valor</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className={`text-sm ${textSecondary} mb-4`}>
          Mostrando {filteredOrders.length} de {orders.length} pedidos
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>
              {orders.length === 0 
                ? 'Nenhum pedido ainda' 
                : 'Nenhum pedido encontrado com os filtros aplicados'
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-semibold ${textColor}`}>
                      Pedido #{order.id.slice(-6)}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    {order.isFromLoggedUser && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        👤 Usuário Logado
                      </span>
                    )}
                    {order.giveawayParticipations && order.giveawayParticipations.length > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        🎁 Sorteio
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className={`text-sm ${textSecondary}`}>Cliente</p>
                      <p className={`font-medium ${textColor}`}>{order.customerName}</p>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${textSecondary}`}>Data</p>
                      <p className={`font-medium ${textColor}`}>
                        {order.date.toLocaleDateString('pt-BR')} às {order.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${textSecondary}`}>Total</p>
                      <p className={`font-bold text-green-600 text-lg`}>
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${textSecondary}`}>Itens</p>
                      <p className={`font-medium ${textColor}`}>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} itens
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} className={textSecondary} />
                      <span className={textSecondary}>
                        {order.customerLocation.length > 50 
                          ? `${order.customerLocation.substring(0, 50)}...` 
                          : order.customerLocation
                        }
                      </span>
                    </div>
                    
                    {order.customerPhone && (
                      <div className="flex items-center space-x-1">
                        <Phone size={14} className={textSecondary} />
                        <span className={textSecondary}>{order.customerPhone}</span>
                      </div>
                    )}
                  </div>

                  {order.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        <strong>Motivo da recusa:</strong> {order.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                    <span>Ver Detalhes</span>
                  </button>

                  {/* Action buttons based on status and type */}
                  {order.isFromLoggedUser ? (
                    // Buttons for logged user orders
                    <>
                      {order.status === 'pending' && (
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleStatusChange(order.id, 'accepted')}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            <Check size={16} />
                            <span>Aceitar</span>
                          </button>
                          <button
                            onClick={() => handleRejectOrder(order.id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <X size={16} />
                            <span>Recusar</span>
                          </button>
                        </div>
                      )}
                      
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
                          className="flex items-center space-x-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                        >
                          <Truck size={16} />
                          <span>Saiu para Entrega</span>
                        </button>
                      )}
                      
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="flex items-center space-x-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                        >
                          <CheckCircle size={16} />
                          <span>Entrega Feita</span>
                        </button>
                      )}
                    </>
                  ) : (
                    // Traditional status change for WhatsApp orders
                    order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Check size={16} />
                        <span>Confirmar</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto`}>
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <h2 className={`text-xl font-bold ${textColor}`}>
                Detalhes do Pedido #{selectedOrder.id.slice(-6)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Nome</p>
                    <p className={`font-medium ${textColor}`}>{selectedOrder.customerName}</p>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div>
                      <p className={`text-sm ${textSecondary}`}>Telefone</p>
                      <p className={`font-medium ${textColor}`}>{selectedOrder.customerPhone}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className={`text-sm ${textSecondary}`}>Endereço</p>
                    <p className={`font-medium ${textColor}`}>{selectedOrder.customerLocation}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className={`border ${borderColor} rounded-lg p-3`}>
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${textColor}`}>{item.product.name}</h4>
                          <p className={`text-sm ${textSecondary} mb-1`}>
                            Quantidade: {item.quantity}x
                          </p>
                          
                          {item.addOns.length > 0 && (
                            <p className={`text-sm ${textSecondary} mb-1`}>
                              <span className="font-medium">Adicionais: </span>
                              {item.addOns.map(addOn => addOn.name).join(', ')}
                            </p>
                          )}
                          
                          {item.observations && (
                            <p className={`text-sm ${textSecondary} mb-1`}>
                              <span className="font-medium">Obs: </span>
                              {item.observations}
                            </p>
                          )}
                          
                          <p className="font-bold text-orange-600">
                            R$ {((item.product.price + item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Giveaway Participation */}
              {selectedOrder.giveawayParticipations && selectedOrder.giveawayParticipations.length > 0 && (
                <div>
                  <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Participação em Sorteios</h3>
                  <div className="space-y-2">
                    {selectedOrder.giveawayParticipations.map((participation, index) => (
                      <div key={index} className={`p-3 border ${borderColor} rounded-lg bg-purple-50`}>
                        <p className={`font-medium ${textColor}`}>
                          🎁 Número da sorte: #{participation.participantNumber}
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          ID da promoção: {participation.promotionId}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className={`border-t ${borderColor} pt-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Status do Pedido</p>
                    <span className={`px-3 py-1 text-sm rounded-full ${statusColors[selectedOrder.status]}`}>
                      {statusLabels[selectedOrder.status]}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${textSecondary}`}>Total do Pedido</p>
                    <p className={`text-2xl font-bold text-green-600`}>
                      R$ {selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Observações</h3>
                  <p className={`${textSecondary} p-3 border ${borderColor} rounded-lg`}>
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {selectedOrder.rejectionReason && (
                <div>
                  <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Motivo da Recusa</h3>
                  <p className={`text-red-600 p-3 border border-red-200 rounded-lg bg-red-50`}>
                    {selectedOrder.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl max-w-md w-full p-6`}>
            <h3 className={`text-lg font-bold ${textColor} mb-4`}>Recusar Pedido</h3>
            <p className={`text-sm ${textSecondary} mb-4`}>
              Informe o motivo da recusa (opcional):
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Produto em falta, fora da área de entrega..."
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              rows={3}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={confirmRejectOrder}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Confirmar Recusa
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setOrderToReject(null);
                  setRejectionReason('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;