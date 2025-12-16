import React, { useState } from 'react';
import { Clock, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BusinessHours } from '../../types';

const BusinessHoursManager: React.FC = () => {
  const { businessConfig, updateBusinessConfig, isDarkMode } = useApp();
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(
    businessConfig.businessHours || [
      { day: 'Segunda-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Terça-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Quarta-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Quinta-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Sexta-feira', isOpen: true, openTime: '18:00', closeTime: '23:30' },
      { day: 'Sábado', isOpen: true, openTime: '18:00', closeTime: '23:30' },
      { day: 'Domingo', isOpen: true, openTime: '18:00', closeTime: '23:00' }
    ]
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateBusinessConfig({ businessHours });
      alert('Horários de funcionamento salvos com sucesso!');
    } catch (error) {
      alert('Erro ao salvar horários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (index: number) => {
    setBusinessHours(prev => prev.map((day, i) => 
      i === index ? { ...day, isOpen: !day.isOpen } : day
    ));
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setBusinessHours(prev => prev.map((day, i) => 
      i === index ? { ...day, [field]: value } : day
    ));
  };

  const handleReset = () => {
    setBusinessHours([
      { day: 'Segunda-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Terça-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Quarta-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Quinta-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
      { day: 'Sexta-feira', isOpen: true, openTime: '18:00', closeTime: '23:30' },
      { day: 'Sábado', isOpen: true, openTime: '18:00', closeTime: '23:30' },
      { day: 'Domingo', isOpen: true, openTime: '18:00', closeTime: '23:00' }
    ]);
  };

  const setAllDays = (isOpen: boolean) => {
    setBusinessHours(prev => prev.map(day => ({ ...day, isOpen })));
  };

  const setAllTimes = (openTime: string, closeTime: string) => {
    setBusinessHours(prev => prev.map(day => ({ ...day, openTime, closeTime })));
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Clock className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Horários de Funcionamento</h2>
          <p className={`text-sm ${textSecondary}`}>
            Configure os horários de funcionamento da sua loja
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-4 border ${borderColor} rounded-lg mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setAllDays(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
          >
            Abrir Todos os Dias
          </button>
          <button
            onClick={() => setAllDays(false)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
          >
            Fechar Todos os Dias
          </button>
          <button
            onClick={() => setAllTimes('18:00', '23:00')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            18:00 - 23:00 (Todos)
          </button>
          <button
            onClick={() => setAllTimes('08:00', '18:00')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
          >
            08:00 - 18:00 (Todos)
          </button>
          <button
            onClick={handleReset}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <RotateCcw size={14} className="inline mr-1" />
            Resetar
          </button>
        </div>
      </div>

      {/* Days Configuration */}
      <div className="space-y-4 mb-6">
        {businessHours.map((day, index) => (
          <div key={day.day} className={`border ${borderColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={() => handleDayToggle(index)}
                    className="sr-only"
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${
                    day.isOpen ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      day.isOpen ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
                
                <div>
                  <h3 className={`font-semibold ${textColor}`}>{day.day}</h3>
                  <p className={`text-sm ${textSecondary}`}>
                    {day.isOpen ? 'Aberto' : 'Fechado'}
                  </p>
                </div>
              </div>
              
              {day.isOpen && (
                <div className="flex items-center space-x-3">
                  <div>
                    <label className={`block text-xs ${textSecondary} mb-1`}>Abertura</label>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs ${textSecondary} mb-1`}>Fechamento</label>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Current Status */}
      <div className={`p-4 border ${borderColor} rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Status Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${textSecondary} mb-1`}>Loja está:</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              businessConfig.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <Clock className="w-4 h-4 mr-1" />
              {businessConfig.isOpen ? 'Aberta' : 'Fechada'}
            </div>
          </div>
          
          <div>
            <p className={`text-sm ${textSecondary} mb-1`}>Próximo horário:</p>
            <p className={`font-medium ${textColor}`}>
              {(() => {
                const now = new Date();
                const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
                const dayMapping: { [key: string]: string } = {
                  'segunda-feira': 'Segunda-feira',
                  'terça-feira': 'Terça-feira',
                  'quarta-feira': 'Quarta-feira',
                  'quinta-feira': 'Quinta-feira',
                  'sexta-feira': 'Sexta-feira',
                  'sábado': 'Sábado',
                  'domingo': 'Domingo'
                };
                
                const todaySchedule = businessHours.find(
                  schedule => schedule.day === dayMapping[currentDay.toLowerCase()]
                );
                
                if (todaySchedule && todaySchedule.isOpen) {
                  return `${todaySchedule.openTime} - ${todaySchedule.closeTime}`;
                }
                
                return 'Fechado hoje';
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          <span>{loading ? 'Salvando...' : 'Salvar Horários'}</span>
        </button>
      </div>

      {/* Instructions */}
      <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
        <h4 className={`text-sm font-medium ${textColor} mb-2`}>Como funciona:</h4>
        <ul className={`text-sm ${textSecondary} space-y-1`}>
          <li>• Configure os horários para cada dia da semana</li>
          <li>• Use o toggle para abrir/fechar a loja em dias específicos</li>
          <li>• Os clientes verão se a loja está aberta ou fechada</li>
          <li>• O status é atualizado automaticamente baseado no horário atual</li>
          <li>• Use as ações rápidas para configurar vários dias de uma vez</li>
        </ul>
      </div>
    </div>
  );
};

export default BusinessHoursManager;