import React, { useState } from 'react';
import { Trophy, Users, DollarSign, Calendar, Award, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GiveawayParticipant } from '../types';

const GiveawayManager: React.FC = () => {
  const { promotions, orders, isDarkMode } = useApp();
  const [selectedPromotion, setSelectedPromotion] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'winner' | 'participant'>('all');

  // Get active giveaway promotions
  const giveawayPromotions = promotions.filter(p => p.type === 'giveaway' && p.isActive);

  // Get participants for selected promotion
  const getParticipants = (): GiveawayParticipant[] => {
    if (!selectedPromotion) return [];
    
    const participants: GiveawayParticipant[] = [];
    
    orders.forEach(order => {
      if (order.giveawayParticipations) {
        order.giveawayParticipations.forEach(participation => {
          if (participation.promotionId === selectedPromotion) {
            participants.push({
              id: `${order.id}-${participation.promotionId}`,
              promotionId: participation.promotionId,
              customerName: order.customerName,
              customerPhone: order.customerPhone,
              participantNumber: participation.participantNumber,
              purchaseAmount: order.total,
              orderId: order.id,
              participationDate: order.date,
              isWinner: false // This would be set when drawing winners
            });
          }
        });
      }
    });
    
    return participants;
  };

  const participants = getParticipants();
  
  // Filter participants
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.participantNumber.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'winner' && participant.isWinner) ||
                         (filterStatus === 'participant' && !participant.isWinner);
    
    return matchesSearch && matchesFilter;
  });

  const selectedPromotionData = promotions.find(p => p.id === selectedPromotion);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Gerenciar Sorteios</h2>
          <p className={`text-sm ${textSecondary}`}>
            Acompanhe participantes e gerencie sorteios
          </p>
        </div>
      </div>

      {/* Promotion Selector */}
      <div className="mb-6">
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Selecionar Sorteio
        </label>
        <select
          value={selectedPromotion}
          onChange={(e) => setSelectedPromotion(e.target.value)}
          className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
        >
          <option value="">Selecione um sorteio</option>
          {giveawayPromotions.map(promotion => (
            <option key={promotion.id} value={promotion.id}>
              {promotion.title} - {promotion.giveawayRules?.prize}
            </option>
          ))}
        </select>
      </div>

      {selectedPromotion && selectedPromotionData && (
        <>
          {/* Promotion Info */}
          <div className={`border ${borderColor} rounded-lg p-4 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <p className={`text-sm ${textSecondary}`}>Prêmio</p>
                <p className={`font-semibold ${textColor}`}>
                  {selectedPromotionData.giveawayRules?.prize}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <p className={`text-sm ${textSecondary}`}>Valor Mínimo</p>
                <p className={`font-semibold ${textColor}`}>
                  R$ {selectedPromotionData.giveawayRules?.minPurchaseAmount.toFixed(2)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <p className={`text-sm ${textSecondary}`}>Participantes</p>
                <p className={`font-semibold ${textColor}`}>
                  {participants.length} / {selectedPromotionData.giveawayRules?.maxParticipants}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
                <p className={`text-sm ${textSecondary}`}>Término</p>
                <p className={`font-semibold ${textColor}`}>
                  {selectedPromotionData.endDate.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou número"
                  className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'winner' | 'participant')}
                className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="all">Todos</option>
                <option value="participant">Participantes</option>
                <option value="winner">Vencedores</option>
              </select>
            </div>
          </div>

          {/* Participants List */}
          <div className="space-y-3">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-8">
                <Users className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
                <p className={`${textSecondary}`}>
                  {participants.length === 0 
                    ? 'Nenhum participante ainda' 
                    : 'Nenhum participante encontrado com os filtros aplicados'
                  }
                </p>
              </div>
            ) : (
              <>
                <div className={`text-sm ${textSecondary} mb-4`}>
                  Mostrando {filteredParticipants.length} de {participants.length} participantes
                </div>
                
                {filteredParticipants.map((participant) => (
                  <div key={participant.id} className={`border ${borderColor} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          participant.isWinner ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          {participant.isWinner ? (
                            <Award size={20} />
                          ) : (
                            participant.participantNumber
                          )}
                        </div>
                        
                        <div>
                          <h3 className={`font-semibold ${textColor}`}>
                            {participant.customerName}
                            {participant.isWinner && (
                              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                VENCEDOR
                              </span>
                            )}
                          </h3>
                          <div className={`text-sm ${textSecondary} space-x-4`}>
                            <span>Número: #{participant.participantNumber}</span>
                            <span>Compra: R$ {participant.purchaseAmount.toFixed(2)}</span>
                            <span>Data: {participant.participationDate.toLocaleDateString('pt-BR')}</span>
                          </div>
                          {participant.customerPhone && (
                            <p className={`text-sm ${textSecondary}`}>
                              Tel: {participant.customerPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-sm ${textSecondary}`}>Pedido</p>
                        <p className={`font-mono text-sm ${textColor}`}>
                          #{participant.orderId.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Rules */}
          {selectedPromotionData.giveawayRules?.rules && (
            <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <h4 className={`text-sm font-medium ${textColor} mb-2`}>Regras do Sorteio:</h4>
              <p className={`text-sm ${textSecondary} whitespace-pre-wrap`}>
                {selectedPromotionData.giveawayRules.rules}
              </p>
            </div>
          )}
        </>
      )}

      {giveawayPromotions.length === 0 && (
        <div className="text-center py-8">
          <Trophy className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
          <p className={`${textSecondary}`}>Nenhum sorteio ativo encontrado</p>
          <p className={`text-sm ${textSecondary} mt-1`}>
            Crie um sorteio na seção de promoções para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default GiveawayManager;