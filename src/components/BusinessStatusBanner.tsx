import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BusinessStatusBanner: React.FC = () => {
  const { businessConfig, isBusinessOpen, getCurrentBusinessStatus, isDarkMode } = useApp();

  if (!businessConfig.businessHours) return null;

  const isOpen = isBusinessOpen();
  const status = getCurrentBusinessStatus();

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} border-b ${borderColor} py-2`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2">
          {isOpen ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <Clock className="h-4 w-4 text-gray-500" />
          <span className={`text-sm font-medium ${textColor}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessStatusBanner;